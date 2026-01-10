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

你可以使用我们提供的脚本一键启动，自动区分开发和生产环境。

**开发模式 (本地开发)**
支持热重载 (Hot Reload) 和独立前端服务。

```bash
bash start.sh development
# 或简写
bash start.sh dev
```

**生产模式 (服务器部署)**
自动构建前端，使用 Node.js 托管静态资源和 API，性能更优。

```bash
bash start.sh production
# 或简写
bash start.sh prod
```

## 📦 部署指南 (Server)

### 使用 Caddy

本项目推荐使用 [Caddy](https://caddyserver.com/) 作为网关服务器，它能自动管理 HTTPS 证书，配置极其简单。

1. **安装 Caddy**: [https://caddyserver.com/docs/install](https://caddyserver.com/docs/install)
2. **修改配置文件**: 编辑根目录下的 `Caddyfile`。

   `Caddyfile` 示例（根据实际情况修改）:
   ```caddyfile
   # 场景 1: 仅通过 IP 访问 (没有域名)
   :80 {
       reverse_proxy localhost:8081
   }

   # 场景 2: 使用域名 (自动申请并配置 SSL 证书)
   # 将 example.com 替换为你的真实域名
   # example.com {
   #     reverse_proxy localhost:8081
   #     encode gzip
   # }
   ```

3. **启动 Node 服务**:
   ```bash
   # 后台启动 Node.js 应用
   bash start.sh prod
   # 或者使用 PM2 (推荐)
   cd server && pm2 start app.js --name "estart-server"
   ```
4. **启动 Caddy**:
   ```bash
   # 在项目根目录运行
   caddy run
   # 或作为服务后台运行
   caddy start
   ```

   **💡 为什么只需要代理 8081？**
   不需要单独配置前端文件的代理。在生产模式下，我们的 Node.js 后端 (`server/app.js`) 已经配置为**全栈服务器**：不仅处理 API 请求，还会自动托管前端构建好的静态资源 (`../search` 目录)。这种"单体化"部署方式最简单且优雅，避免了复杂的跨域和路径配置问题。

```

## 🛠 CI/CD 自动化

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
