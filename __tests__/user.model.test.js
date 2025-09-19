const User = require('../scp-api/models/User');

// mock the pg Pool and the connect.js wrapper
jest.mock('../scp-api/database/connect.js', () => {
  return {
    query: jest.fn()
  };
});
const db = require('../scp-api/database/connect.js');

describe('User model', () => {
  afterEach(() => jest.clearAllMocks());

  test('getAll returns all rows', async () => {
    db.query.mockResolvedValue({ rows: [{ user_id: 1, email: 'a@b.com' }] });
    const result = await User.getAll();
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
    expect(result).toEqual([{ user_id: 1, email: 'a@b.com' }]);
  });

  test('getOneById returns correct user', async () => {
    db.query.mockResolvedValue({ rows: [{ user_id: 7, email: 'u@x.com' }] });
    const result = await User.getOneById(7);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE user_id'),
      [7]
    );
    expect(result).toEqual({ user_id: 7, email: 'u@x.com' });
  });

  // …similar tests for create, update, destroy
});
