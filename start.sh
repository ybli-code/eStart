#!/bin/bash

# --- 配置 ---
# 使用方法: bash start.sh [development|production] [extension]
# 示例:
#   bash start.sh dev          # 启动开发环境
#   bash start.sh prod         # 启动生产环境
#   bash start.sh prod ext     # 启动生产环境并构建插件
# 默认: production
MODE_INPUT=${1:-production}
BUILD_EXT=${2:-none}

# 标准化模式名称
if [[ "$MODE_INPUT" == "dev" || "$MODE_INPUT" == "development" ]]; then
    ENV_MODE="development"
elif [[ "$MODE_INPUT" == "prod" || "$MODE_INPUT" == "production" ]]; then
    ENV_MODE="production"
else
    echo "❌ 错误: 无效的模式 '$MODE_INPUT'"
    echo "用法: bash start.sh [development|production] [extension]"
    exit 1
fi

# 定义清理函数
cleanup() {
    echo "正在停止服务..."
    if command -v pkill >/dev/null 2>&1; then
        pkill -P $$
    else
        # Fallback for environments without pkill (e.g. Git Bash on Windows)
        kill $(jobs -p) 2>/dev/null
    fi
    exit
}
trap cleanup SIGINT SIGTERM EXIT

# 检查端口占用并清理
check_and_kill_port() {
    local port=$1
    echo "检查端口 $port 占用..."
    
    local pids=$(lsof -t -i:$port 2>/dev/null)
    
    if [ -z "$pids" ]; then
        if uname -s | grep -qE "MINGW|MSYS|CYGWIN|Windows_NT"; then
             pids=$(netstat -aon | grep ":$port " | awk '{print $NF}' | sort -u | grep -v "0")
        fi
    fi
    
    if [ -n "$pids" ]; then
        echo "⚠️  发现端口 $port 被进程占用 (PID: $pids)，正在强制关闭..."
        if uname -s | grep -qE "MINGW|MSYS|CYGWIN|Windows_NT"; then
            for pid in $pids; do
                taskkill //F //PID $pid >/dev/null 2>&1 || kill -9 $pid >/dev/null 2>&1
            done
        else
            kill -9 $pids
        fi
        echo "✅  已释放端口 $port"
    else
        echo "端口 $port 空闲。"
    fi
}

echo "======================================"
echo "   启动 e-start 服务 ($ENV_MODE)"
echo "======================================"

# 清理端口 8081 (后端) 和 8088 (前端)
check_and_kill_port 8081
if [ "$ENV_MODE" = "development" ]; then
    check_and_kill_port 8088
fi

# 1. 检查依赖
echo "[Step 1] 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "安装前端依赖..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "安装后端依赖..."
    cd server && npm install && cd ..
fi

# 2. 构建阶段
echo "[Step 2] 构建产物..."
if [[ "$BUILD_EXT" == "extension" || "$BUILD_EXT" == "ext" ]]; then
    echo "正在清理并重新构建浏览器插件..."
    # 清理根目录下的临时构建目录 dist
    rm -rf dist
    npm run build:extension
fi

if [ "$ENV_MODE" = "production" ]; then
    if [ ! -d "search" ]; then
        echo "未检测到构建产物 (search 目录)，正在构建 Web 端..."
        npm run build:web
    else
        echo "检测到现有构建产物，正在清理并重新构建 Web 端..."
        rm -rf search
        npm run build:web
    fi
fi

# 3. 运行阶段
echo "[Step 3] 运行服务..."
if [ "$ENV_MODE" = "development" ]; then
    # === 开发模式 ===
    echo "[Development] 启动模式: 前后端分离开发 (Hot Reload)"
    
    # 后端启动 (后台)
    cd server
    node app.js &
    sleep 2
    cd ..
    
    # 前端启动 (占用前台)
    echo "启动前端开发服务器..."
    npm run serve
else
    # === 生产模式 ===
    echo "[Production] 启动模式: 正式部署 (Node.js 托管静态资源)"
    
    # 启动后端 (作为唯一服务)
    echo "启动 Node.js 服务器 (Port: 8081)..."
    cd server
    # 如果环境中有 pm2，建议使用 pm2 启动
    if command -v pm2 >/dev/null 2>&1; then
        pm2 restart e-start-server --interpreter node -- app.js || pm2 start app.js --name "e-start-server"
    else
        node app.js
    fi
fi
