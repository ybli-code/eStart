#!/bin/bash

# --- 配置 ---
# 可选: development (dev) 或 production (prod)
# 默认: production
# 使用方法: bash start.sh [development|production]
MODE_INPUT=${1:-production}

# 标准化模式名称
if [[ "$MODE_INPUT" == "dev" || "$MODE_INPUT" == "development" ]]; then
    ENV_MODE="development"
elif [[ "$MODE_INPUT" == "prod" || "$MODE_INPUT" == "production" ]]; then
    ENV_MODE="production"
else
    echo "❌ 错误: 无效的模式 '$MODE_INPUT'"
    echo "用法: bash start.sh [development|production]"
    exit 1
fi

# 定义清理函数
cleanup() {
    echo "正在停止服务..."
    pkill -P $$
    exit
}
trap cleanup SIGINT SIGTERM EXIT

echo "======================================"
echo "   启动 estart 服务 ($ENV_MODE)"
echo "======================================"

# 1. 准备后端环境
echo "[Step 1] 检查后端依赖..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# 2. 根据环境启动
if [ "$ENV_MODE" = "development" ]; then
    # === 开发模式 ===
    echo "[Development] 启动模式: 前后端分离开发 (Hot Reload)"
    
    # 后端启动 (后台)
    cd server
    node app.js &
    # 等待一秒让后端先跑起来
    sleep 2
    cd ..
    
    # 前端启动 (占用前台)
    echo "启动前端开发服务器..."
    # 确保依赖安装
    if [ ! -d "node_modules" ]; then
        yarn install
    fi
    yarn serve

else
    # === 生产模式 (默认) ===
    echo "[Production] 启动模式: 正式部署 (Node.js 托管静态资源)"
    
    # 检查是否已构建
    if [ ! -d "search" ]; then
        echo "未检测到构建产物 (search 目录)，正在构建前端..."
        if [ ! -d "node_modules" ]; then
            yarn install
        fi
        # 使用 build:web 脚本，因为 outputDir 依赖 NODE_ENV=web
        npm run build:web
    else
        echo "检测到现有构建产物，跳过构建。(如需重构请删除 search 目录)"
    fi

    # 启动后端 (作为唯一服务)
    echo "启动 Node.js 服务器 (Port: 8081)..."
    cd server
    # 也可以用 pm2 启动: pm2 start app.js --name "lingo-server"
    node app.js
fi
    
    # 检查是否已构建
    if [ ! -d "search" ]; then
        echo "未检测到构建产物 (search 目录)，正在构建前端..."
        if [ ! -d "node_modules" ]; then
            yarn install
        fi
        # 使用 build:web 脚本，因为 outputDir 依赖 NODE_ENV=web
        npm run build:web
    else
        echo "检测到现有构建产物，跳过构建。(如需重构请删除 search 目录)"
    fi

    # 启动后端 (作为唯一服务)
    echo "启动 Node.js 服务器 (Port: 8081)..."
    cd server
    # 也可以用 pm2 启动: pm2 start app.js --name "lingo-server"
    node app.js
fi
