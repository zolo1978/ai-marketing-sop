# AI营销SOP系统 - 用户登录功能实现计划

## 任务描述
实现 AI 营销 SOP 系统用户登录功能，支持邮箱和密码登录，需要表单验证和错误提示。

## 技术方案
**方案A：单仓库分层架构**
- 前端: React + TypeScript + Vite + TailwindCSS
- 后端: Node.js + Express + TypeScript
- 数据库: MongoDB
- 认证: JWT Token
- 功能: 登录 + 记住我 + 表单验证

## 执行计划

### 阶段 1：项目初始化（7步）
1. 创建项目目录结构
2. 初始化前端项目 (Vite + React + TypeScript)
3. 配置TailwindCSS
4. 初始化后端项目 (Express + TypeScript)
5. 配置TypeScript
6. 创建环境变量文件
7. 创建Git忽略文件

### 阶段 2：后端实现（13步）
1. 数据库连接配置
2. 用户模型定义
3. JWT工具函数
4. 密码工具函数
5. 认证中间件
6. 错误处理中间件
7. 验证Schema定义
8. 认证服务层
9. 登录控制器
10. 认证路由
11. 服务器主文件
12. 启动脚本配置
13. 创建种子数据（可选）

### 阶段 3：前端实现（10步）
1. 类型定义
2. 表单验证Schema
3. Axios实例配置
4. 认证API服务
5. 认证Store (Zustand)
6. 通用Input组件
7. 登录表单组件
8. 登录页面
9. App路由配置
10. 环境变量配置

### 阶段 4：集成测试（2步）
1. 手动测试流程
2. 错误处理测试

## 设计原则
- SOLID: 单一职责、开闭原则、依赖倒置
- KISS: 保持简单，避免过度抽象
- DRY: 避免代码重复，统一封装
- YAGNI: 只实现需要的功能

## 项目结构
```
/Users/weifengchen/CLAUDE/
├── frontend/                 # React前端
│   ├── src/
│   │   ├── components/       # UI组件
│   │   ├── pages/           # 页面
│   │   ├── services/        # API服务
│   │   ├── hooks/           # 自定义Hooks
│   │   ├── utils/           # 工具函数
│   │   └── types/           # 类型定义
│   └── package.json
├── backend/                  # Express后端
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── middleware/      # 中间件
│   │   ├── models/          # Mongoose模型
│   │   ├── routes/          # 路由
│   │   ├── services/        # 业务逻辑
│   │   ├── utils/           # 工具函数
│   │   └── config/          # 配置
│   └── package.json
└── .env                     # 环境变量
```

## 执行时间
开始时间: 2025-10-26
预计完成: 2-3小时

## 关键决策
1. 使用JWT而非Session，支持无状态认证
2. 前后端都进行验证，确保安全性
3. 使用Zustand而非Redux，保持简洁
4. TailwindCSS手写样式，避免UI库冗余
