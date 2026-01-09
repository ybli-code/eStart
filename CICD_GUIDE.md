# Gitee Go 自动部署配置指南

您已成功创建了 Gitee Go 流水线配置文件 `.workflow/pipeline.yml`。要让它正常工作，请按照以下步骤操作：

## 1. 准备服务器环境
确保您的目标服务器（Linux）已满足以下条件：
- **Node.js**: 已安装 Node.js (推荐 v16+).
- **PM2**: 已安装 PM2 用于管理后端进程 (`npm install -g pm2`).
- **Caddy**: 建议安装 Caddy (或 Nginx) 用于反向代理前端静态文件和后端 API (Caddy 可自动管理 HTTPS).

## 2. 配置 Gitee 主机组
1. 进入 Gitee 仓库页面。
2. 点击顶部的 **「流水线」** 或 **「DevOps」** 标签。
3. 进入 **「设置」** -> **「主机管理」** (或主机组管理)。
4. 点击 **「新建主机组」**。
5. 为了让 Gitee 能连接您的服务器，您有两种方式：
   - **Gitee 自动安装 Agent**: 在服务器上运行 Gitee 提供的安装脚本。
   - **SSH 直连** (推荐): 导入服务器的 SSH 凭证。
6. 创建成功后，复制 **主机组 ID**。

## 3. 修改流水线配置
打开 `.workflow/pipeline.yml` 文件：
1. 找到 `hostGroupID: 'YOUR_HOST_GROUP_ID'`。
2. 将 `YOUR_HOST_GROUP_ID` 替换为您刚才复制的真实 ID。

## 4. 关于文件传输
Gitee Go 的 SSH 插件主要用于执行远程命令。传输构建文件 (`release.tar.gz`) 有多种方式，最简单的是在 **构建阶段** 使用 `scp` 命令。

### 修改 pipeline.yml 的 "构建前端" 步骤：
在 `commands` 的最后添加文件传输命令：
```yaml
          - echo "正在传输文件到服务器..."
          # 需要在 Gitee 凭证管理中添加 SSH 私钥，变量名为 SSH_PRIVATE_KEY
          - mkdir -p ~/.ssh
          - echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          - chmod 600 ~/.ssh/id_rsa
          - ssh-keyscan -H 1.2.3.4 >> ~/.ssh/known_hosts  # 替换为您的服务器IP
          - scp release.tar.gz root@1.2.3.4:/www/wwwroot/estart/
```
*(注意替换 `root`, `1.2.3.4` 和目录路径)*

## 5. Caddy 配置示例 (Caddyfile)
如果您使用 Caddy 作为 Web 服务器，配置会比 Nginx 更加简洁（且自动管理 HTTPS）。

修改 `/etc/caddy/Caddyfile`：

```caddyfile
your_domain.com {
    # 1. 后端接口代理
    # 使用 handle_path 指令，它会自动剥离 /apis 前缀，相当于 Nginx 的 rewrite
    handle_path /apis/* {
        reverse_proxy localhost:8081
    }

    # 2. 前端静态文件托管
    handle {
        root * /www/wwwroot/estart/search
        # 开启文件服务
        file_server
        # SPA 单页应用路由重定向：如果找不到文件，统一返回 index.html
        try_files {path} {path}/ /index.html
    }
}
```

## 6. 提交代码
完成配置后，提交代码到 Gitee `master` 分支，流水线将自动触发。
