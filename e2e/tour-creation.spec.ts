import { test, expect } from '@playwright/test';

test.describe('Tour Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Login to admin panel
    await page.goto('http://localhost:3001');
    await page.getByRole('textbox', { name: /username/i }).fill('admin');
    await page.getByRole('textbox', { name: /password/i }).fill('password');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for dashboard
    await expect(page.getByRole('heading', { name: /admin dashboard/i })).toBeVisible();
    
    // Navigate to tours management
    await page.getByRole('link', { name: /tours/i }).click();
  });

  test('should create a new tour', async ({ page }) => {
    // Click create tour button
    await page.getByRole('button', { name: /create tour/i }).click();
    
    // Fill tour form
    await page.getByRole('textbox', { name: /title/i }).fill('Amazing Adventure Tour');
    await page.getByRole('textbox', { name: /description/i }).fill('An incredible adventure through beautiful landscapes');
    await page.getByRole('spinbutton', { name: /price/i }).fill('299');
    await page.getByRole('combobox', { name: /category/i }).selectOption('adventure');
    
    // Upload image
    const fileInput = page.getByRole('textbox', { name: /image/i });
    await fileInput.setInputFiles('test-data/sample-tour-image.jpg');
    
    // Submit form
    await page.getByRole('button', { name: /save/i }).click();
    
    // Should show success message
    await expect(page.getByText(/tour created successfully/i)).toBeVisible();
    
    // Should redirect to tours list
    await expect(page).toHaveURL(/.*tours/);
    
    // Check if new tour appears in list
    await expect(page.getByText('Amazing Adventure Tour')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Click create tour button
    await page.getByRole('button', { name: /create tour/i }).click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: /save/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/title is required/i)).toBeVisible();
    await expect(page.getByText(/description is required/i)).toBeVisible();
    await expect(page.getByText(/price is required/i)).toBeVisible();
  });

  test('should edit existing tour', async ({ page }) => {
    // Find existing tour and click edit
    await page.getByRole('button', { name: /edit/i }).first().click();
    
    // Update tour title
    await page.getByRole('textbox', { name: /title/i }).fill('Updated Tour Title');
    
    // Submit form
    await page.getByRole('button', { name: /save/i }).click();
    
    // Should show success message
    await expect(page.getByText(/tour updated successfully/i)).toBeVisible();
    
    // Check if updated title appears
    await expect(page.getByText('Updated Tour Title')).toBeVisible();
  });

  test('should delete tour', async ({ page }) => {
    // Find existing tour and click delete
    await page.getByRole('button', { name: /delete/i }).first().click();
    
    // Confirm deletion
    await page.getByRole('button', { name: /confirm/i }).click();
    
    // Should show success message
    await expect(page.getByText(/tour deleted successfully/i)).toBeVisible();
  });

  test('should filter tours by category', async ({ page }) => {
    // Select category filter
    await page.getByRole('combobox', { name: /filter by category/i }).selectOption('adventure');
    
    // Check if only adventure tours are shown
    const tourCards = page.locator('[data-testid="tour-card"]');
    await expect(tourCards).toHaveCount(2); // Assuming 2 adventure tours
    
    // Change filter
    await page.getByRole('combobox', { name: /filter by category/i }).selectOption('cultural');
    
    // Check if only cultural tours are shown
    await expect(tourCards).toHaveCount(1); // Assuming 1 cultural tour
  });

  test('should search tours by title', async ({ page }) => {
    // Enter search term
    await page.getByRole('textbox', { name: /search/i }).fill('adventure');
    
    // Check if filtered results appear
    await expect(page.getByText('Amazing Adventure Tour')).toBeVisible();
    await expect(page.getByText('Cultural Heritage Tour')).not.toBeVisible();
  });

  test('should handle image upload', async ({ page }) => {
    // Click create tour button
    await page.getByRole('button', { name: /create tour/i }).click();
    
    // Upload image
    const fileInput = page.getByRole('textbox', { name: /image/i });
    await fileInput.setInputFiles('test-data/sample-tour-image.jpg');
    
    // Check if image preview appears
    await expect(page.locator('img[alt="Tour preview"]')).toBeVisible();
    
    // Check if upload progress is shown
    await expect(page.getByText(/uploading/i)).toBeVisible();
  });

  test('should handle bulk operations', async ({ page }) => {
    // Select multiple tours
    await page.getByRole('checkbox', { name: /select tour/i }).first().check();
    await page.getByRole('checkbox', { name: /select tour/i }).nth(1).check();
    
    // Click bulk delete
    await page.getByRole('button', { name: /bulk delete/i }).click();
    
    // Confirm deletion
    await page.getByRole('button', { name: /confirm/i }).click();
    
    // Should show success message
    await expect(page.getByText(/tours deleted successfully/i)).toBeVisible();
  });

  test('should show tour details', async ({ page }) => {
    // Click on tour title to view details
    await page.getByText('Amazing Adventure Tour').click();
    
    // Should show tour details modal
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('An incredible adventure through beautiful landscapes')).toBeVisible();
    await expect(page.getByText('$299')).toBeVisible();
  });

  test('should handle form errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/tours', route => route.abort());
    
    // Click create tour button
    await page.getByRole('button', { name: /create tour/i }).click();
    
    // Fill form
    await page.getByRole('textbox', { name: /title/i }).fill('Test Tour');
    await page.getByRole('textbox', { name: /description/i }).fill('Test Description');
    await page.getByRole('spinbutton', { name: /price/i }).fill('100');
    
    // Submit form
    await page.getByRole('button', { name: /save/i }).click();
    
    // Should show error message
    await expect(page.getByText(/failed to create tour/i)).toBeVisible();
  });
});
