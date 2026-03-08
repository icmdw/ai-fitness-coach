# API 设计文档

**项目**: AI 健身力量训练与饮食管理 Web 应用  
**作者**: Bob  
**版本**: 1.0  
**日期**: 2026-03-08

---

## 1. API 概览

### 技术选型

- **协议**: HTTP/1.1 (RESTful)
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: JWT Token
- **API 版本**: v1

### 基础信息

```
Base URL: /api/v1
Content-Type: application/json
```

### 响应格式

**成功响应 (200/201)**:
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

**错误响应 (4xx/5xx)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "详细的错误信息",
    "details": { ... }
  }
}
```

**分页响应**:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 2. 认证 API (Auth)

### 2.1 用户注册

```http
POST /api/v1/auth/register
```

**请求体**:
```json
{
  "username": "string (required, 3-20 chars)",
  "email": "string (optional, email format)",
  "password": "string (required, min 8 chars)"
}
```

**响应 (201)**:
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "username": "fitness_user",
    "createdAt": "2026-03-08T10:00:00Z"
  },
  "message": "注册成功"
}
```

---

### 2.2 用户登录

```http
POST /api/v1/auth/login
```

**请求体**:
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "username": "fitness_user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  },
  "message": "登录成功"
}
```

---

### 2.3 刷新 Token

```http
POST /api/v1/auth/refresh
```

**请求头**:
```
Authorization: Bearer <token>
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

---

### 2.4 获取当前用户信息

```http
GET /api/v1/auth/me
```

**请求头**:
```
Authorization: Bearer <token>
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "fitness_user",
    "email": "user@example.com",
    "createdAt": "2026-03-08T10:00:00Z",
    "updatedAt": "2026-03-08T10:00:00Z"
  }
}
```

---

## 3. 动作 API (Exercises)

### 3.1 获取动作列表

```http
GET /api/v1/exercises
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| category | string | 筛选分类：chest/back/legs/shoulders/arms/core |
| equipment | string | 筛选器械类型 |
| search | string | 搜索动作名称 |
| page | integer | 页码（默认 1） |
| pageSize | integer | 每页数量（默认 20，最大 100） |

**响应 (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "卧推",
      "nameEn": "Bench Press",
      "category": "chest",
      "equipment": "barbell",
      "description": "经典胸部复合动作",
      "instructions": ["仰卧在卧推凳上", "双脚踩实地面", "握距略宽于肩"]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### 3.2 获取动作详情

```http
GET /api/v1/exercises/:id
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "卧推",
    "nameEn": "Bench Press",
    "category": "chest",
    "equipment": "barbell",
    "description": "经典胸部复合动作",
    "instructions": [
      "仰卧在卧推凳上，双脚踩实地面",
      "双手握住杠铃，握距略宽于肩",
      "吸气，缓慢下放杠铃至胸部",
      "呼气，推起杠铃至起始位置"
    ],
    "createdAt": "2026-03-08T10:00:00Z"
  }
}
```

---

### 3.3 创建自定义动作

```http
POST /api/v1/exercises
```

**请求头**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "name": "string (required)",
  "nameEn": "string (optional)",
  "category": "string (required)",
  "equipment": "string (optional)",
  "description": "string (optional)",
  "instructions": ["string array] (optional)"
}
```

**响应 (201)**:
```json
{
  "success": true,
  "data": {
    "id": 101,
    "name": "自定义动作",
    "category": "chest",
    "createdAt": "2026-03-08T10:00:00Z"
  },
  "message": "动作创建成功"
}
```

---

## 4. 训练记录 API (Training Logs)

### 4.1 获取训练记录列表

