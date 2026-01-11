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
    if command -v pkill >/dev/null 2>&1; then
        pkill -P $$
    else
        # Fallback for environments without pkill (e.g. Git Bash on Windows)
        # Kill all background jobs started by this shell
        kill $(jobs -p) 2>/dev/null
    fi
    exit
}
trap cleanup SIGINT SIGTERM EXIT

# 0. 检查端口占用并清理
check_and_kill_port() {
    local port=$1
    echo "检查端口 $port 占用..."
    
    # 获取占用端口的 PID (兼容 Linux/macOS)
    # lsof -t -i:8081
    local pids=$(lsof -t -i:$port 2>/dev/null)
    
    # Windows (Git Bash) fallback if lsof is missing or returns nothing
    if [ -z "$pids" ]; then
        if uname -s | grep -qE "MINGW|MSYS|CYGWIN|Windows_NT"; then
             # Find PID using netstat. Output format: Proto Local Address Foreign Address State PID
             # Filter for listening ports or established connections on the specific port
             pids=$(netstat -aon | grep ":$port " | awk '{print $NF}' | sort -u | grep -v "0")
        fi
    fi
    
    if [ -n "$pids" ]; then
        echo "⚠️  发现端口 $port 被进程占用 (PID: $pids)，正在强制关闭..."
        # On Windows, kill -9 might work if it's a cygwin PID, but taskkill is safer for Windows PIDs
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
echo "   启动 estart 服务 ($ENV_MODE)"
echo "======================================"

# 清理端口 8081 (后端) 和 8088 (前端)
check_and_kill_port 8081
if [ "$ENV_MODE" = "development" ]; then
    check_and_kill_port 8088
fi

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
    
    # 强制重新构建 (防止配置修改未生效)
    # 如果存在 search 目录但用户想强制更新，可以手动删除 search 目录，或者我们通过检查 .env 变更(较复杂)。
    # 这里为了稳妥，我们增加一个提示，并尝试自动清理旧的构建（如果是在 CI/CD 流程中通常是干净环境，但手动部署容易有缓存）
    
    if [ -d "search" ]; then
        echo "⚠️  检测到已存在构建产物 (search 目录)。"
        echo "⚠️  如果修改了配置(.env)，请务必删除 search 目录以触发重新构建: 'rm -rf search'"
        # 简单策略: 这里我们不自动删，避免意外，但给出强提示。
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
    else
        echo "检测到现有构建产物，跳过构建。(如需重构请删除 search 目录)"
    fi

    # 启动后端 (作为唯一服务)
    echo "启动 Node.js 服务器 (Port: 8081)..."
    cd server
    # 也可以用 pm2 启动: pm2 start app.js --name "lingo-server"
    node app.js
fi
