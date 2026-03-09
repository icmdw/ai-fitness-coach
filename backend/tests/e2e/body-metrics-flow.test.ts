/**
 * E2E 测试 - 身体数据流程
 * 测试记录身体数据、查看趋势完整流程
 */

describe('身体数据流程 E2E 测试', () => {
  let authToken: string;
  let bodyMetricId: string;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'Test1234!' });
    authToken = response.body.data.token;
  });

  describe('记录身体数据', () => {
    it('应该成功创建身体数据记录', async () => {
      const response = await request(app)
        .post('/api/v1/body-metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          date: new Date().toISOString(),
          weight: 75.5,
          bodyFat: 15.2,
          chest: 100,
          waist: 80,
          hips: 95,
          arm: 35,
          thigh: 55,
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      bodyMetricId = response.body.data.id;
    });

    it('应该拒绝无效的体重数据', async () => {
      const response = await request(app)
        .post('/api/v1/body-metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          date: new Date().toISOString(),
          weight: -10, // 无效值
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('查看身体数据趋势', () => {
    it('应该获取身体数据列表', async () => {
      const response = await request(app)
        .get('/api/v1/body-metrics')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('应该获取身体数据趋势', async () => {
      const response = await request(app)
        .get('/api/v1/body-metrics/trend')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trend).toBeDefined();
    });
  });

  describe('删除身体数据', () => {
    it('应该成功删除身体数据记录', async () => {
      const response = await request(app)
        .delete(`/api/v1/body-metrics/${bodyMetricId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
