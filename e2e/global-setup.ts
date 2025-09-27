import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Setup test data
    console.log('Setting up test data...');
    
    // Create test admin user
    const response = await page.request.post('http://localhost:5000/api/auth/register', {
      data: {
        email: 'admin@test.com',
        password: 'password',
        username: 'admin',
        role: 'admin',
      },
    });
    
    if (response.ok()) {
      console.log('Test admin user created successfully');
    } else {
      console.log('Test admin user may already exist');
    }
    
    // Create test tours
    const tours = [
      {
        title: 'Amazing Adventure Tour',
        description: 'An incredible adventure through beautiful landscapes',
        price: 299,
        category: 'adventure',
        media: ['/test-images/adventure.jpg'],
      },
      {
        title: 'Cultural Heritage Tour',
        description: 'Explore rich cultural heritage and traditions',
        price: 199,
        category: 'cultural',
        media: ['/test-images/cultural.jpg'],
      },
    ];
    
    for (const tour of tours) {
      await page.request.post('http://localhost:5000/api/tours', {
        data: tour,
      });
    }
    
    console.log('Test tours created successfully');
    
  } catch (error) {
    console.error('Error during global setup:', error);
  } finally {
    await browser.close();
  }
}

export default globalSetup;
