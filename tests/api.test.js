require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const uniqueUser = `testuser_${Date.now()}`;
    
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: uniqueUser,
        password: 'password123',
        role: 'user'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered');
  });
});