# 🚀 lobefeno.com 免费云部署指南（Vercel + Railway）

## 📋 部署架构

```
lobefeno.com (域名)
    ↓ DNS 解析
Vercel (前端 React)
    ↓ API 请求
Railway (后端 Express)
    ↓
MongoDB Atlas (云数据库)
```

---

## ✅ 前置准备检查

- [x] GitHub 账号已准备
- [x] lobefeno.com 域名已注册（www.szhot.com）
- [x] MongoDB Atlas 已配置
- [x] 本地代码已完成优化

---

## 📦 第一步：推送代码到 GitHub

### 1. 初始化 Git 仓库

```bash
cd /Users/weifengchen/CLAUDE

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: AI营销SOP系统 - 完整登录功能 + 代码优化"
```

### 2. 在 GitHub 创建新仓库

1. 访问：https://github.com/new
2. 仓库名：`ai-marketing-sop` 或 `lobefeno-app`
3. 可见性：**Private**（推荐）或 Public
4. **不要**勾选 "Add README" / ".gitignore" / "license"（我们已经有了）
5. 点击 "Create repository"

### 3. 推送到 GitHub

```bash
# 添加远程仓库（替换成您的 GitHub 用户名）
git remote add origin https://github.com/你的用户名/ai-marketing-sop.git

# 推送代码
git branch -M main
git push -u origin main
```

---

## 🚂 第二步：部署后端到 Railway

### 1. 注册 Railway 账号

1. 访问：https://railway.app
2. 使用 GitHub 账号登录
3. 授权 Railway 访问您的 GitHub 仓库

### 2. 创建新项目

1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择刚才创建的仓库 `ai-marketing-sop`
4. 点击 "Deploy Now"

### 3. 配置后端服务

#### 3.1 设置根目录

1. 点击您的服务（Service）
2. 进入 "Settings" 标签
3. 找到 "Root Directory"
4. 设置为：`backend`
5. 点击 "Save"

#### 3.2 设置启动命令

1. 在 "Settings" 中找到 "Start Command"
2. 设置为：`npm run dev`
3. 点击 "Save"

#### 3.3 添加环境变量

1. 进入 "Variables" 标签
2. 点击 "New Variable"
3. 添加以下环境变量：

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

### 4. 获取后端地址

1. 部署完成后，在 "Settings" 中找到 "Domains"
2. 复制默认域名，类似：`your-backend-xxxx.railway.app`
3. **记住这个地址**，下一步需要用到

### 5. 测试后端 API

访问：`https://your-backend-xxxx.railway.app/health`

应该看到：
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

---

## 🎨 第三步：部署前端到 Vercel

### 1. 注册 Vercel 账号

1. 访问：https://vercel.com
2. 使用 GitHub 账号登录

### 2. 导入 GitHub 仓库

1. 点击 "Add New..." → "Project"
2. 选择您的仓库 `ai-marketing-sop`
3. 点击 "Import"

### 3. 配置前端项目

#### 3.1 基础设置

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 3.2 环境变量

点击 "Environment Variables"，添加：

```
Name: VITE_API_URL
Value: https://your-backend-xxxx.railway.app/api

Name: VITE_USE_MOCK
Value: false
```

**重要：** 将 `your-backend-xxxx.railway.app` 替换为第二步获取的 Railway 后端地址！

### 4. 部署

1. 点击 "Deploy"
2. 等待构建完成（约 1-2 分钟）
3. 部署成功后，会得到一个 Vercel 默认域名：`your-project-xxxx.vercel.app`

### 5. 测试前端

访问：`https://your-project-xxxx.vercel.app`

应该能看到登录页面！

---

## 🌐 第四步：配置自定义域名 lobefeno.com

### 1. 在 Vercel 添加域名

1. 进入 Vercel 项目的 "Settings"
2. 找到 "Domains"
3. 添加域名：
   - 主域名：`lobefeno.com`
   - 带 www：`www.lobefeno.com`

### 2. 在 www.szhot.com 配置 DNS

登录 www.szhot.com 域名管理后台，添加以下 DNS 记录：

#### 方案 A：使用 CNAME（推荐）

```
类型: CNAME
主机记录: @
记录值: cname.vercel-dns.com.
TTL: 600

类型: CNAME
主机记录: www
记录值: cname.vercel-dns.com.
TTL: 600
```

#### 方案 B：使用 A 记录（如果不支持 CNAME）

```
类型: A
主机记录: @
记录值: 76.76.21.21
TTL: 600

类型: A
主机记录: www
记录值: 76.76.21.21
TTL: 600
```

