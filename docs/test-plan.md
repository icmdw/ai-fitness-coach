# 测试计划与质量保障策略

**项目**: AI 健身力量训练与饮食管理 Web 应用  
**文档版本**: 1.0  
**创建日期**: 2026-03-08  
**负责人**: Luna (测试工程师)

---

## 1. 测试策略概述

### 1.1 测试目标
- 确保所有功能模块按需求规格正常工作
- 验证数据库设计与 API 接口的正确性
- 保证前端 UI/UX 与设计文档一致
- 确保数据可视化准确展示训练和身体数据
- 验证 AI 助手功能的准确性和可靠性

### 1.2 测试范围
| 模块 | 测试类型 | 优先级 |
|------|----------|--------|
| 用户认证 (Auth) | 单元 + 集成 + E2E | P0 |
| 训练记录 (Training Logs) | 单元 + 集成 + E2E | P0 |
| 身体数据 (Body Metrics) | 单元 + 集成 + E2E | P0 |
| 饮食记录 (Food Logs) | 单元 + 集成 | P1 |
| 数据可视化 (Statistics) | 集成 + E2E | P1 |
| AI 助手 (AI Assistant) | 集成 + E2E | P1 |
| 动作库 (Exercises) | 单元 + 集成 | P2 |
| AI 建议 (AI Suggestions) | 集成 | P2 |

### 1.3 测试工具栈
| 用途 | 工具 | 说明 |
|------|------|------|
| 单元测试 (后端) | Jest | Node.js 测试框架 |
| 单元测试 (前端) | React Testing Library | React 组件测试 |
| 集成测试 | Supertest | API 接口测试 |
| E2E 测试 | Playwright | 端到端浏览器测试 |
| 覆盖率 | Istanbul/nyc | 代码覆盖率统计 |
| CI/CD | GitHub Actions | 自动化测试流水线 |

---

## 2. 单元测试策略

### 2.1 后端单元测试

#### 2.1.1 数据模型测试
```javascript
// 测试文件：backend/tests/models/*.test.js
describe('TrainingLog Model', () => {
  test('创建训练记录 - 有效数据', () => {...});
  test('创建训练记录 - 缺失必填字段', () => {...});
  test('更新训练记录 - 权限验证', () => {...});
  test('删除训练记录 - 级联删除训练组', () => {...});
});
```

#### 2.1.2 服务层测试
```javascript
// 测试文件：backend/tests/services/*.test.js
describe('StatisticsService', () => {
  test('计算力量进步曲线 - 正常数据', () => {...});
  test('计算训练热力图 - 跨月数据', () => {...});
  test('计算身体数据雷达图 - 多维度', () => {...});
});
```

#### 2.1.3 控制器测试
```javascript
// 测试文件：backend/tests/controllers/*.test.js
describe('TrainingLogController', () => {
  test('GET /api/training-logs - 认证成功', () => {...});
  test('GET /api/training-logs - 认证失败', () => {...});
  test('POST /api/training-logs - 创建记录', () => {...});
});
```

### 2.2 前端单元测试

#### 2.2.1 组件测试
```javascript
// 测试文件：frontend/src/components/__tests__/*.test.tsx
describe('TrainingLogForm', () => {
  test('渲染表单字段', () => {...});
  test('提交有效数据', () => {...});
  test('验证必填字段', () => {...});
  test('显示错误消息', () => {...});
});
```

#### 2.2.2 Hooks 测试
```javascript
// 测试文件：frontend/src/hooks/__tests__/*.test.ts
describe('useTrainingLogs', () => {
  test('加载训练记录', () => {...});
  test('添加训练记录', () => {...});
  test('删除训练记录', () => {...});
  test('处理加载错误', () => {...});
});
```

---

## 3. 集成测试方案

### 3.1 数据库集成测试
```javascript
// 测试文件：backend/tests/integration/database.test.js
describe('Database Integration', () => {
  test('用户 - 训练记录关联查询', () => {...});
  test('训练记录 - 训练组级联操作', () => {...});
  test('身体数据时间序列查询', () => {...});
  test('饮食记录聚合统计', () => {...});
});
```

### 3.2 API 模块集成测试

#### 3.2.1 认证模块
| 端点 | 方法 | 测试场景 |
|------|------|----------|
| `/api/auth/register` | POST | 正常注册、邮箱已存在、弱密码 |
| `/api/auth/login` | POST | 正确凭证、错误密码、用户不存在 |
| `/api/auth/refresh` | POST | 有效 token、过期 token |

#### 3.2.2 训练记录模块
| 端点 | 方法 | 测试场景 |
|------|------|----------|
| `/api/training-logs` | GET | 分页查询、日期过滤、动作过滤 |
| `/api/training-logs` | POST | 创建记录、验证必填字段 |
| `/api/training-logs/:id` | PUT | 更新记录、权限验证 |
| `/api/training-logs/:id` | DELETE | 删除记录、级联删除 |

