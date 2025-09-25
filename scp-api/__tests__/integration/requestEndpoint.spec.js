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

  describe('GET /request', () => {
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

  describe('GET /request/user', () => {
    const mockToken = jwt.sign({username: "testuser" , userId: 1}, process.env.SECRET_TOKEN, { expiresIn: 3600 })
    beforeEach(() => {
      app.use((req, res, next) => {
        req.userId = 1
        next()
      })
    })
    it('should return all requests with a status code 200', async () => {
      
      const response = await request(api).get('/request/user').set("authorization", mockToken);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /request/borough', () => {
    const mockToken = jwt.sign({username: "testuser" , userId: 1}, process.env.SECRET_TOKEN, { expiresIn: 3600 })
    beforeEach(() => {
      app.use((req, res, next) => {
        req.userId = 1
        next()
      })
    })
    it('should return all requests with a status code 200', async () => {
      const response = await request(api).get('/request/borough').set("authorization", mockToken);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /request/:id', () => {
    const mockToken = jwt.sign({username: "alicej" , userId: 1}, process.env.SECRET_TOKEN, { expiresIn: 3600 })
    beforeEach(() => {
      app.use((req, res, next) => {
        req.username = 'alicej',
        req.userId = 1
        next()
      })
    })
    it('should return a specific request by ID', async () => {
      const requestId = 1;
      const response = await request(api).get(`/request/${requestId}`).set("authorization", mockToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('request_id', requestId);
    });

    it('should return a 404 if request is not found', async () => {
      const nonExistentrequestId = 999;
      const response = await request(api).get(`/requests/${nonExistentrequestId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /request', () => {
    const mockToken = jwt.sign({username: "alicej" , userId: 1}, process.env.SECRET_TOKEN, { expiresIn: 3600 })
    beforeEach(() => {
      app.use((req, res, next) => {
        req.username = 'alicej',
        req.userId = 1
        next()
      })
    })
    it('should create a new request and return it', async () => {
      const newrequest = { title: "No bins too!!!", description: "We also have run out of bins",
      status: "pending", category: "waste-collection", priority: 2, type: "service" };
      const response = await request(api)
        .post('/requests/')
        .set("authorization", mockToken)
        .send(newrequest);


      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('name', 'Billy');
      expect(response.body.data).toHaveProperty('age', 3);
    });

    it('should return a 400 if required fields are missing', async () => {
      const incompleterequest = { name: 'Billy' };
      const response = await request(api)
        .post('/requests')
        .send(incompleterequest);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('age is missing');
    });
  });

  describe('PATCH /requests/:id', () => {
    it('should update an existing request and return it', async () => {
      const requestId = 1;
      const updatedrequest = { name: 'Updated request', age: 5 };
      const response = await request(api)
        .patch(`/requests/${requestId}`)
        .send(updatedrequest);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('name', 'Updated request');
      expect(response.body.data).toHaveProperty('age', 5);
    });

    it('should return a 400 if update fails due to missing data', async () => {
      const nonExistentrequestId = 999;
      const updateData = { name: 'Updated request', age: 5 };

      const response = await request(api).patch(`/requests/${nonExistentrequestId}`).send(updateData);;

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('This request does not exist!');
    });
  });
  
  describe('DELETE /requests/:id', () => {
    it('should delete a request and return a 204 status code', async () => {
      const requestId = 1;
      const response = await request(api).delete(`/requests/${requestId}`);

      expect(response.status).toBe(204);
    });

    it('should return a 404 if the request to delete does not exist', async () => {
      const nonExistentrequestId = 999;
      const response = await request(api).delete(`/requests/${nonExistentrequestId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('This request does not exist!');
    });
  });
  
})
