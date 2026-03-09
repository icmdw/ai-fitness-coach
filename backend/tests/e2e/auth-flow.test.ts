/**
 * E2E 测试 - 认证流程
 * 测试用户注册、登录、JWT 存储完整流程
 */

describe('认证流程 E2E 测试', () => {
  const testUser = {
    email: `test_${Date.now()}@example.com`,
    password: 'Test1234!',
    username: 'testuser',
  };

  describe('用户注册流程', () => {
    it('应该成功注册新用户', async () => {
      // 测试注册 API
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
    });

    it('应该拒绝重复邮箱注册', async () => {
      // 测试重复注册
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('用户登录 + JWT 存储', () => {
    it('应该成功登录并返回 JWT token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('应该拒绝错误密码', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
