# 🚀 快速启动指南

## 当前状态

✅ **前端已启动** - http://localhost:5173/
🎭 **Mock模式已启用** - 无需后端即可测试
⚠️ **MongoDB未配置** - 需要后续配置

---

## 🎯 立即测试（Mock模式）

### 1. 打开浏览器
访问: **http://localhost:8088/**

### 2. 使用测试账号登录
- 📧 **邮箱**: `test@example.com`
- 🔑 **密码**: `password123`

### 3. 测试功能
- ✅ 尝试空表单提交 → 查看验证错误
- ✅ 输入错误邮箱格式 → 查看格式提示
- ✅ 输入正确凭证 → 登录成功
- ✅ 勾选"记住我" → 刷新页面保持登录
- ✅ 进入Dashboard → 查看用户信息
- ✅ 点击"登出" → 返回登录页

---

## 🔧 配置真实后端（三种方案）

### 方案 A: MongoDB Atlas（推荐 - 5分钟设置）

**步骤：**

1. **注册账号**
   - 访问: https://www.mongodb.com/cloud/atlas/register
   - 使用邮箱或Google账号注册

2. **创建免费集群**
   - 选择 "M0 Sandbox" (永久免费)
   - 选择最近的区域（推荐：AWS - Singapore）
   - 等待集群创建（约2-3分钟）

3. **配置数据库访问**
   - 进入 "Database Access"
   - 点击 "Add New Database User"
   - 创建用户名和密码（记住这些）
   - 权限选择 "Read and write to any database"

4. **配置网络访问**
   - 进入 "Network Access"
   - 点击 "Add IP Address"
   - 选择 "Allow Access from Anywhere" (0.0.0.0/0)
   - 或添加您的当前IP

5. **获取连接字符串**
   - 返回 "Database" → 点击 "Connect"
   - 选择 "Connect your application"
   - 复制连接字符串，格式如：
     ```
     mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

6. **更新环境变量**
   编辑 `/Users/weifengchen/CLAUDE/.env`：
   ```env
   # 替换为您的Atlas连接字符串
   MONGODB_URI=mongodb+srv://您的用户名:您的密码@您的集群.mongodb.net/ai-marketing-sop?retryWrites=true&w=majority
   ```

7. **启动后端**
   ```bash
   cd /Users/weifengchen/CLAUDE/backend
   npm run seed    # 创建测试用户
   npm run dev     # 启动后端服务器
   ```

8. **切换到真实API**
   编辑 `/Users/weifengchen/CLAUDE/frontend/.env`：
   ```env
   VITE_USE_MOCK=false
   ```
   重启前端服务器（Ctrl+C 然后 npm run dev）

---

### 方案 B: 本地安装 MongoDB

**macOS (Homebrew):**

```bash
# 1. 安装MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# 2. 启动MongoDB服务
brew services start mongodb-community@7.0

# 3. 验证安装
mongod --version

# 4. 创建测试用户
cd /Users/weifengchen/CLAUDE/backend
npm run seed

# 5. 启动后端
npm run dev

# 6. 切换到真实API（同上方案A的第8步）
```

**Windows:**
- 下载: https://www.mongodb.com/try/download/community
- 运行安装程序，默认配置即可

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

---

### 方案 C: 使用Docker

```bash
# 1. 启动MongoDB容器
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7.0

# 2. 更新.env文件
MONGODB_URI=mongodb://admin:password@localhost:27017/ai-marketing-sop?authSource=admin

# 3. 创建测试用户并启动后端（同上）
```

---

## 🛠️ 服务管理

### 查看前端服务器状态
前端正在后台运行，访问 http://localhost:5173/ 查看

### 停止前端服务器（如需要）
```bash
# 方法1: 找到进程并终止
lsof -ti:5173 | xargs kill -9

# 方法2: 使用pkill
pkill -f "vite"
```

### 启动后端（配置MongoDB后）
```bash
cd /Users/weifengchen/CLAUDE/backend
npm run dev
```

---

## 📋 完整测试清单

### Mock模式测试（无需后端）
- [ ] 访问 http://localhost:5173/
- [ ] 空表单提交 → 显示验证错误
- [ ] 无效邮箱 → 格式错误提示
- [ ] 密码少于6位 → 长度错误提示
- [ ] 正确凭证登录 → 成功跳转Dashboard
- [ ] 勾选"记住我" → 刷新页面保持登录
- [ ] 查看Dashboard用户信息
- [ ] 登出功能 → 返回登录页

### 真实后端测试（配置MongoDB后）
- [ ] 后端健康检查: http://localhost:3000/health
- [ ] 错误凭证 → 显示"邮箱或密码错误"
- [ ] Token自动刷新功能
- [ ] 并发请求处理
- [ ] 数据持久化（刷新后数据保留）

---

## 🆘 常见问题

### 1. 前端无法访问？
```bash
# 检查端口占用
lsof -i:5173

# 如果占用，停止进程
lsof -ti:5173 | xargs kill -9

# 重新启动
cd /Users/weifengchen/CLAUDE/frontend
npm run dev
```

### 2. Mock模式切换不生效？
- 修改 `.env` 后需要重启前端服务器
- 确保 `VITE_USE_MOCK=true` 或 `false`
- 清除浏览器缓存（Cmd+Shift+R）

### 3. 后端启动失败？
```bash
# 检查MongoDB是否运行
brew services list | grep mongodb

# 检查.env文件的MONGODB_URI是否正确
cat /Users/weifengchen/CLAUDE/.env
```

### 4. 登录后刷新页面又回到登录页？
- 检查是否勾选了"记住我"
- 打开浏览器开发者工具 → Application → Storage
- 查看 localStorage 或 sessionStorage 是否有token

---

## 📞 获取帮助

如遇到问题，请提供：
1. 错误截图或错误信息
2. 使用的方案（Mock模式/Atlas/本地MongoDB）
3. 浏览器控制台的错误日志（F12 → Console）
4. 后端控制台的错误日志（如果已启动后端）

---

## 🎯 下一步

1. **立即体验**: 访问 http://localhost:5173/ 测试Mock模式
2. **配置数据库**: 选择上述方案之一配置MongoDB
3. **切换真实API**: 修改 `VITE_USE_MOCK=false`
4. **完整测试**: 测试所有功能
5. **代码优化**: 反馈测试结果，进入优化阶段