#### 3.2.3 身体数据模块
| 端点 | 方法 | 测试场景 |
|------|------|----------|
| `/api/body-metrics` | GET | 获取历史数据、趋势分析 |
| `/api/body-metrics` | POST | 记录新数据、数值范围验证 |
| `/api/body-metrics/trends` | GET | 计算趋势、时间段分析 |

### 3.3 前端 - 后端集成测试
```javascript
// 测试文件：frontend/src/tests/integration/*.test.tsx
describe('TrainingLogPage Integration', () => {
  test('加载训练记录列表', async () => {...});
  test('创建新训练记录', async () => {...});
  test('编辑现有记录', async () => {...});
  test('删除记录确认', async () => {...});
});
```

---

## 4. E2E 测试计划

### 4.1 关键用户流程场景

#### 场景 1: 用户注册与登录
```javascript
// 测试文件：e2e/tests/auth-flow.spec.ts
test('完整注册登录流程', async ({ page }) => {
  // 1. 访问首页
  // 2. 点击注册
  // 3. 填写注册表单
  // 4. 验证邮箱（模拟）
  // 5. 登录
  // 6. 验证跳转到仪表盘
});
```

#### 场景 2: 记录一次训练
```javascript
// 测试文件：e2e/tests/training-log-flow.spec.ts
test('记录完整训练会话', async ({ page }) => {
  // 1. 登录
  // 2. 导航到训练记录页面
  // 3. 点击"新建训练"
  // 4. 选择日期和动作
  // 5. 添加多组训练数据
  // 6. 保存记录
  // 7. 验证记录显示在列表中
});
```

#### 场景 3: 查看数据可视化
```javascript
// 测试文件：e2e/tests/visualization-flow.spec.ts
test('查看力量进步曲线图', async ({ page }) => {
  // 1. 登录
  // 2. 导航到统计页面
  // 3. 选择"力量进步"图表
  // 4. 验证图表渲染
  // 5. 测试图表交互（缩放、悬停）
});
```

#### 场景 4: 记录身体数据
```javascript
// 测试文件：e2e/tests/body-metrics-flow.spec.ts
test('记录身体数据并查看趋势', async ({ page }) => {
  // 1. 登录
  // 2. 导航到身体数据页面
  // 3. 记录体重、体脂等数据
  // 4. 查看雷达图
  // 5. 查看趋势分析
});
```

#### 场景 5: 记录饮食
```javascript
// 测试文件：e2e/tests/food-log-flow.spec.ts
test('记录每日饮食摄入', async ({ page }) => {
  // 1. 登录
  // 2. 导航到饮食记录页面
  // 3. 添加早餐、午餐、晚餐
  // 4. 查看每日热量汇总
  // 5. 查看营养分布
});
```

#### 场景 6: 获取 AI 训练建议
```javascript
// 测试文件：e2e/tests/ai-assistant-flow.spec.ts
test('获取 AI 训练建议', async ({ page }) => {
  // 1. 登录
  // 2. 导航到 AI 助手页面
  // 3. 输入训练问题
  // 4. 等待 AI 回复
  // 5. 验证回复内容
});
```

#### 场景 7: 搜索动作库
```javascript
// 测试文件：e2e/tests/exercise-search.spec.ts
test('搜索和浏览动作库', async ({ page }) => {
  // 1. 登录
  // 2. 导航到动作库页面
  // 3. 搜索特定动作
  // 4. 筛选肌肉群
  // 5. 查看动作详情
});
```

#### 场景 8: 导出训练数据
```javascript
// 测试文件：e2e/tests/data-export.spec.ts
test('导出训练数据', async ({ page }) => {
  // 1. 登录
  // 2. 导航到设置页面
  // 3. 选择导出数据
  // 4. 选择日期范围
  // 5. 下载 CSV 文件
  // 6. 验证文件内容
});
```

---

## 5. 测试自动化流程

### 5.1 CI/CD 配置 (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd backend && npm ci
      - run: cd backend && npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info

  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd frontend && npm ci
      - run: cd frontend && npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info

  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### 5.2 覆盖率要求

| 模块 | 行覆盖率 | 分支覆盖率 | 函数覆盖率 |
|------|----------|------------|------------|
| 后端核心 | ≥90% | ≥85% | ≥90% |
| 后端工具 | ≥80% | ≥75% | ≥80% |
| 前端组件 | ≥85% | ≥80% | ≥85% |
| 前端工具 | ≥75% | ≥70% | ≥75% |
| **整体要求** | **≥85%** | **≥80%** | **≥85%** |

