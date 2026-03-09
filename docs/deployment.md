# AI Fitness Coach - 部署指南

**版本**: 1.0  
**最后更新**: 2026-03-09 16:50 (北京时间)

---

## 📋 目录

1. [系统要求](#系统要求)
2. [快速部署](#快速部署)
3. [配置说明](#配置说明)
4. [服务管理](#服务管理)
5. [数据备份](#数据备份)
6. [故障排查](#故障排查)
7. [生产环境部署](#生产环境部署)

---

## 系统要求

### 最低配置
- **CPU**: 2 核心
- **内存**: 2 GB
- **磁盘**: 10 GB
- **操作系统**: Linux / macOS / Windows (WSL2)

### 推荐配置
- **CPU**: 4 核心
- **内存**: 4 GB
- **磁盘**: 20 GB SSD
- **操作系统**: Ubuntu 20.04+ / CentOS 8+

### 必需软件
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: 2.30+

---

## 快速部署

### 1. 克隆仓库

```bash
git clone https://github.com/icmdw/ai-fitness-coach.git
cd ai-fitness-coach
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置文件
vim .env
# 或
nano .env
```

**⚠️ 重要**: 务必修改以下配置：
- `JWT_SECRET` — 生成强随机字符串
- `HIGRESS_API_KEY` — 填写你的 API 密钥

生成 JWT_SECRET 示例：
```bash
# Linux/macOS
openssl rand -hex 32

# 或使用 node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看启动日志
docker-compose logs -f
```

### 4. 验证部署

```bash
# 检查服务状态
docker-compose ps

# 检查后端健康状态
curl http://localhost:3000/health

# 检查前端访问
curl http://localhost
```

**预期输出**:
```
NAME                STATUS              PORTS
fitness-backend     Up (healthy)        0.0.0.0:3000->3000/tcp
fitness-frontend    Up                  0.0.0.0:80->80/tcp
fitness-backup      Up
```

---

## 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `NODE_ENV` | 运行环境 | `production` | ✅ |
| `PORT` | 后端端口 | `3000` | ✅ |
| `DATABASE_URL` | 数据库连接 | `file:/app/data/fitness.db` | ✅ |
| `JWT_SECRET` | JWT 密钥 | (无) | ✅ |
| `JWT_EXPIRES_IN` | Token 有效期 | `7d` | ✅ |
| `HIGRESS_GATEWAY_URL` | AI 网关地址 | (无) | ✅ |
| `HIGRESS_API_KEY` | AI 网关密钥 | (无) | ✅ |

### 目录结构

```
ai-fitness-coach/
├── docker-compose.yml      # Docker 编排配置
├── .env                    # 环境变量（自己创建）
├── .env.example            # 环境变量模板
├── data/                   # 数据库文件（自动创建）
│   └── fitness.db
├── logs/                   # 日志文件（自动创建）
│   └── app.log
├── backups/                # 备份文件（自动创建）
├── backend/                # 后端代码
│   ├── Dockerfile
│   └── ...
└── frontend/               # 前端代码
    ├── Dockerfile
    ├── nginx.conf
    └── ...
```

---

## 服务管理

### 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 仅启动后端
docker-compose up -d backend

# 仅启动前端
docker-compose up -d frontend
```

### 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷（⚠️ 会删除数据库）
docker-compose down -v
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启单个服务
docker-compose restart backend
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看后端日志
docker-compose logs -f backend

# 查看最近 100 行
docker-compose logs --tail=100 backend
```

### 进入容器

```bash
# 进入后端容器
docker-compose exec backend sh

# 进入前端容器
docker-compose exec frontend sh
```

---

## 数据备份

### 自动备份

备份服务每天自动运行，保留最近 7 天的数据库备份。

备份位置：`./backups/fitness-db-YYYYMMDD-HHMMSS.db`

### 手动备份

```bash
# 创建备份
docker-compose exec backend cp /app/data/fitness.db /app/backups/fitness-db-backup.db

# 下载备份
docker-compose cp backend:/app/data/fitness.db ./backup-$(date +%Y%m%d).db
```

### 恢复数据

```bash
# 停止服务
docker-compose down

# 恢复数据库
cp ./backups/fitness-db-20260309-120000.db ./data/fitness.db

# 重启服务
docker-compose up -d
```

---

## 故障排查

### 后端无法启动

```bash
# 查看日志
docker-compose logs backend

# 检查端口占用
netstat -tlnp | grep 3000

# 检查环境变量
docker-compose exec backend env | grep -E "JWT|DATABASE"
```

### 前端无法访问

```bash
# 检查 Nginx 配置
docker-compose exec frontend nginx -t

# 查看前端日志
docker-compose logs frontend
```

### 数据库错误

```bash
# 检查数据库文件
ls -lh ./data/

# 检查权限
chmod 644 ./data/fitness.db

# 重建数据库（⚠️ 会删除所有数据）
rm ./data/fitness.db
docker-compose restart backend
```

### API 返回 500 错误

```bash
# 查看详细错误日志
docker-compose logs backend | grep ERROR

# 检查 AI 网关配置
docker-compose exec backend env | grep HIGRESS
```

---

## 生产环境部署

### 使用 PostgreSQL

1. 修改 `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: fitness
      POSTGRES_PASSWORD: your-password
      POSTGRES_DB: fitness_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

2. 修改 `.env`:

```bash
DATABASE_URL=postgresql://fitness:your-password@postgres:5432/fitness_db
```

### 使用 HTTPS

1. 使用 Nginx Proxy Manager 或 Traefik
2. 配置 SSL 证书
3. 强制 HTTPS 重定向

### 性能优化

1. **启用 Redis 缓存**
2. **配置 CDN** 加速静态资源
3. **数据库索引优化**
4. **启用 Gzip 压缩** (已配置)

### 监控告警

1. **Prometheus + Grafana** 监控
2. **ELK Stack** 日志分析
3. **Uptime Robot** 可用性监控

---

## 技术栈

| 组件 | 技术 | 版本 |
|------|------|------|
| 后端 | Node.js + Fastify | 20.x / 4.x |
| 前端 | React + Vite | 18.x / 5.x |
| 数据库 | SQLite / PostgreSQL | 3.x / 15.x |
| Web 服务器 | Nginx | 1.24+ |
| 容器 | Docker | 20.10+ |

---

## 支持

- **GitHub Issues**: https://github.com/icmdw/ai-fitness-coach/issues
- **文档**: https://github.com/icmdw/ai-fitness-coach/tree/main/docs

---

*最后更新：2026-03-09 16:50 (北京时间)*
