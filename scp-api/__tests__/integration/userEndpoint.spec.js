process.env.TEST_ENV = true

const request = require('supertest')
const jwt = require("jsonwebtoken")

const { app } = require('../../app')
const { resetTestDB } = require('./config/config')

const {Request} = require('../../models/Request')

describe('Request API Endpoints', () => {
  let api

  beforeAll(() => {
    api = app.listen(4000, () => {
      console.log('Test server running on port 4000')
    })
  })
  
  beforeEach(async () => {
    await resetTestDB()
  })

  afterAll((done) => {
    delete process.env.TEST_ENV
    console.log('Gracefully closing server')
    api.close(done)
  })

  describe('GET /user', () => {
    it('responds to GET / with a message and a description', async () => {
      const response = await request(api).get('/request')
  
      expect(response.statusCode).toBe(200)
    })
  });

  describe('GET /request/recent', () => {
    it('should return all requests with a status code 200', async () => {
      const response = await request(api).get('/request/recent');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /user', () => {
    const mockToken = jwt.sign({username: "testuser" , userId: 1}, process.env.SECRET_TOKEN, { expiresIn: 3600 })
    beforeEach(() => {
      app.use((req, res, next) => {
        req.userId = 1
        next()
      })
    })
    it('should return all users with a status code 200', async () => {
      
      const response = await request(api).get('/user').set("authorization", mockToken);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /user/:id', () => {
    const mockToken = jwt.sign({username: "alicej" , userId: 1}, process.env.SECRET_TOKEN, { expiresIn: 3600 })
    beforeEach(() => {
      app.use((req, res, next) => {
        req.username = 'alicej',
        req.userId = 1
        next()
      })
    })
    it('should return a specific user by ID', async () => {
      const userId = 1;
      const response = await request(api).get(`/user/${userId}`).set("authorization", mockToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user_id', userId);
    });

    it('should return a 404 if user is not found', async () => {
      const nonExistentusertId = 999;
      const response = await request(api).get(`/user/${nonExistentusertId }`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /user', () => {
    const mockToken = jwt.sign({username: "alicej" , userId: 1}, process.env.SECRET_TOKEN, { expiresIn: 3600 })
    beforeEach(() => {
      app.use((req, res, next) => {
        req.username = 'alicej',
        req.userId = 1
        next()
      })
    })
    const newrequest = {     
        username: "testuser",
        first_name: "ted",
        last_name: "test",
        email: "test123@test.com",
        password: "test123",
        dob: "01-01-1990",
        address: "1 Test Street",
        postcode: "SY17 8GH",
        borough: "idk london",
        phone_number: "07654 678903",
        user_role: "developer" 
    }
    it('should create a new user and return it', async () => {
      const response = await request(api).post('/user/').set("authorization", mockToken).send(newrequest);


      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('username', 'testuser');
    });

    it('should return a 400 if required fields are missing', async () => {
      const incompleterequest = { username: 'No bin' };
      const response = await request(api)
        .post('/user')
        .set('authorization', mockToken)
        .send(incompleterequest);

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /user/:id', () => {
    const mockToken = jwt.sign({username: "alicej" , userId: 1}, process.env.SECRET_TOKEN, { expiresIn: 3600 })
    beforeEach(() => {
      app.use((req, res, next) => {
        req.username = 'alicej',
        req.userId = 1
        next()
      })
    })
    it('should update an existing user and return it', async () => {
      const userId = 1;
      const updatedrequest = { Borough: 'Greenwich'};
      const response = await request(api)
        .patch(`/user/update`)
        .set('authorization', mockToken)
        .send(updatedrequest);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('borough', 'Greenwich');
    });

    it('should return a 400 if update fails due to missing data', async () => {
      const nonExistentrequestId = 999;
      const updateData = { borough: 'Greenwich'};
      const mockToken = jwt.sign({username: "alicej" , userId: 999}, process.env.SECRET_TOKEN, { expiresIn: 3600 })
      const response = await request(api).patch(`/user/update`)
      .set('authorization', mockToken)
      .send(updateData);;

      expect(response.status).toBe(404);
    });
  });
  
  describe('DELETE /user/:id', () => {
    it('should delete a user and return a 204 status code', async () => {
      const userId = 1;
      const response = await request(api).delete(`/user/${userId}`);

      expect(response.status).toBe(204);
    });

    it('should return a 404 if the user to delete does not exist', async () => {
      const nonExistentuserId = 999;
      const response = await request(api).delete(`/user/${nonExistentuserId}`);

      expect(response.status).toBe(404);
    });
  });
  
})