### 5.3 测试执行命令

```bash
# 后端测试
cd backend
npm test                    # 运行所有测试
npm test -- --coverage      # 带覆盖率
npm test -- --watch         # 监视模式

# 前端测试
cd frontend
npm test                    # 运行所有测试
npm test -- --coverage      # 带覆盖率

# E2E 测试
npm run e2e                 # 运行所有 E2E 测试
npm run e2e:headed          # 有头模式（可见浏览器）
npm run e2e:debug           # 调试模式
```

---

## 6. 质量保障标准

### 6.1 验收准则

#### 功能验收
- [ ] 所有 P0 优先级功能 100% 测试通过
- [ ] 所有 P1 优先级功能 ≥95% 测试通过
- [ ] 所有 P2 优先级功能 ≥90% 测试通过
- [ ] 无 Critical 或 High 级别缺陷

#### 性能验收
- [ ] API 响应时间 P95 < 500ms
- [ ] 页面加载时间 P95 < 3s
- [ ] 图表渲染时间 < 1s
- [ ] 并发用户支持 ≥10（个人应用标准）

#### 安全验收
- [ ] 所有 API 端点需要认证（公开端点除外）
- [ ] 密码加密存储（bcrypt）
- [ ] JWT token 正确验证和刷新
- [ ] SQL 注入防护（参数化查询）
- [ ] XSS 防护（输入验证和输出转义）
- [ ] CORS 正确配置

### 6.2 缺陷管理

#### 缺陷优先级定义
| 级别 | 描述 | 响应时间 |
|------|------|----------|
| Critical | 系统崩溃、数据丢失、安全漏洞 | 立即修复 |
| High | 核心功能不可用 | 24 小时内 |
| Medium | 功能部分可用，有替代方案 | 1 周内 |
| Low | 界面问题、文案错误 | 下次迭代 |

#### 缺陷生命周期
```
新建 → 确认 → 分配 → 修复中 → 待验证 → 已关闭
              ↓
            拒绝/延期
```

### 6.3 发布检查清单

#### 发布前检查
- [ ] 所有测试通过（单元 + 集成 + E2E）
- [ ] 代码覆盖率达标（≥85%）
- [ ] 无 Critical/High 缺陷
- [ ] 代码审查完成
- [ ] 文档更新完成
- [ ] 数据库迁移脚本测试通过
- [ ] 回滚方案准备

#### 发布后验证
- [ ] 生产环境冒烟测试通过
- [ ] 关键用户流程验证
- [ ] 监控告警正常
- [ ] 日志记录正常

---

## 7. 测试数据管理

### 7.1 测试数据生成

```javascript
// 测试数据工厂
const testDataSet = {
  users: [
    { email: 'test@example.com', password: 'Test1234!' },
    { email: 'admin@example.com', password: 'Admin1234!' }
  ],
  exercises: [
    { name: '深蹲', muscleGroup: '腿部', equipment: '杠铃' },
    { name: '卧推', muscleGroup: '胸部', equipment: '杠铃' },
    { name: '硬拉', muscleGroup: '背部', equipment: '杠铃' }
  ],
  trainingLogs: [...]
};
```

### 7.2 测试数据清理
- 每次 E2E 测试后清理测试数据
- 使用事务回滚保证测试隔离
- 定期清理测试数据库

---

## 8. 参考文档

- [数据库设计文档](./database-schema.md)
- [API 设计文档](./api-design.md)
- [UI 设计文档](./ui-design.md)
- [可视化设计文档](./visualization-design.md)
- [项目需求文档](./requirements.md)

---

## 9. 附录

### 9.1 测试用例模板

```markdown
## 测试用例 ID: TC-XXX

**标题**: [简短描述]

**前置条件**:
- ...

**测试步骤**:
1. ...
2. ...

**预期结果**:
- ...

**实际结果**:
- ...

**状态**: Pass / Fail / Blocked
```

### 9.2 测试报告模板

```markdown
# 测试报告 - [版本号]

## 测试概述
- 测试周期：YYYY-MM-DD 至 YYYY-MM-DD
- 测试人员：...

## 测试结果汇总
| 类型 | 总数 | 通过 | 失败 | 通过率 |
|------|------|------|------|--------|
| 单元 | ... | ... | ... | ...% |
| 集成 | ... | ... | ... | ...% |
| E2E | ... | ... | ... | ...% |

## 缺陷汇总
| 级别 | 数量 | 已修复 | 待修复 |
|------|------|--------|--------|
| Critical | ... | ... | ... |
| High | ... | ... | ... |
| Medium | ... | ... | ... |
| Low | ... | ... | ... |

## 发布建议
[建议发布 / 不建议发布 + 原因]
```

---

**文档结束**