**Vercel 的 A 记录 IP 地址：** 查看 https://vercel.com/docs/concepts/projects/custom-domains

### 3. 验证域名

1. DNS 配置完成后，回到 Vercel
2. 点击域名旁的 "Refresh" 按钮
3. 等待验证（可能需要 10分钟 - 24小时）
4. 验证通过后，Vercel 会自动配置 HTTPS

### 4. 更新后端环境变量

回到 Railway，更新 `FRONTEND_URL`：

```
FRONTEND_URL=https://lobefeno.com
```

点击 "Save" 后，Railway 会自动重新部署。

---

## 🎉 第五步：完成部署

### 1. 访问网站

打开浏览器访问：**https://lobefeno.com**

您应该能看到：
- ✅ 登录页面
- ✅ HTTPS 绿锁
- ✅ 快速加载

### 2. 测试登录

使用测试账号登录：
- 📧 邮箱：`test@example.com`
- 🔑 密码：`password123`

### 3. 检查 API 连接

1. 打开浏览器开发者工具（F12）
2. 进入 "Network" 标签
3. 输入账号密码，点击登录
4. 查看网络请求：
   - ✅ 请求到 `https://your-backend-xxxx.railway.app/api/auth/login`
   - ✅ 返回 200 状态码
   - ✅ 成功跳转到 Dashboard

---

## 🔧 常见问题排查

### Q1: 前端无法连接后端（CORS 错误）

**检查：**
1. Railway 后端的 `FRONTEND_URL` 是否设置为 `https://lobefeno.com`
2. 后端是否成功重启（查看 Railway 部署日志）

**解决：**
```bash
# 在 Railway 环境变量中确认
FRONTEND_URL=https://lobefeno.com
```

### Q2: 登录提示 "Network Error"

**检查：**
1. Vercel 环境变量 `VITE_API_URL` 是否正确
2. Railway 后端是否正常运行

**解决：**
```bash
# 访问后端健康检查
https://your-backend-xxxx.railway.app/health

# 应该返回 JSON，表示后端正常
```

### Q3: MongoDB Atlas 连接超时

**解决：**
1. 登录 MongoDB Atlas
2. 进入 "Network Access"
3. 添加 IP 白名单：`0.0.0.0/0`（允许所有 IP）

### Q4: 域名 DNS 解析失败

**检查：**
```bash
# Mac/Linux 命令行检查
nslookup lobefeno.com

# 应该返回 Vercel 的 IP 地址
```

**解决：**
- 等待 DNS 传播（通常 10分钟 - 24小时）
- 检查 DNS 配置是否正确
- 使用 https://dnschecker.org 检查全球解析情况

---

## 📝 部署检查清单

**Railway 后端：**
- [ ] 代码已推送到 GitHub
- [ ] Railway 项目已创建
- [ ] Root Directory 设置为 `backend`
- [ ] 所有环境变量已添加
- [ ] 后端成功部署并运行
- [ ] 健康检查 `/health` 返回正常

**Vercel 前端：**
- [ ] Vercel 项目已创建
- [ ] Root Directory 设置为 `frontend`
- [ ] 环境变量 `VITE_API_URL` 已设置
- [ ] 前端成功部署
- [ ] 可以访问默认域名

**自定义域名：**
- [ ] 域名已在 Vercel 添加
- [ ] DNS 记录已配置
- [ ] 域名验证通过
- [ ] HTTPS 已自动配置
- [ ] 可以访问 https://lobefeno.com

**功能测试：**
- [ ] 登录功能正常
- [ ] API 请求成功
- [ ] Token 存储正常
- [ ] 退出登录正常

---

## 🎊 恭喜！部署完成

您的 AI 营销 SOP 系统已成功部署到：

- 🌐 **网站地址：** https://lobefeno.com
- 🎨 **前端托管：** Vercel（自动 HTTPS）
- 🚂 **后端托管：** Railway（免费套餐）
- 💾 **数据库：** MongoDB Atlas（免费套餐）

**✅ 完全免费，性能优秀，自动扩展！**

---

## 📞 后续支持

**需要帮助？**
- Railway 文档：https://docs.railway.app
- Vercel 文档：https://vercel.com/docs
- MongoDB Atlas 文档：https://www.mongodb.com/docs/atlas/

**常用命令：**
```bash
# 更新代码并自动部署
git add .
git commit -m "更新内容"
git push

# Vercel 和 Railway 会自动检测并重新部署
```
