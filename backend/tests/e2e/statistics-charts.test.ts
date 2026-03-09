/**
 * E2E 测试 - 数据统计图表
 * 测试统计 API 返回数据用于 ECharts 图表渲染
 */

describe('统计图表 E2E 测试', () => {
  let authToken: string;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'Test1234!' });
    authToken = response.body.data.token;
  });

  describe('训练统计数据', () => {
    it('应该返回训练统计数据', async () => {
      const response = await request(app)
        .get('/api/v1/statistics/training')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalWorkouts).toBeDefined();
      expect(response.body.data.totalSets).toBeDefined();
    });

    it('应该计算训练频率', async () => {
      const response = await request(app)
        .get('/api/v1/statistics/training')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.frequency).toBeDefined();
    });
  });

  describe('力量进步数据', () => {
    it('应该返回力量进步数据', async () => {
      const response = await request(app)
        .get('/api/v1/statistics/strength/bench-press')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.progress).toBeDefined();
    });
  });

  describe('身体数据趋势', () => {
    it('应该返回身体数据趋势', async () => {
      const response = await request(app)
        .get('/api/v1/statistics/body-metrics')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trends).toBeDefined();
    });
  });

  describe('营养统计', () => {
    it('应该返回营养统计数据', async () => {
      const response = await request(app)
        .get('/api/v1/statistics/nutrition')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.dailyAverage).toBeDefined();
    });
  });
});
