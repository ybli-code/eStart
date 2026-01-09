# estart - 个性化浏览器起始页

> 一个基于 Vue.js 和 Express 的现代化浏览器起始页，支持自定义背景、组件和快捷导航。

---

## 📖 简介

**estart** 是一个简洁、高效且高度可定制的浏览器新标签页（起始页）。它允许用户管理常用网站、查看天气、记录待办事项、使用便签，并支持账号同步配置。

## ✨ 功能特性

- 🔍 **多引擎搜索**：集成百度、必应、Google 及翻译功能，支持搜索建议（联想词）。
- 🌤 **实时天气**：基于和风天气接口（已本地 Mock）的实时天气显示。
- 📝 **效率工具**：内置待办事项（Todo）和便签（Notes）。
- 🎨 **高度定制**：支持自定义壁纸、图标布局、主题模式（深色/浅色）。
- ☁️ **云端同步**：注册账号后，配置信息（布局、壁纸、笔记等）可自动同步到后端数据库。
- 📱 **响应式设计**：适配 PC 端与移动端访问。

## 🛠 技术栈

### 前端
- **Vue 2.7** (Composition API supported)
- **Vue CLI 5** & **Webpack**
- **Element UI** - UI 组件库
- **Axios** - HTTP 请求
- **Less** - CSS 预处理器

### 后端
- **Node.js** & **Express**
- **JSON DB** - 简易本地文件数据库 (NoSQL-like)
- **iconv-lite** - 处理中文编码问题

## 🚀 快速开始

### 环境要求
- Node.js (推荐 v16+ 或 v20+)
- npm 或 yarn

### 1. 安装依赖

项目分为前端和后端两个部分，需要分别安装依赖。

```bash
# 安装前端依赖
yarn install
# 或
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 2. 启动服务

你可以使用我们提供的脚本一键启动，或手动分别启动。

**方式 A：使用脚本（推荐）**

```bash
# Windows (Git Bash / WSL) or Linux/macOS
./start.sh
```

**方式 B：手动启动**

```bash
# 终端 1：启动后端
cd server
node app.js
# 后端运行在: http://localhost:8081

# 终端 2：启动前端
yarn serve
# 前端运行在: http://localhost:8088
```

访问浏览器: `http://localhost:8088`

## 📦 部署

本项目支持通过 **Gitee Go** 进行 CI/CD 自动化部署。

- **配置文件**: `.workflow/pipeline.yml`
- **详细指南**: 请参考 [CICD_GUIDE.md](./CICD_GUIDE.md)

### 生产环境构建

```bash
yarn build
```
构建产物位于 `search` 目录（Why 'search'? 见 `vue.config.js` 配置）。

## 📂 目录结构

```
estart/
├── public/             # 静态资源
├── server/             # 后端服务 (Express)
│   ├── db.json         # 用户数据存储
│   └── app.js          # 后端入口
├── src/                # 前端源码
│   ├── api/            # API 接口请求
│   ├── components/     # Vue 组件
│   ├── store/          # Vuex 状态管理
│   ├── views/          # 页面视图
│   └── ...
├── .workflow/          # Gitee CI/CD 配置
├── start.sh            # 启动脚本
├── vue.config.js       # Vue CLI 配置
└── ...
```

## 📄 License

MIT

---
*Created by [estart Team]*
