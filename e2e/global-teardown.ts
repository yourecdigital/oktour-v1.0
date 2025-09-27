import { chromium, FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Cleaning up test data...');
    
    // Clean up test tours
    const tours = await page.request.get('http://localhost:5000/api/tours');
    if (tours.ok()) {
      const toursData = await tours.json();
      for (const tour of toursData) {
        await page.request.delete(`http://localhost:5000/api/tours/${tour.id}`);
      }
    }
    
    // Clean up test users
    const users = await page.request.get('http://localhost:5000/api/users');
    if (users.ok()) {
      const usersData = await users.json();
      for (const user of usersData) {
        if (user.email === 'admin@test.com') {
          await page.request.delete(`http://localhost:5000/api/users/${user.id}`);
        }
      }
    }
    
    console.log('Test data cleaned up successfully');
    
  } catch (error) {
    console.error('Error during global teardown:', error);
  } finally {
    await browser.close();
  }
}

export default globalTeardown;
