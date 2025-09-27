import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Tour Travel/);
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /welcome to tour travel/i })).toBeVisible();
    
    // Check navigation
    await expect(page.getByRole('link', { name: /tours/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
    
    // Check hero section
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('should navigate to tours page', async ({ page }) => {
    await page.goto('/');
    
    // Click on tours link
    await page.getByRole('link', { name: /tours/i }).click();
    
    // Should navigate to tours page
    await expect(page).toHaveURL(/.*tours/);
    await expect(page.getByRole('heading', { name: /tours/i })).toBeVisible();
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');
    
    // Click on contact link
    await page.getByRole('link', { name: /contact/i }).click();
    
    // Should navigate to contact page
    await expect(page).toHaveURL(/.*contact/);
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
  });

  test('should change language', async ({ page }) => {
    await page.goto('/');
    
    // Find language selector
    const languageSelector = page.getByRole('combobox');
    await expect(languageSelector).toBeVisible();
    
    // Change to Arabic
    await languageSelector.selectOption('ar');
    
    // Check if page content changes (RTL layout)
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile navigation is visible
    const mobileMenu = page.getByRole('button', { name: /menu/i });
    await expect(mobileMenu).toBeVisible();
    
    // Check if content is properly displayed
    await expect(page.getByRole('heading', { name: /welcome to tour travel/i })).toBeVisible();
  });

  test('should load hero background video', async ({ page }) => {
    await page.goto('/');
    
    // Check if hero video is present
    const heroVideo = page.locator('video');
    await expect(heroVideo).toBeVisible();
    
    // Check video attributes
    await expect(heroVideo).toHaveAttribute('autoplay');
    await expect(heroVideo).toHaveAttribute('loop');
    await expect(heroVideo).toHaveAttribute('muted');
  });

  test('should display loading state', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/tours', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    await page.goto('/');
    
    // Check if loading indicator appears
    await expect(page.getByText(/loading/i)).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/tours', route => route.abort());
    
    await page.goto('/');
    
    // Check if error message is displayed
    await expect(page.getByText(/error/i)).toBeVisible();
  });
});
