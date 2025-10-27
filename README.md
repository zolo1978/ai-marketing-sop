# AI 营销 SOP 系统 - 用户登录功能

基于 React + Express + MongoDB 的现代登录系统，实现邮箱密码认证、表单验证、JWT Token 认证等功能。

## 📋 功能特性

- ✅ 邮箱 + 密码登录
- ✅ 前后端表单验证
- ✅ JWT Token 认证（Access + Refresh Token）
- ✅ "记住我"功能（localStorage/sessionStorage）
- ✅ 错误提示和加载状态
- ✅ 自动 Token 刷新
- ✅ 受保护路由
- ✅ 响应式设计

## 🛠️ 技术栈

**前端:**
- React 18 + TypeScript
- Vite 5
- React Hook Form + Zod
- Zustand (状态管理)
- Axios (HTTP 客户端)
- TailwindCSS (样式)
- React Router v6

**后端:**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt (密码加密)
- express-validator (验证)

## 📦 安装步骤

### 1. 安装前端依赖

```bash
cd frontend
npm install
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

## 🚀 启动项目

### 前置条件

确保 MongoDB 已安装并运行：

```bash
# 启动MongoDB (macOS)
brew services start mongodb-community

# 或者
mongod --config /usr/local/etc/mongod.conf
```

### 1. 创建测试用户

```bash
cd backend
npm run seed
```

测试账号信息：
- 📧 邮箱: `test@example.com`
- 🔑 密码: `password123`

### 2. 启动后端服务器

```bash
cd backend
npm run dev
```

后端将运行在: http://localhost:3000

### 3. 启动前端服务器

在新的终端窗口中：

```bash
cd frontend
npm run dev
```

前端将运行在: http://localhost:8088

### 4. 访问应用

打开浏览器访问: http://localhost:8088

## 🧪 测试清单

### 基础功能测试

- [ ] 空表单提交 → 显示验证错误
- [ ] 无效邮箱格式 → 显示格式错误
- [ ] 密码少于6位 → 显示长度错误
- [ ] 错误的邮箱/密码 → 显示登录失败提示
- [ ] 正确的凭证 → 登录成功，跳转Dashboard
- [ ] 勾选"记住我" → Token存到localStorage
- [ ] 不勾选"记住我" → Token存到sessionStorage
- [ ] 刷新页面 → 认证状态保持
- [ ] 退出登录 → Token清除，跳转登录页
- [ ] 直接访问 `/dashboard` 未登录 → 重定向到登录页

### 错误处理测试

- [ ] 后端服务未启动 → 显示网络错误
- [ ] MongoDB未连接 → 显示数据库错误
- [ ] Token过期 → 自动刷新或跳转登录

## 📁 项目结构

```
/Users/weifengchen/CLAUDE/
├── frontend/                  # 前端
│   ├── src/
│   │   ├── components/        # UI组件
│   │   │   ├── Input.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── pages/             # 页面
│   │   │   ├── Login.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── services/          # API服务
│   │   │   ├── apiClient.ts
│   │   │   └── authService.ts
│   │   ├── hooks/             # 自定义Hooks
│   │   │   └── useAuth.ts
│   │   ├── utils/             # 工具函数
│   │   │   └── validation.ts
│   │   ├── types/             # 类型定义
│   │   │   └── auth.types.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
├── backend/                   # 后端
│   ├── src/
│   │   ├── config/            # 配置
│   │   │   └── database.ts
│   │   ├── controllers/       # 控制器
│   │   │   └── authController.ts
│   │   ├── middleware/        # 中间件
│   │   │   ├── authMiddleware.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/            # Mongoose模型
│   │   │   └── User.ts
│   │   ├── routes/            # 路由
│   │   │   └── authRoutes.ts
│   │   ├── services/          # 业务逻辑
│   │   │   └── authService.ts
│   │   ├── utils/             # 工具函数
│   │   │   ├── jwt.ts
│   │   │   ├── validators.ts
│   │   │   └── seed.ts
│   │   └── server.ts
│   └── package.json
├── .env                       # 环境变量
├── .gitignore
└── README.md
```

## 🔧 API 端点

### 认证相关

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 用户登录 | ❌ |
| POST | `/api/auth/refresh` | 刷新Token | ❌ |
| GET | `/api/auth/me` | 获取当前用户信息 | ✅ |
| POST | `/api/auth/logout` | 用户登出 | ❌ |

### 请求示例

**登录:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**获取用户信息:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🎯 设计原则

本项目严格遵循以下开发原则：

- **SOLID**: 单一职责、开闭原则、依赖倒置
- **KISS**: 保持简单，避免过度抽象
- **DRY**: 避免代码重复，统一封装
- **YAGNI**: 只实现需要的功能

## 🔒 安全特性

- ✅ 密码 bcrypt 加密（salt rounds: 10）
- ✅ JWT Token 认证
- ✅ CORS 配置
- ✅ Helmet 安全头
- ✅ 限流保护 (15分钟/100请求)
- ✅ 输入验证（前后端双重验证）
- ✅ MongoDB 注入防护

## 📝 环境变量

`.env` 文件配置：

```env
# 数据库
MONGODB_URI=mongodb://localhost:27017/ai-marketing-sop

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# 服务器
BACKEND_PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## 🐛 常见问题

### 1. MongoDB 连接失败

```bash
# 检查MongoDB是否运行
brew services list | grep mongodb

# 启动MongoDB
brew services start mongodb-community
```

### 2. 端口占用

```bash
# 查看端口占用
lsof -i :3000
lsof -i :5173

# 杀死进程
kill -9 <PID>
```

### 3. 依赖安装失败

```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

## 📄 许可证

MIT License
