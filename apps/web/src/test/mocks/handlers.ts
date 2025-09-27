import { http, HttpResponse } from 'msw';

export const handlers = [
  // Tours API
  http.get('/api/tours', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'Test Tour',
        description: 'A test tour description',
        price: 100,
        category: 'adventure',
        media: ['/test-image.jpg'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ]);
  }),

  http.get('/api/tours/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: 'Test Tour',
      description: 'A test tour description',
      price: 100,
      category: 'adventure',
      media: ['/test-image.jpg'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });
  }),

  // Auth API
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (body.email === 'admin@test.com' && body.password === 'password') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'admin@test.com',
          username: 'admin',
          role: 'admin',
        },
      });
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      id: 1,
      email: 'admin@test.com',
      username: 'admin',
      role: 'admin',
    });
  }),

  // Media upload
  http.post('/api/upload', () => {
    return HttpResponse.json({
      url: '/uploads/test-file.jpg',
      filename: 'test-file.jpg',
    });
  }),

  // Hero backgrounds
  http.get('/api/hero', () => {
    return HttpResponse.json([
      {
        id: 1,
        url: '/hero-bg.jpg',
        type: 'image',
        page: 'home',
        order: 1,
        fallbackUrl: '/hero-fallback.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ]);
  }),
];