/**
 * E2E 测试 - 训练记录流程
 * 测试创建、查看、编辑、删除训练记录完整流程
 */

describe('训练记录流程 E2E 测试', () => {
  let authToken: string;
  let trainingLogId: string;

  beforeAll(async () => {
    // 登录获取 token
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'Test1234!' });
    authToken = response.body.data.token;
  });

  describe('创建训练记录', () => {
    it('应该成功创建训练记录', async () => {
      const response = await request(app)
        .post('/api/v1/training-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          date: new Date().toISOString(),
          notes: 'E2E 测试训练',
          sets: [
            { exerciseId: 'xxx', order: 1, weight: 100, reps: 10 },
          ],
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      trainingLogId = response.body.data.id;
    });
  });

  describe('查看训练历史', () => {
    it('应该获取训练记录列表', async () => {
      const response = await request(app)
        .get('/api/v1/training-logs')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('应该获取训练记录详情', async () => {
      const response = await request(app)
        .get(`/api/v1/training-logs/${trainingLogId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(trainingLogId);
    });
  });

  describe('删除训练记录', () => {
    it('应该成功删除训练记录', async () => {
      const response = await request(app)
        .delete(`/api/v1/training-logs/${trainingLogId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