```http
GET /api/v1/training-logs
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| startDate | date | 开始日期（YYYY-MM-DD） |
| endDate | date | 结束日期（YYYY-MM-DD） |
| exerciseId | integer | 筛选特定动作 |
| page | integer | 页码 |
| pageSize | integer | 每页数量 |

**响应 (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2026-03-08",
      "startTime": "2026-03-08T18:00:00Z",
      "endTime": "2026-03-08T19:30:00Z",
      "durationMinutes": 90,
      "notes": "今天状态不错",
      "rating": 4,
      "exercises": [
        {
          "exerciseId": 1,
          "exerciseName": "卧推",
          "sets": [
            {"setNumber": 1, "weightKg": 60, "reps": 10, "rpe": 7},
            {"setNumber": 2, "weightKg": 70, "reps": 8, "rpe": 8},
            {"setNumber": 3, "weightKg": 75, "reps": 6, "rpe": 9}
          ]
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### 4.2 获取训练记录详情

```http
GET /api/v1/training-logs/:id
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "date": "2026-03-08",
    "startTime": "2026-03-08T18:00:00Z",
    "endTime": "2026-03-08T19:30:00Z",
    "durationMinutes": 90,
    "notes": "今天状态不错",
    "rating": 4,
    "sets": [
      {
        "id": 1,
        "exerciseId": 1,
        "exerciseName": "卧推",
        "setNumber": 1,
        "weightKg": 60,
        "reps": 10,
        "rpe": 7,
        "restSeconds": 120,
        "completed": true,
        "notes": ""
      },
      {
        "id": 2,
        "exerciseId": 1,
        "exerciseName": "卧推",
        "setNumber": 2,
        "weightKg": 70,
        "reps": 8,
        "rpe": 8,
        "restSeconds": 120,
        "completed": true,
        "notes": ""
      }
    ],
    "createdAt": "2026-03-08T18:00:00Z",
    "updatedAt": "2026-03-08T19:30:00Z"
  }
}
```

---

### 4.3 创建训练记录

```http
POST /api/v1/training-logs
```

**请求头**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "date": "2026-03-08 (required)",
  "startTime": "2026-03-08T18:00:00Z (optional)",
  "endTime": "2026-03-08T19:30:00Z (optional)",
  "durationMinutes": 90 (optional),
  "notes": "string (optional)",
  "rating": 4 (optional, 1-5),
  "sets": [
    {
      "exerciseId": 1 (required),
      "setNumber": 1 (required),
      "weightKg": 60 (required),
      "reps": 10 (required),
      "rpe": 7 (optional, 1-10),
      "restSeconds": 120 (optional),
      "completed": true (optional),
      "notes": "string (optional)"
    }
  ]
}
```

**响应 (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "date": "2026-03-08",
    "setsCount": 15,
    "createdAt": "2026-03-08T19:30:00Z"
  },
  "message": "训练记录创建成功"
}
```

---

### 4.4 更新训练记录

```http
PUT /api/v1/training-logs/:id
```

**请求体**: 同创建接口（部分字段可选）

**响应 (200)**:
```json
{
  "success": true,
  "message": "训练记录更新成功"
}
```

---

### 4.5 删除训练记录

```http
DELETE /api/v1/training-logs/:id
```

**响应 (200)**:
```json
{
  "success": true,
  "message": "训练记录已删除"
}
```

---

## 5. 身体数据 API (Body Metrics)

### 5.1 获取身体数据列表

```http
GET /api/v1/body-metrics
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| startDate | date | 开始日期 |
| endDate | date | 结束日期 |
| page | integer | 页码 |
| pageSize | integer | 每页数量 |

**响应 (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2026-03-08",
      "weightKg": 75.5,
      "bodyFatPercent": 15.2,
      "muscleMassKg": 58.3,
      "chestCm": 100,
      "waistCm": 80,
      "hipCm": 95,
      "armCm": 35,
      "thighCm": 55,
      "notes": "早晨空腹测量",
      "createdAt": "2026-03-08T07:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 30,
    "totalPages": 2
  }
}
```

---

### 5.2 创建身体数据记录

```http
POST /api/v1/body-metrics
```

**请求头**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "date": "2026-03-08 (required)",
  "weightKg": 75.5 (optional),
  "bodyFatPercent": 15.2 (optional),
  "muscleMassKg": 58.3 (optional),
  "chestCm": 100 (optional),
  "waistCm": 80 (optional),
  "hipCm": 95 (optional),
  "armCm": 35 (optional),
  "thighCm": 55 (optional),
  "notes": "string (optional)"
}
```

