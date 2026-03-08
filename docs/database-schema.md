# 数据库设计文档

**项目**: AI 健身力量训练与饮食管理 Web 应用  
**作者**: Bob  
**版本**: 1.0  
**日期**: 2026-03-08

---

## 1. 数据库选型

### 推荐方案：SQLite

**理由**:
- 个人应用，数据量适中
- 零配置，部署简单
- 支持事务和完整 SQL 功能
- 文件型数据库，备份方便
- 性能足够支撑单用户场景

**备选方案**: PostgreSQL（如需多用户、高并发）

---

## 2. 数据模型概览

### 核心实体关系图 (ERD)

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ├──────────────┬────────────────┬────────────────┐
       │              │                │                │
       ▼              ▼                ▼                ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│TrainingLog  │ │ BodyMetrics │ │   FoodLog   │ │  Exercise   │
└──────┬──────┘ └─────────────┘ └─────────────┘ └─────────────┘
       │
       ▼
┌─────────────┐
│ TrainingSet │
└─────────────┘
```

---

## 3. 表结构设计

### 3.1 users (用户表)

存储用户基本信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 用户 ID |
| username | TEXT | UNIQUE NOT NULL | 用户名 |
| email | TEXT | UNIQUE | 邮箱（可选） |
| password_hash | TEXT | NOT NULL | 密码哈希 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
```

---

### 3.2 exercises (动作表)

健身动作库，包含标准动作信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 动作 ID |
| name | TEXT | NOT NULL | 动作名称（如"卧推"） |
| name_en | TEXT | | 英文名称（如"Bench Press"） |
| category | TEXT | NOT NULL | 分类：chest/back/legs/shoulders/arms/core |
| equipment | TEXT | | 器械类型：barbell/dumbbell/machine/bodyweight |
| description | TEXT | | 动作描述 |
| instructions | TEXT | | 动作要领（JSON 数组） |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

```sql
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_en TEXT,
    category TEXT NOT NULL,
    equipment TEXT,
    description TEXT,
    instructions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_name ON exercises(name);

-- 预置数据示例
INSERT INTO exercises (name, name_en, category, equipment, description) VALUES
('卧推', 'Bench Press', 'chest', 'barbell', '经典胸部复合动作'),
('深蹲', 'Squat', 'legs', 'barbell', '腿部王牌动作'),
('硬拉', 'Deadlift', 'back', 'barbell', '全身力量动作'),
('引体向上', 'Pull-up', 'back', 'bodyweight', '背部自重动作'),
('哑铃肩推', 'Dumbbell Shoulder Press', 'shoulders', 'dumbbell', '肩部复合动作');
```

---

### 3.3 training_logs (训练记录表)

记录每次训练会话。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 记录 ID |
| user_id | INTEGER | FOREIGN KEY → users.id | 用户 ID |
| date | DATE | NOT NULL | 训练日期 |
| start_time | DATETIME | | 开始时间 |
| end_time | DATETIME | | 结束时间 |
| duration_minutes | INTEGER | | 训练时长（分钟） |
| notes | TEXT | | 训练备注 |
| rating | INTEGER | CHECK(1-5) | 训练质量评分 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

```sql
CREATE TABLE training_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    duration_minutes INTEGER,
    notes TEXT,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_training_logs_user_date ON training_logs(user_id, date);
CREATE INDEX idx_training_logs_date ON training_logs(date);
```

---

### 3.4 training_sets (训练组表)

记录每个动作的具体训练组数据。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 组 ID |
| log_id | INTEGER | FOREIGN KEY → training_logs.id | 训练记录 ID |
| exercise_id | INTEGER | FOREIGN KEY → exercises.id | 动作 ID |
| set_number | INTEGER | NOT NULL | 第几组 |
| weight_kg | REAL | NOT NULL | 重量 (kg) |
| reps | INTEGER | NOT NULL | 次数 |
| rpe | INTEGER | CHECK(1-10) | 自觉用力程度（可选） |
| rest_seconds | INTEGER | | 组间休息（秒） |
| completed | BOOLEAN | DEFAULT 1 | 是否完成 |
| notes | TEXT | | 备注 |

