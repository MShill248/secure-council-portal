jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }), { virtual: true });
const jwt = require('jsonwebtoken');

const authenticator = require('../scp-api/middleware/authenticator');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

describe('authenticator middleware', () => {
  let next;
  beforeEach(() => { next = jest.fn(); jest.clearAllMocks(); });

  test('Bearer token header -> attempts verify and does not 403', () => {
    const req = { headers: { authorization: 'Bearer good.jwt' } };
    const res = mockRes();

    
    jwt.verify.mockReturnValue({ user_id: 7, username: 'mo' });

    authenticator(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();

    expect(res.status).not.toHaveBeenCalledWith(403);
  });

  test('missing header -> 403', () => {
    const req = { headers: {} };
    const res = mockRes();

    authenticator(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalled();
  });

  test('non-Bearer scheme -> verify called, no 403', () => {
    const req = { headers: { authorization: 'Token blah' } };
    const res = mockRes();

    authenticator(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    
    expect(res.status).not.toHaveBeenCalledWith(403);
  });
});

