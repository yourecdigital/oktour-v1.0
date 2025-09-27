import { test, expect } from '@playwright/test';

test.describe('Admin Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test('should display login form', async ({ page }) => {
    // Check login form elements
    await expect(page.getByRole('textbox', { name: /username/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Fill login form
    await page.getByRole('textbox', { name: /username/i }).fill('admin');
    await page.getByRole('textbox', { name: /password/i }).fill('password');
    
    // Submit form
    await page.getByRole('button', { name: /login/i }).click();
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/.*admin.*dashboard/);
    
    // Check if admin dashboard is visible
    await expect(page.getByRole('heading', { name: /admin dashboard/i })).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill login form with invalid credentials
    await page.getByRole('textbox', { name: /username/i }).fill('invalid');
    await page.getByRole('textbox', { name: /password/i }).fill('wrong');
    
    // Submit form
    await page.getByRole('button', { name: /login/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    
    // Should stay on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /login/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/username is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should remember login state', async ({ page }) => {
    // Login successfully
    await page.getByRole('textbox', { name: /username/i }).fill('admin');
    await page.getByRole('textbox', { name: /password/i }).fill('password');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for redirect
    await expect(page).toHaveURL(/.*admin.*dashboard/);
    
    // Refresh page
    await page.reload();
    
    // Should still be logged in
    await expect(page.getByRole('heading', { name: /admin dashboard/i })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByRole('textbox', { name: /username/i }).fill('admin');
    await page.getByRole('textbox', { name: /password/i }).fill('password');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for dashboard
    await expect(page.getByRole('heading', { name: /admin dashboard/i })).toBeVisible();
    
    // Click logout
    await page.getByRole('button', { name: /logout/i }).click();
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('textbox', { name: /username/i })).toBeVisible();
  });

  test('should redirect to login when accessing protected routes', async ({ page }) => {
    // Try to access admin dashboard without login
    await page.goto('http://localhost:3001/admin/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('textbox', { name: /username/i })).toBeVisible();
  });

  test('should show loading state during login', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/auth/login', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    // Fill login form
    await page.getByRole('textbox', { name: /username/i }).fill('admin');
    await page.getByRole('textbox', { name: /password/i }).fill('password');
    
    // Submit form
    await page.getByRole('button', { name: /login/i }).click();
    
    // Check loading state
    await expect(page.getByText(/logging in/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeDisabled();
  });

  test('should handle network errors', async ({ page }) => {
    // Mock network error
    await page.route('**/api/auth/login', route => route.abort());
    
    // Fill login form
    await page.getByRole('textbox', { name: /username/i }).fill('admin');
    await page.getByRole('textbox', { name: /password/i }).fill('password');
    
    // Submit form
    await page.getByRole('button', { name: /login/i }).click();
    
    // Should show error message
    await expect(page.getByText(/network error/i)).toBeVisible();
  });
});