```sql
CREATE TABLE training_sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    weight_kg REAL NOT NULL,
    reps INTEGER NOT NULL,
    rpe INTEGER CHECK(rpe >= 1 AND rpe <= 10),
    rest_seconds INTEGER,
    completed BOOLEAN DEFAULT 1,
    notes TEXT,
    FOREIGN KEY (log_id) REFERENCES training_logs(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE INDEX idx_training_sets_log ON training_sets(log_id);
CREATE INDEX idx_training_sets_exercise ON training_sets(exercise_id);
```

---

### 3.5 body_metrics (身体数据表)

记录身体测量数据。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 记录 ID |
| user_id | INTEGER | FOREIGN KEY → users.id | 用户 ID |
| date | DATE | NOT NULL | 测量日期 |
| weight_kg | REAL | | 体重 (kg) |
| body_fat_percent | REAL | | 体脂率 (%) |
| muscle_mass_kg | REAL | | 肌肉量 (kg) |
| chest_cm | REAL | | 胸围 (cm) |
| waist_cm | REAL | | 腰围 (cm) |
| hip_cm | REAL | | 臀围 (cm) |
| arm_cm | REAL | | 臂围 (cm) |
| thigh_cm | REAL | | 腿围 (cm) |
| notes | TEXT | | 备注 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

```sql
CREATE TABLE body_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    weight_kg REAL,
    body_fat_percent REAL,
    muscle_mass_kg REAL,
    chest_cm REAL,
    waist_cm REAL,
    hip_cm REAL,
    arm_cm REAL,
    thigh_cm REAL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_body_metrics_user_date ON body_metrics(user_id, date);
```

---

### 3.6 food_logs (饮食记录表)

记录每日饮食摄入。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 记录 ID |
| user_id | INTEGER | FOREIGN KEY → users.id | 用户 ID |
| date | DATE | NOT NULL | 日期 |
| meal_type | TEXT | NOT NULL | 餐次：breakfast/lunch/dinner/snack |
| food_name | TEXT | NOT NULL | 食物名称 |
| calories | INTEGER | | 热量 (kcal) |
| protein_g | REAL | | 蛋白质 (g) |
| carbs_g | REAL | | 碳水化合物 (g) |
| fat_g | REAL | | 脂肪 (g) |
| quantity | REAL | | 份量 |
| unit | TEXT | | 单位：g/ml/个/份 |
| notes | TEXT | | 备注 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

```sql
CREATE TABLE food_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL CHECK(meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_name TEXT NOT NULL,
    calories INTEGER,
    protein_g REAL,
    carbs_g REAL,
    fat_g REAL,
    quantity REAL,
    unit TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_food_logs_user_date ON food_logs(user_id, date);
CREATE INDEX idx_food_logs_date ON food_logs(date);
```

---

### 3.7 ai_suggestions (AI 建议表)

存储 AI 生成的训练建议和分析。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 建议 ID |
| user_id | INTEGER | FOREIGN KEY → users.id | 用户 ID |
| log_id | INTEGER | FOREIGN KEY → training_logs.id | 关联训练记录（可选） |
| suggestion_type | TEXT | NOT NULL | 类型：training_plan/form_correction/recovery/motivation |
| content | TEXT | NOT NULL | 建议内容 |
| context | TEXT | | 上下文信息（JSON） |
| is_read | BOOLEAN | DEFAULT 0 | 是否已读 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

```sql
CREATE TABLE ai_suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    log_id INTEGER,
    suggestion_type TEXT NOT NULL,
    content TEXT NOT NULL,
    context TEXT,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (log_id) REFERENCES training_logs(id)
);

CREATE INDEX idx_ai_suggestions_user ON ai_suggestions(user_id);
```

---

## 4. 数据库初始化脚本

