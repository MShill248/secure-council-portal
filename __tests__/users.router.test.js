const request = require('supertest');

jest.mock('bcrypt', () => ({ compare: jest.fn() }), { virtual: true });
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(), verify: jest.fn() }), { virtual: true });
jest.mock('nodemailer', () => ({ createTransport: () => ({ sendMail: jest.fn() }) }), { virtual: true });

jest.mock('../scp-api/routers/auth.js', () => {
  const express = require('express');
  return express.Router(); 
});
jest.mock('../scp-api/routers/request.js', () => {
  const express = require('express');
  return express.Router(); 
});

jest.mock('../scp-api/middleware/authenticator', () => (req, res, next) => next());

jest.mock('../scp-api/controllers/user.js', () => ({
  index:  (req, res) => res.status(200).json([{ user_id: 1, email: 'a@b.com' }]),
  showId: (req, res) => res.status(200).json({ user_id: Number(req.params.id), email: 'u@x.com' }),
  create: (req, res) => res.status(201).json({ user_id: 2, ...req.body }),
  update: (req, res) => res.status(200).json({ user_id: Number(req.params.id), ...req.body }),
  destroy:(req, res) => res.status(204).json({}),
}));

const { app } = require('../scp-api/app');

describe('Users Router (API)', () => {
  test('GET /user returns 200 with list', async () => {
    const res = await request(app).get('/user');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /user/7 returns 200 with a user', async () => {
    const res = await request(app).get('/user/7');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ user_id: 7 });
  });

  test('POST /user returns 201 with created user', async () => {
    const payload = { email: 'new@x.com' };
    const res = await request(app).post('/user').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ user_id: 2, email: 'new@x.com' });
  });

  test('PATCH /user/5 returns 200 with updated user', async () => {
    const res = await request(app).patch('/user/5').send({ email: 'edit@x.com' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ user_id: 5, email: 'edit@x.com' });
  });

  test('DELETE /user/3 returns 204', async () => {
    const res = await request(app).delete('/user/3');
    expect(res.status).toBe(204);
  });
});