**响应 (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "date": "2026-03-08",
    "weightKg": 75.5,
    "createdAt": "2026-03-08T07:00:00Z"
  },
  "message": "身体数据记录成功"
}
```

---

### 5.3 更新身体数据记录

```http
PUT /api/v1/body-metrics/:id
```

**请求体**: 同创建接口（部分字段可选）

**响应 (200)**:
```json
{
  "success": true,
  "message": "身体数据更新成功"
}
```

---

### 5.4 删除身体数据记录

```http
DELETE /api/v1/body-metrics/:id
```

**响应 (200)**:
```json
{
  "success": true,
  "message": "身体数据记录已删除"
}
```

---

## 6. 饮食记录 API (Food Logs)

### 6.1 获取饮食记录列表

```http
GET /api/v1/food-logs
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| date | date | 指定日期 |
| startDate | date | 开始日期 |
| endDate | date | 结束日期 |
| mealType | string | 餐次：breakfast/lunch/dinner/snack |
| page | integer | 页码 |
| pageSize | integer | 每页数量 |

**响应 (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2026-03-08",
      "mealType": "breakfast",
      "foodName": "燕麦粥",
      "calories": 350,
      "proteinG": 12,
      "carbsG": 60,
      "fatG": 6,
      "quantity": 100,
      "unit": "g",
      "notes": "",
      "createdAt": "2026-03-08T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### 6.2 创建饮食记录

```http
POST /api/v1/food-logs
```

**请求头**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "date": "2026-03-08 (required)",
  "mealType": "breakfast (required)",
  "foodName": "燕麦粥 (required)",
  "calories": 350 (optional),
  "proteinG": 12 (optional),
  "carbsG": 60 (optional),
  "fatG": 6 (optional),
  "quantity": 100 (optional),
  "unit": "g (optional)",
  "notes": "string (optional)"
}
```

**响应 (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "date": "2026-03-08",
    "mealType": "breakfast",
    "foodName": "燕麦粥",
    "createdAt": "2026-03-08T08:00:00Z"
  },
  "message": "饮食记录创建成功"
}
```

---

### 6.3 批量创建饮食记录

```http
POST /api/v1/food-logs/batch
```

**请求体**:
```json
{
  "records": [
    {
      "date": "2026-03-08",
      "mealType": "breakfast",
      "foodName": "燕麦粥",
      "calories": 350,
      "proteinG": 12,
      "carbsG": 60,
      "fatG": 6
    },
    {
      "date": "2026-03-08",
      "mealType": "lunch",
      "foodName": "鸡胸肉沙拉",
      "calories": 450,
      "proteinG": 40,
      "carbsG": 20,
      "fatG": 15
    }
  ]
}
```

**响应 (201)**:
```json
{
  "success": true,
  "data": {
    "createdCount": 2,
    "records": [
      {"id": 1, "date": "2026-03-08", "mealType": "breakfast"},
      {"id": 2, "date": "2026-03-08", "mealType": "lunch"}
    ]
  },
  "message": "批量创建成功"
}
```

---

### 6.4 获取每日营养汇总

```http
GET /api/v1/food-logs/daily-summary/:date
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "date": "2026-03-08",
    "totalCalories": 2200,
    "totalProtein": 150,
    "totalCarbs": 250,
    "totalFat": 70,
    "meals": {
      "breakfast": {"calories": 350, "protein": 12, "carbs": 60, "fat": 6},
      "lunch": {"calories": 650, "protein": 50, "carbs": 70, "fat": 20},
      "dinner": {"calories": 800, "protein": 60, "carbs": 80, "fat": 30},
      "snack": {"calories": 400, "protein": 28, "carbs": 40, "fat": 14}
    },
    "recordsCount": 8
  }
}
```

---

## 7. 统计数据 API (Statistics)

### 7.1 获取训练统计

```http
GET /api/v1/statistics/training
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| period | string | 统计周期：week/month/year/all |
| exerciseId | integer | 筛选特定动作 |

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "period": "month",
    "startDate": "2026-02-08",
    "endDate": "2026-03-08",
    "totalWorkouts": 12,
    "totalSets": 180,
    "totalVolume": 45000,
    "averageDuration": 75,
    "exerciseStats": [
      {
        "exerciseId": 1,
        "exerciseName": "卧推",
        "sessions": 4,
        "totalSets": 16,
        "maxWeight": 80,
        "averageWeight": 70,
        "progression": "+5kg"
      }
    ],
    "weeklyTrend": [
      {"week": "2026-W06", "workouts": 3, "volume": 12000},
      {"week": "2026-W07", "workouts": 4, "volume": 15000},
      {"week": "2026-W08", "workouts": 3, "volume": 13000},
      {"week": "2026-W09", "workouts": 2, "volume": 8000}
    ]
  }
}
```

