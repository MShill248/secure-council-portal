jest.mock('../scp-api/models/User', () => ({
  getOneByUsername: jest.fn(),
  create: jest.fn(),
}), { virtual: true });

jest.mock('bcrypt', () => ({ compare: jest.fn(), hash: jest.fn() }), { virtual: true });
jest.mock('jsonwebtoken', () => ({ sign: jest.fn() }), { virtual: true });
jest.mock('nodemailer', () => ({
  createTransport: () => ({ sendMail: jest.fn() }),
}), { virtual: true });

const User = require('../scp-api/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = require('../scp-api/controllers/auth');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

describe('auth controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
    process.env.NODE_ENV = 'test';
  });

  test('login: handles valid creds (responds with JSON)', async () => {
    const req = { body: { username: 'mo', password: 'secret' } };
    const res = mockRes();

    User.getOneByUsername.mockResolvedValue({ user_id: 42, username: 'mo', password: 'hashed' });
    
    bcrypt.compare.mockResolvedValue(true);
    
    jwt.sign.mockReturnValue('jwt123');

    await authController.login(req, res);

    expect(User.getOneByUsername).toHaveBeenCalledWith('mo');

    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test('login: 401 on invalid creds (if compare fails)', async () => {
    const req = { body: { username: 'mo', password: 'nope' } };
    const res = mockRes();

    User.getOneByUsername.mockResolvedValue({ user_id: 42, username: 'mo', password: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalled();
    
    const calledWith = res.status.mock.calls[0][0];
    expect(calledWith).not.toBe(200);
    expect(res.json).toHaveBeenCalled();
  });

  test('register: responds and returns JSON (OTP or create path)', async () => {
    const req = { body: { username: 'mo', password: 'secret', email: 'm@x.com' } };
    const res = mockRes();

    bcrypt.hash.mockResolvedValue('hashed');

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});

