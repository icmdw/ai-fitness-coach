/**
 * 测试环境设置
 * 在每个测试文件运行前执行
 */

// 设置测试超时时间
jest.setTimeout(30000);

// 测试完成后清理
afterAll(async () => {
  // 强制退出，防止端口占用
  await new Promise(resolve => setTimeout(resolve, 1000));
});
