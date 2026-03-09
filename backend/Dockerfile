# 后端 Dockerfile

FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 构建 TypeScript
RUN npm run build

# 生产环境镜像
FROM node:20-alpine

WORKDIR /app

# 安装 curl 用于健康检查
RUN apk add --no-cache curl

# 复制 package 文件
COPY package*.json ./

# 仅安装生产依赖
RUN npm ci --only=production

# 复制 Prisma schema 并生成
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
RUN npx prisma generate

# 复制构建后的代码
COPY --from=builder /app/dist ./dist

# 创建数据目录
RUN mkdir -p /app/data /app/logs

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "dist/index.js"]
