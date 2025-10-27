# 🚀 lobefeno.com 域名部署指南

## 📋 部署架构

```
lobefeno.com (域名)
    ↓ DNS 解析
云服务器 (阿里云/腾讯云)
    ↓
Nginx 反向代理
    ├─ / → 前端 (React)
    └─ /api → 后端 (Express)
              ↓
         MongoDB Atlas (云数据库)
```

---

## 方案选择

### 🎯 方案 A：免费云部署（推荐）

**前端：Vercel** + **后端：Railway** + **数据库：MongoDB Atlas**

**优点：**
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 自动部署
- ✅ 支持自定义域名

**缺点：**
- ⚠️ 需要 GitHub 仓库

#### 步骤：

1. **推送代码到 GitHub**
```bash
cd /Users/weifengchen/CLAUDE
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/ai-marketing-sop.git
git push -u origin main
```

2. **部署前端到 Vercel**
   - 访问 https://vercel.com
   - Import GitHub 仓库
   - 设置：
     - Framework: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - 环境变量：
     ```
     VITE_API_URL=https://你的后端地址.railway.app/api
     VITE_USE_MOCK=false
     ```
   - 添加自定义域名：`lobefeno.com`

3. **部署后端到 Railway**
   - 访问 https://railway.app
   - New Project → Deploy from GitHub
   - 选择仓库
   - 设置：
     - Root Directory: `backend`
     - Start Command: `npm run dev`
   - 环境变量（复制 `.env.production` 内容）：
     ```
     MONGODB_URI=mongodb+srv://admin:y0w868aJhZcUgMkL@cluster0.7lxvfdx.mongodb.net/ai-marketing-sop?retryWrites=true&w=majority&appName=Cluster0
     JWT_SECRET=6769a77da6d99e05f4945f2023711e5ba3d1af957f405a739fc7786fbf5dd452612beec7ffea6cb523fbb65e94de6fad85e4a08d7ae4232d38c430342993d008
     JWT_EXPIRES_IN=7d
     JWT_REFRESH_SECRET=7b8f562de69d4f17043c89378c9167bccf95186488c8920d7314bc2f1724a25498ab45b721bbda08dcc8f84257c60c50972df6b63fc98b1115a17e61f33c2f50
     JWT_REFRESH_EXPIRES_IN=30d
     BACKEND_PORT=3000
     FRONTEND_URL=https://lobefeno.com
     NODE_ENV=production
     ```

4. **配置 DNS 解析**
   - 在域名注册商处添加：
     ```
     类型: CNAME
     主机记录: @
     记录值: cname.vercel-dns.com
     TTL: 600
     ```

---

### 🎯 方案 B：云服务器部署

**需要购买云服务器**（阿里云/腾讯云 ECS，约 50-100元/月）

#### 步骤：

1. **购买云服务器**
   - 推荐：阿里云 ECS / 腾讯云 CVM
   - 配置：2核2G / Ubuntu 22.04
   - 获取公网 IP

2. **配置 DNS 解析**
```
在域名注册商处添加 A 记录：

类型: A
主机记录: @
记录值: 你的服务器公网IP
TTL: 600

类型: A
主机记录: www
记录值: 你的服务器公网IP
TTL: 600
```

3. **服务器环境配置**

```bash
# SSH 登录服务器
ssh root@你的服务器IP

# 更新系统
apt update && apt upgrade -y

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 安装 Nginx
apt install -y nginx

# 安装 PM2（进程管理）
npm install -g pm2

# 安装 Git
apt install -y git
```

4. **部署代码**

```bash
# 克隆代码（或用 scp 上传）
cd /var/www
git clone https://github.com/你的用户名/ai-marketing-sop.git lobefeno
cd lobefeno

# 后端配置
cd backend
npm install
cp ../.env.production .env
pm2 start src/server.ts --name lobefeno-backend
pm2 save
pm2 startup

# 前端构建
cd ../frontend
npm install
npm run build
# 生成 dist/ 目录
```

5. **配置 Nginx**

```bash
# 创建 Nginx 配置
nano /etc/nginx/sites-available/lobefeno.com
```

粘贴以下内容：

```nginx
server {
    listen 80;
    server_name lobefeno.com www.lobefeno.com;

    # 前端
    location / {
        root /var/www/lobefeno/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用配置
ln -s /etc/nginx/sites-available/lobefeno.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

6. **配置 HTTPS（免费 SSL 证书）**

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d lobefeno.com -d www.lobefeno.com

# 自动续期
certbot renew --dry-run
```

7. **配置防火墙**

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## ✅ 部署完成验证

1. **访问网站**
   - https://lobefeno.com
   - 应该能看到登录页面

2. **测试登录**
   - 邮箱：`test@example.com`
   - 密码：`password123`

3. **检查 API**
   - https://lobefeno.com/api/auth/me

---

## 🔒 安全检查清单

- [ ] 已修改 JWT 密钥（不使用默认值）
- [ ] MongoDB Atlas IP 白名单已配置
- [ ] HTTPS 已启用
- [ ] 防火墙已配置
- [ ] .env 文件权限正确（chmod 600）
- [ ] NODE_ENV=production

---

## 📞 常见问题

### Q1: DNS 解析需要多久？
**A:** 通常 10分钟 - 24小时，可以用 `nslookup lobefeno.com` 检查

### Q2: MongoDB Atlas 连接超时？
**A:** 检查 IP 白名单，添加服务器 IP 或使用 0.0.0.0/0（所有IP）

### Q3: 502 Bad Gateway？
**A:** 检查后端是否启动：`pm2 status` 和 `pm2 logs`

### Q4: CORS 错误？
**A:** 检查后端 .env 中 `FRONTEND_URL=https://lobefeno.com`

---

## 📝 当前状态

✅ **本地开发环境**
- 前端：http://localhost:8088
- 后端：http://localhost:3000
- 数据库：本地 MongoDB

⏳ **待部署到生产环境**
- MongoDB Atlas 已配置
- 域名：lobefeno.com（待解析）
- 服务器：待选择方案
