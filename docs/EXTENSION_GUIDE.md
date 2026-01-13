# e-start 浏览器插件安装与使用指南

本指南将指导您如何安装和使用 e-start 浏览器起始页插件。该插件支持 Microsoft Edge、Google Chrome、Mozilla Firefox、360极速浏览器和夸克浏览器。

## 1. 插件版本说明

构建脚本已为您生成了针对不同浏览器的适配包，存放在 `extension/dist/` 目录下：

- **Chrome / 360 / 夸克**: 提供 `.crx` 离线安装包和 `.zip` 压缩包。
- **Edge / Firefox**: 提供 `.zip` 压缩包（Edge 可直接使用 Chrome 的 `.crx`，Firefox 建议使用 `.zip` 加载）。

## 2. 安装方法

### 2.1 谷歌浏览器 (Google Chrome) / 360极速浏览器 / 夸克浏览器

**方法 A：CRX 离线包安装 (推荐)**
1. 打开浏览器，进入“扩展程序”页面（地址栏输入 `chrome://extensions/`）。
2. 开启右上角的“开发者模式”。
3. 将 `extension/dist/e-start-chrome.crx` 文件拖拽到该页面中。
4. 在弹出的确认框中点击“添加扩展程序”。

**方法 B：解压安装**
1. 解压 `extension/dist/e-start-chrome.zip` 到任意文件夹。
2. 进入 `chrome://extensions/` 页面，开启“开发者模式”。
3. 点击“加载已解压的扩展程序”，选择刚才解压的文件夹。

### 2.2 微软浏览器 (Microsoft Edge)
1. 打开 Edge，进入 `edge://extensions/`。
2. 开启左下角的“开发人员模式”。
3. 将 `extension/dist/e-start-edge.zip` 解压后，点击“加载解压缩的扩展”，选择该目录。
4. 或者直接拖拽 `.crx` 文件（需开启“允许来自其他应用商店的扩展”）。

### 2.3 火狐浏览器 (Mozilla Firefox)
1. 打开 Firefox，进入 `about:debugging#/runtime/this-firefox`。
2. 点击“临时载入附加组件”。
3. 选择 `extension/dist/firefox/manifest.json` 文件。
   *注意：临时载入的插件在浏览器重启后会失效。如需永久使用，需提交至 Firefox Add-ons 商店或进行签名。*

## 3. 功能特性
- **新标签页接管**: 安装后，每次打开新标签页都会显示 e-start 精美起始页。
- **快捷访问**: 点击浏览器右上角的插件图标，可快速弹出 e-start 面板。
- **跨平台兼容**: 核心功能在所有 Chromium 系浏览器和 Firefox 上表现一致。

## 4. 开发者构建指南

如果您修改了源码，可以运行以下命令重新生成插件包：

```bash
# 安装必要依赖
npm install

# 一键构建所有平台的插件包
npm run build:extension
```

构建完成后，最新的安装包将出现在 `extension/dist/` 目录中。

---
© 2026 e-start Project. All rights reserved.
