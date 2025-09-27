import { describe, it, expect, beforeEach } from 'vitest';
import { request, app, prisma } from '../test/integration-setup';
import argon2 from 'argon2';

describe('Auth API Integration', () => {
  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        user: {
          email: 'test@example.com',
          username: 'testuser',
          role: 'user',
        },
      });
      expect(response.body.token).toBeDefined();

      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
      });
      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
    });

    it('should not register user with existing email', async () => {
      // Create existing user
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: await argon2.hash('password123'),
          username: 'existinguser',
          role: 'user',
        },
      });

      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'newuser',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toContain('User already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: await argon2.hash('password123'),
          username: 'testuser',
          role: 'user',
        },
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toMatchObject({
        user: {
          email: 'test@example.com',
          username: 'testuser',
          role: 'user',
        },
      });
      expect(response.body.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should not login with non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toContain('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user info with valid token', async () => {
      // Create user and get token
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: await argon2.hash('password123'),
          username: 'testuser',
          role: 'user',
        },
      });

      // Mock JWT token (in real implementation, use actual JWT)
      const token = 'valid-jwt-token';

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: user.id,
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
      });
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.error).toContain('Access token required');
    });

    it('should return 403 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body.error).toContain('Invalid token');
    });
  });
});