---

### 7.2 获取力量进步曲线

```http
GET /api/v1/statistics/strength/:exerciseId
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| period | string | 统计周期：month/year/all |
| metric | string | 指标：max/average/volume |

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "exerciseId": 1,
    "exerciseName": "卧推",
    "period": "year",
    "dataPoints": [
      {"date": "2025-03-08", "maxWeight": 60, "averageWeight": 55, "volume": 3000},
      {"date": "2025-06-08", "maxWeight": 65, "averageWeight": 60, "volume": 3500},
      {"date": "2025-09-08", "maxWeight": 70, "averageWeight": 65, "volume": 4000},
      {"date": "2025-12-08", "maxWeight": 75, "averageWeight": 70, "volume": 4500},
      {"date": "2026-03-08", "maxWeight": 80, "averageWeight": 72.5, "volume": 5000}
    ],
    "progression": {
      "weightGain": 20,
      "percentageGain": 33.3,
      "trend": "up"
    }
  }
}
```

---

### 7.3 获取身体数据趋势

```http
GET /api/v1/statistics/body-metrics
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| period | string | 统计周期：month/year/all |
| metrics | string | 指标：weight/bodyFat/muscleMass (逗号分隔) |

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "period": "year",
    "metrics": ["weight", "bodyFat"],
    "dataPoints": [
      {"date": "2025-03-08", "weight": 70, "bodyFat": 18},
      {"date": "2025-06-08", "weight": 72, "bodyFat": 16},
      {"date": "2025-09-08", "weight": 74, "bodyFat": 15},
      {"date": "2025-12-08", "weight": 75, "bodyFat": 15},
      {"date": "2026-03-08", "weight": 75.5, "bodyFat": 15.2}
    ],
    "summary": {
      "weightChange": 5.5,
      "bodyFatChange": -2.8,
      "trend": "improving"
    }
  }
}
```

---

### 7.4 获取营养统计

```http
GET /api/v1/statistics/nutrition
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| period | string | 统计周期：week/month |

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "period": "week",
    "dailyAverage": {
      "calories": 2200,
      "protein": 150,
      "carbs": 250,
      "fat": 70
    },
    "weeklyTotal": {
      "calories": 15400,
      "protein": 1050,
      "carbs": 1750,
      "fat": 490
    },
    "dailyBreakdown": [
      {"date": "2026-03-02", "calories": 2100, "protein": 140},
      {"date": "2026-03-03", "calories": 2300, "protein": 160},
      {"date": "2026-03-04", "calories": 2200, "protein": 150},
      {"date": "2026-03-05", "calories": 2150, "protein": 145},
      {"date": "2026-03-06", "calories": 2250, "protein": 155},
      {"date": "2026-03-07", "calories": 2200, "protein": 150},
      {"date": "2026-03-08", "calories": 2200, "protein": 150}
    ]
  }
}
```

---

## 8. AI 辅助 API (AI Assistant)

### 8.1 获取训练状态分析

```http
GET /api/v1/ai/analysis/training-status
```

**请求头**:
```
Authorization: Bearer <token>
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "analysisDate": "2026-03-08",
    "overallStatus": "good",
    "trainingFrequency": {
      "sessionsPerWeek": 4,
      "consistency": 85,
      "trend": "stable"
    },
    "strengthProgress": {
      "trend": "improving",
      "averageGain": "2.5kg/month",
      "plateau": false
    },
    "recoveryStatus": {
      "score": 75,
      "recommendation": "保持当前训练频率，注意睡眠"
    },
    "suggestions": [
      {
        "type": "training_plan",
        "priority": "medium",
        "content": "建议增加腿部训练频率至每周 2 次"
      },
      {
        "type": "recovery",
        "priority": "low",
        "content": "训练后增加 10 分钟拉伸"
      }
    ]
  }
}
```

---

### 8.2 获取个性化训练建议

```http
POST /api/v1/ai/suggestions/generate
```

