# estart - Personalized Start Page

> A modern browser start page based on Vue.js and Express, supporting custom backgrounds, widgets, and shortcuts.

---

## 📖 Introduction

**estart** is a simple, efficient, and highly customizable browser new tab page. It allows users to manage favorite websites, check weather, track to-dos, use sticky notes, and sync configurations via account login.

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

You can use the provided script to start all services, or start them manually.

**Option A: Using Script (Recommended)**

```bash
# Windows (Git Bash / WSL) or Linux/macOS
./start.sh
```

**Option B: Manual Start**

```bash
# Terminal 1: Start Backend
cd server
node app.js
# Backend running at: http://localhost:8081

# Terminal 2: Start Frontend
yarn serve
# Frontend running at: http://localhost:8088
```

Open your browser: `http://localhost:8088`

## 📦 Deployment

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
estart/
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
