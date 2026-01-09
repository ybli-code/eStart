#!/bin/bash

# 定义清理函数，退出脚本时杀死后台进程
cleanup() {
    echo "正在停止服务..."
    # 杀死当前 shell 的所有子进程
    pkill -P $$
    exit
}

# 捕获退出信号
trap cleanup SIGINT SIGTERM EXIT

echo "======================================"
echo "   正在启动 estart 服务..."
echo "======================================"

# 1. 启动后端 (进入 server 目录)
echo "[1/2] 启动后端服务 (Port: 8081)..."
cd server
# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "发现 server 依赖未安装，正在安装..."
    npm install
fi
# 后台启动 node 进程
node app.js &
PID_BACKEND=$!
cd ..

# 等待一秒让后端先跑起来
sleep 1

# 2. 启动前端
echo "[2/2] 启动前端服务 (Port: 8088)..."
# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "发现前端依赖未安装，正在安装..."
    yarn install
fi

# 启动前端 (这将占用当前终端)
yarn serve

# 如果前端退出了，脚本也会结束，触发 cleanup
