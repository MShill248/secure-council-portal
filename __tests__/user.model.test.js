// Mock the DB connector once at top
jest.mock('../scp-api/database/connect', () => ({
  query: jest.fn(),
}));

const db = require('../scp-api/database/connect');
const User = require('../scp-api/models/User');

describe('User model — happy paths', () => {
  afterEach(() => jest.clearAllMocks());

  test('getAll maps rows to User instances', async () => {
    db.query.mockResolvedValue({
      rows: [
        { user_id: 1, email: 'a@b.com' },
        { user_id: 2, email: 'c@d.com' },
      ],
    });
    const users = await User.getAll();
    expect(Array.isArray(users)).toBe(true);
    expect(users[0]).toHaveProperty('user_id', 1);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users;');
  });

  test('getOneById returns a User', async () => {
    db.query.mockResolvedValue({ rows: [{ user_id: 7, email: 'u@x.com' }] });
    const u = await User.getOneById(7);
    expect(u).toHaveProperty('user_id', 7);
    expect(db.query).toHaveBeenCalled();
  });

  test('update success returns updated user', async () => {
    const u = new User({ user_id: 9 });
    db.query.mockResolvedValue({
      rows: [{ user_id: 9, email: 'new@x.com' }],
    });
    const updated = await u.update({ email: 'new@x.com' });
    expect(updated).toHaveProperty('email', 'new@x.com');
    expect(db.query).toHaveBeenCalled();
  });
});

describe('User model — error branches', () => {
  afterEach(() => jest.clearAllMocks());

  test('getAll throws when no users', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(User.getAll()).rejects.toThrow(/No users available/i);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users;');
  });

  test('getOneById throws when not found', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(User.getOneById(123)).rejects.toThrow(/Unable to locate user/i);
    expect(db.query).toHaveBeenCalled();
  });

  test('update throws when UPDATE returns 0 rows', async () => {
    const u = new User({ user_id: 9 });
    db.query.mockResolvedValueOnce({ rows: [] }); // Simulate UPDATE returned no row
    await expect(u.update({ email: 'x@x.com' })).rejects.toThrow(/Unable to update user/i);
    expect(db.query).toHaveBeenCalled();
  });
});