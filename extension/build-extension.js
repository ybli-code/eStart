const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');
const crx3 = require('crx3');

const rootDir = path.resolve(__dirname, '..');
const versionConfig = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'version.json'), 'utf8'));
const version = versionConfig.version;

const distDir = path.resolve(rootDir, 'dist');
const extensionDistDir = path.resolve(__dirname, 'dist');
const keyPath = path.resolve(__dirname, 'key.pem');

const browsers = [
  { name: 'chrome', manifestVersion: 3, format: 'crx' },
  { name: 'edge', manifestVersion: 3, format: 'zip' },
  { name: 'firefox', manifestVersion: 3, format: 'zip', specificSettings: { gecko: { id: "e-start@startpage.com" } } },
  { name: '360', manifestVersion: 3, format: 'crx' },
  { name: 'quark', manifestVersion: 3, format: 'crx' }
];

async function build() {
  console.log('Building Vue project for extension...');
  // Use specific build mode for extension to inject https://estart.top
  execSync('npm run build:extension:frontend', { cwd: rootDir, stdio: 'inherit' });

  if (!fs.existsSync(extensionDistDir)) {
    fs.mkdirSync(extensionDistDir);
  }

  // Ensure private key exists for CRX signing
  if (!fs.existsSync(keyPath)) {
    console.log('Generating private key for CRX signing...');
    // crx3 will generate a key if not provided, but we'll manage it
  }

  for (const browser of browsers) {
    console.log(`\n--- Packaging for ${browser.name} ---`);
    const browserDir = path.resolve(extensionDistDir, browser.name);
    
    // Clean and create browser directory
    if (fs.existsSync(browserDir)) {
      fs.rmSync(browserDir, { recursive: true });
    }
    fs.mkdirSync(browserDir);

    // Copy dist files
    console.log(`Copying files to ${browser.name} directory...`);
    copyRecursiveSync(distDir, browserDir);

    // Create manifest.json
    console.log(`Generating manifest.json for ${browser.name}...`);
    const manifest = generateManifest(browser);
    fs.writeFileSync(path.resolve(browserDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

    // Create ZIP
    const zipPath = path.resolve(extensionDistDir, `e-start-${browser.name}.zip`);
    console.log(`Creating ZIP: ${path.basename(zipPath)}`);
    await createZip(browserDir, zipPath);

    // Create CRX if needed
    if (browser.format === 'crx') {
      const crxPath = path.resolve(extensionDistDir, `e-start-${browser.name}.crx`);
      console.log(`Creating CRX: ${path.basename(crxPath)}`);
      await createCrx(browserDir, crxPath);
    }
  }

  // Clean up temporary root dist directory after build
  console.log('\nCleaning up temporary build files...');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }

  console.log('\nBuild complete! All packages are in extension/dist/');
}

function generateManifest(browser) {
  const iconExists = (size) => fs.existsSync(path.resolve(distDir, `icon-${size}.png`));
  
  const icons = {};
  [16, 48, 128].forEach(size => {
    if (iconExists(size)) {
      icons[size] = `icon-${size}.png`;
    } else {
      icons[size] = "favicon.svg";
    }
  });

  const base = {
    manifest_version: browser.manifestVersion,
    name: "易始起始页 (e-start)",
    version: version,
    description: "一个精美且可定制的起始页扩展。",
    icons: icons,
    permissions: ["storage", "unlimitedStorage"],
    host_permissions: ["https://estart.top/*"]
  };

  // New Tab override is the primary feature
  base.chrome_url_overrides = {
    newtab: "index.html"
  };

  if (browser.manifestVersion === 3) {
    base.action = {
      default_popup: "index.html",
      default_icon: icons
    };
  } else {
    base.browser_action = {
      default_popup: "index.html",
      default_icon: icons
    };
  }

  if (browser.specificSettings) {
    base.browser_specific_settings = browser.specificSettings;
  }

  return base;
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function createZip(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

function createCrx(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    crx3([sourceDir], {
      keyPath: keyPath,
      crxPath: outPath
    })
    .then(() => resolve())
    .catch(err => reject(err));
  });
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
