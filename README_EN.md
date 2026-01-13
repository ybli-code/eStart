# e-start - Personalized Start Page

> A modern browser start page based on Vue.js and Express, supporting custom backgrounds, widgets, and shortcuts.

---

## 📖 Introduction

**e-start** is a simple, efficient, and highly customizable browser new tab page. It allows users to manage favorite websites, check weather, track to-dos, use sticky notes, and sync configurations via account login.

## ✨ Features

- 🔍 **Multi-engine Search**: Integrated Baidu, Bing, Google, and Translation with search suggestions.
- 🌤 **Live Weather**: Real-time weather display (Mocked based on QWeather API).
- 📝 **Productivity Tools**: Built-in To-Do list and Sticky Notes.
- 🎨 **Highly Customizable**: Custom wallpapers, icon layouts, and theme modes (Dark/Light).
- ☁️ **Cloud Sync**: Configuration (layout, wallpaper, notes) automatically syncs to the backend database after login.
- 📱 **Responsive Design**: Adapted for both PC and mobile devices.

## 🛠 Tech Stack

### Frontend
- **Vue 2.7** (Composition API supported)
- **Vue CLI 5** & **Webpack**
- **Element UI** - UI Component Library
- **Axios** - HTTP Client
- **Less** - CSS Preprocessor

### Backend
- **Node.js** & **Express**
- **JSON DB** - Simple Local File Database (NoSQL-like)
- **iconv-lite** - Handling Chinese encoding issues

## 🚀 Getting Started

### Prerequisites
- Node.js (Recommended v16+ or v20+)
- npm or yarn

### 1. Install Dependencies

This project consists of frontend and backend parts, dependencies need to be installed separately.

```bash
# Install frontend dependencies
yarn install
# or
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Start Services

You can use the provided script to start services with one click, automatically distinguishing between development and production environments.

**Development Mode (Local)**
Supports Hot Reload and separate frontend service.

```bash
bash start.sh development
# or
bash start.sh dev
```

**Production Mode (Server Deployment)**
Automatically builds frontend, uses Node.js to serve static resources and API for better performance.

```bash
bash start.sh production
# or
bash start.sh prod
```

## 📦 Deployment Guide (Server)

### Option A: Using Caddy (Recommended - Most Elegant)

We recommend using [Caddy](https://caddyserver.com/) as the gateway server. It automatically manages HTTPS certificates and the configuration is extremely simple.

1. **Install Caddy**: [https://caddyserver.com/docs/install](https://caddyserver.com/docs/install)
2. **Modify Configuration**: Edit `Caddyfile` in the root directory.

   `Caddyfile` Example:
   ```caddyfile
   # Scenario 1: IP Access only (No domain)
   :80 {
       reverse_proxy localhost:8081
   }

   # Scenario 2: With Domain (Auto SSL)
   # Replace example.com with your domain
   # example.com {
   #     reverse_proxy localhost:8081
   #     encode gzip
   # }
   ```

3. **Start Node Service**:
   ```bash
   # Start Node.js app in background
   bash start.sh prod
   # OR use PM2 (Recommended)
   cd server && pm2 start app.js --name "estart-server"
   ```

4. **Start Caddy**:
   ```bash
   # Run in root directory
   caddy run
   # OR start as daemon
   caddy start
   ```

   **💡 Why only proxy 8081?**
   You don't need to proxy frontend files separately. In production mode, our Node.js backend (`server/app.js`) acts as a **Full Stack Server**: it handles API requests AND automatically serves built frontend static assets (`../search` directory). This "Monolithic" deployment is simple and elegant, avoiding complex CORS and path issues.

### Option B: Using Nginx

If you already use Nginx, you can configure a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

## 🛠 CI/CD Automation

This project supports CI/CD automated deployment via **Gitee Go**.

- **Configuration File**: `.workflow/pipeline.yml`
- **Detailed Guide**: Please refer to [CICD_GUIDE.md](./CICD_GUIDE.md)

### Production Build

```bash
yarn build
```
The build artifacts are located in the `search` directory.

## 📂 Directory Structure

```
e-start/
├── public/             # Static assets
├── server/             # Backend server (Express)
│   ├── db.json         # User data storage
│   └── app.js          # Backend entry
├── src/                # Frontend source
│   ├── api/            # API requests
│   ├── components/     # Vue widgets
│   ├── store/          # Vuex State management
│   ├── views/          # Page views
│   └── ...
├── .workflow/          # Gitee CI/CD config
├── start.sh            # Startup script
├── vue.config.js       # Vue CLI config
└── ...
```

## 📄 License

MIT

---
*Created by [estart Team]*
