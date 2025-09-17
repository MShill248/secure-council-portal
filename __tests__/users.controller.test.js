const usersController = require('../scp-api/controllers/user.js');

/**
 * Mock the User model as a class with:
 *  - static methods: getAll, getOneById, create
 *  - instance methods: update, destroy
 */
jest.mock('../scp-api/models/User.js', () => {
  return class User {
    constructor(props) { Object.assign(this, props); }
    static getAll = jest.fn();
    static getOneById = jest.fn();
    static create = jest.fn();
    update = jest.fn();
    destroy = jest.fn();
  };
});
const User = require('../scp-api/models/User.js');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  res.end    = jest.fn().mockReturnValue(res);
  return res;
};

describe('Users Controller (unit)', () => {
  test('index -> 200 with list', async () => {
    const data = [{ user_id: 1, email: 'a@b.com' }];
    User.getAll.mockResolvedValue(data);

    const req = {};
    const res = mockRes();
    await usersController.index(req, res);

    expect(User.getAll).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  test('showId -> 200 with user', async () => {
    const user = { user_id: 7, email: 'u@x.com' };
    User.getOneById.mockResolvedValue(user);

    const req = { params: { id: '7' } };
    const res = mockRes();
    await usersController.showId(req, res);

    expect(User.getOneById).toHaveBeenCalledWith(7);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  test('create -> 201 with created user', async () => {
    const body = { email: 'new@x.com', username: 'mo' };
    const created = { user_id: 2, ...body };
    User.create.mockResolvedValue(created);

    const req = { body };
    const res = mockRes();
    await usersController.create(req, res);

    expect(User.create).toHaveBeenCalledWith(body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  test('update -> 200 with updated user', async () => {
    const updated = { user_id: 5, email: 'edit@x.com' };

    const mockInstance = { update: jest.fn().mockResolvedValue(updated) };
    User.getOneById.mockResolvedValue(mockInstance);

    const req = { params: { id: '5' }, body: { email: 'edit@x.com' } };
    const res = mockRes();
    await usersController.update(req, res);

    expect(User.getOneById).toHaveBeenCalledWith(5);
    expect(mockInstance.update).toHaveBeenCalledWith({ email: 'edit@x.com' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test('destroy -> 204 (no content)', async () => {
    const mockInstance = { destroy: jest.fn().mockResolvedValue(true) };
    User.getOneById.mockResolvedValue(mockInstance);

    const req = { params: { id: '3' } };
    const res = mockRes();
    await usersController.destroy(req, res);

    expect(User.getOneById).toHaveBeenCalledWith(3);
    expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });
});