```sql
-- 启用外键约束
PRAGMA foreign_keys = ON;

-- 创建所有表（按依赖顺序）
-- 1. users
-- 2. exercises
-- 3. training_logs
-- 4. training_sets
-- 5. body_metrics
-- 6. food_logs
-- 7. ai_suggestions

-- 插入预置动作数据
INSERT INTO exercises (name, name_en, category, equipment, description) VALUES
('卧推', 'Bench Press', 'chest', 'barbell', '经典胸部复合动作'),
('上斜卧推', 'Incline Bench Press', 'chest', 'barbell', '针对上胸部'),
('哑铃卧推', 'Dumbbell Bench Press', 'chest', 'dumbbell', '哑铃胸部动作'),
('双杠臂屈伸', 'Dips', 'chest', 'bodyweight', '胸部和肱三头肌'),
('深蹲', 'Squat', 'legs', 'barbell', '腿部王牌动作'),
('腿举', 'Leg Press', 'legs', 'machine', '腿部器械动作'),
('腿屈伸', 'Leg Extension', 'legs', 'machine', '股四头肌孤立动作'),
('腿弯举', 'Leg Curl', 'legs', 'machine', '腘绳肌孤立动作'),
('硬拉', 'Deadlift', 'back', 'barbell', '全身力量动作'),
('引体向上', 'Pull-up', 'back', 'bodyweight', '背部自重动作'),
('高位下拉', 'Lat Pulldown', 'back', 'machine', '背阔肌器械动作'),
('划船', 'Barbell Row', 'back', 'barbell', '背部厚度动作'),
('哑铃肩推', 'Dumbbell Shoulder Press', 'shoulders', 'dumbbell', '肩部复合动作'),
('侧平举', 'Lateral Raise', 'shoulders', 'dumbbell', '三角肌中束'),
('杠铃弯举', 'Barbell Curl', 'arms', 'barbell', '肱二头肌动作'),
('肱三头肌下压', 'Tricep Pushdown', 'arms', 'machine', '肱三头肌动作'),
('平板支撑', 'Plank', 'core', 'bodyweight', '核心稳定性'),
('卷腹', 'Crunch', 'core', 'bodyweight', '腹肌动作');
```

---

## 5. 数据字典

### 训练分类 (category)
- `chest` - 胸部
- `back` - 背部
- `legs` - 腿部
- `shoulders` - 肩部
- `arms` - 手臂
- `core` - 核心

### 器械类型 (equipment)
- `barbell` - 杠铃
- `dumbbell` - 哑铃
- `machine` - 器械
- `bodyweight` - 自重
- `cable` - 绳索
- `kettlebell` - 壶铃

### 餐次类型 (meal_type)
- `breakfast` - 早餐
- `lunch` - 午餐
- `dinner` - 晚餐
- `snack` - 加餐

### AI 建议类型 (suggestion_type)
- `training_plan` - 训练计划
- `form_correction` - 动作纠正
- `recovery` - 恢复建议
- `motivation` - 激励建议
- `nutrition` - 饮食建议

---

## 6. 索引优化策略

### 查询模式分析

| 查询类型 | 常用字段 | 推荐索引 |
|----------|----------|----------|
| 用户训练历史 | user_id, date | (user_id, date) |
| 动作统计 | exercise_id | exercise_id |
| 身体数据趋势 | user_id, date | (user_id, date) |
| 饮食记录查询 | user_id, date, meal_type | (user_id, date) |
| AI 建议列表 | user_id, is_read | (user_id, is_read) |

### 性能考虑

- 单用户场景，数据量 < 10 万行，索引足够
- 定期 VACUUM 优化数据库文件
- 使用 WAL 模式提升并发性能

```sql
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 10000;
```

---

## 7. 数据迁移与备份

### 备份策略

```bash
# 备份数据库
cp fitness.db fitness_backup_$(date +%Y%m%d).db

# 导出为 SQL
sqlite3 fitness.db .dump > backup_$(date +%Y%m%d).sql
```

### 迁移脚本

使用 Prisma Migrate 或 Alembic 管理数据库版本迁移。

---

## 8. 安全考虑

- 密码使用 bcrypt 或 argon2 哈希
- 敏感数据（如邮箱）可选择加密存储
- 启用数据库文件权限控制
- 定期备份到安全位置

---

## 9. 后续扩展

- 多用户支持（添加 team_id、权限系统）
- 动作视频链接（添加 video_url 字段）
- 训练模板（添加 templates 表）
- 社交功能（添加 friends、share_logs 表）