**请求头**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "type": "training_plan (required)",
  "context": {
    "goal": "增肌",
    "experienceLevel": "intermediate",
    "availableDays": 4,
    "focusAreas": ["chest", "back"],
    "injuries": [],
    "equipment": ["barbell", "dumbbell", "bench"]
  }
}
```

**响应 (201)**:
```json
{
  "success": true,
  "data": {
    "suggestionId": 1,
    "type": "training_plan",
    "content": "根据您的目标和经验水平，建议采用上下肢分化训练...\n\n**周一：上肢推**\n- 卧推 4x6-8\n- 哑铃肩推 3x8-10\n...\n\n**周二：下肢**\n- 深蹲 4x6-8\n...",
    "createdAt": "2026-03-08T20:00:00Z"
  },
  "message": "训练建议生成成功"
}
```

---

### 8.3 获取 AI 建议列表

```http
GET /api/v1/ai/suggestions
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| type | string | 筛选类型 |
| isRead | boolean | 筛选已读/未读 |
| page | integer | 页码 |
| pageSize | integer | 每页数量 |

**响应 (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "training_plan",
      "content": "根据您的训练历史...",
      "isRead": false,
      "createdAt": "2026-03-08T20:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### 8.4 标记建议为已读

```http
PATCH /api/v1/ai/suggestions/:id/read
```

**响应 (200)**:
```json
{
  "success": true,
  "message": "建议已标记为已读"
}
```

---

### 8.5 AI 对话（训练咨询）

```http
POST /api/v1/ai/chat
```

**请求头**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "message": "我最近卧推遇到瓶颈，怎么办？",
  "context": {
    "currentMax": 80,
    "trainingHistory": "最近 3 周重量没有提升",
    "sleepQuality": "一般",
    "nutrition": "蛋白质摄入充足"
  }
}
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "response": "卧推瓶颈期很常见，建议从以下几个方面调整：\n\n1. **减载周**：降低重量至 70-80%，让神经系统恢复\n2. **技术调整**：检查握距、起桥、腿部驱动\n3. **辅助训练**：增加三头肌和肩部训练\n4. **营养睡眠**：确保充足蛋白质和 7-8 小时睡眠\n\n您可以尝试以下方案...",
    "timestamp": "2026-03-08T20:30:00Z"
  }
}
```

---

## 9. 错误码定义

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（Token 无效或过期） |
| 403 | 禁止访问（权限不足） |
| 404 | 资源不存在 |
| 409 | 冲突（如用户名已存在） |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |

### 业务错误码

| 错误码 | 说明 |
|--------|------|
| VALIDATION_ERROR | 数据验证失败 |
| TOKEN_EXPIRED | Token 已过期 |
| TOKEN_INVALID | Token 无效 |
| RESOURCE_NOT_FOUND | 资源不存在 |
| DUPLICATE_RESOURCE | 资源重复 |
| PERMISSION_DENIED | 权限不足 |
| RATE_LIMIT_EXCEEDED | 请求频率超限 |
| INTERNAL_ERROR | 内部错误 |

---

## 10. 速率限制

| 端点类型 | 限制 |
|----------|------|
| 认证接口 | 10 次/分钟 |
| 普通 API | 100 次/分钟 |
| AI 接口 | 20 次/分钟 |

**响应头**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1709928000
```

---

## 11. 数据验证规则

### 通用规则

| 字段 | 规则 |
|------|------|
| username | 3-20 字符，字母数字下划线 |
| email | 标准邮箱格式 |
| password | 最少 8 字符，包含大小写字母和数字 |
| date | YYYY-MM-DD 格式 |
| datetime | ISO 8601 格式 |

### 数值范围

| 字段 | 范围 |
|------|------|
| rating | 1-5 |
| rpe | 1-10 |
| weightKg | > 0 |
| reps | 1-100 |
| calories | >= 0 |
| bodyFatPercent | 0-100 |

---

## 12. 版本管理

- API 版本通过 URL 路径标识：`/api/v1/...`
- 重大变更时递增主版本号
- 向后兼容的变更不改变版本号
- 废弃的端点提前 3 个月通知

---

## 13. 安全考虑

### 认证
- 使用 JWT Token，有效期 24 小时
- 支持 Token 刷新机制
- 密码使用 bcrypt 哈希（cost=12）

### 授权
- 用户只能访问自己的数据
- 所有写操作需要认证
- 敏感操作记录审计日志

### 输入验证
- 所有输入参数严格验证
- 防止 SQL 注入（使用参数化查询）
- 防止 XSS（输出编码）

### 日志
- 记录所有认证尝试
- 记录错误和异常
- 不记录敏感信息（密码、Token）
