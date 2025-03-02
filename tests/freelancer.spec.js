import { test, expect } from '@playwright/test';

test.describe('FreelancerDashboard Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/freelancer/679e5d8f4e658cfacb72a07d');
    });

    test('should display freelancer dashboard with projects', async ({ page }) => {
        await expect(page.locator('h2:has-text("Hello Prajwal")')).toBeVisible();

        await expect(page.locator('li:has-text("Dashboard")')).toBeVisible();
        await expect(page.locator('li:has-text("Notifications")')).toBeVisible();
        await expect(page.locator('li:has-text("Wallet")')).toBeVisible();
        await expect(page.locator('li:has-text("My Profile")')).toBeVisible();
        await expect(page.locator('span:has-text("2")')).toBeVisible();

        await expect(page.locator('text=Your Projects')).toBeVisible();

        await expect(page.locator('text=Company')).toBeVisible();
        await expect(page.locator('text=Category')).toBeVisible();
        await expect(page.locator('text=Status')).toBeVisible();
        await expect(page.locator('text=Actions')).toBeVisible();

        await expect(page.locator('text=Mobile App Using Flutter and dart for Fitness Tracking')).toBeVisible();
        await expect(page.locator('text=Technergy Global')).toBeVisible();
        await expect(page.locator('text=Mobile App Development, Flutter')).toBeVisible();

        await expect(page.locator('button:has-text("Show Feedback")')).toBeVisible();
        await expect(page.locator('button:has-text("View Details")')).toBeVisible();
    });


    test('should handle freelancer loading error', async ({ page }) => {
        await page.goto('http://localhost:5173/freelancer/invalid-freelancer-id');

        await expect(page.locator('text=Failed to load freelancer data. Please try again.')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('button:has-text("Go to Home")')).toBeVisible();

        await page.click('button:has-text("Go to Home")');
        await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
        await expect(page).toHaveURL('http://localhost:5173/');
    });


    test('should sign out and navigate to login page', async ({ page }) => {
        await page.waitForSelector('h2:has-text("Hello Prajwal")', { timeout: 10000 });

        await page.click('button:has-text("Sign Out")');

        await page.waitForURL('http://localhost:5173/login', { timeout: 10000 });
        await expect(page).toHaveURL('http://localhost:5173/login');
    });

    test('should navigate to project details on view details click', async ({ page }) => {
        await page.waitForSelector('h2:has-text("Hello Prajwal")', { timeout: 10000 });
        await page.click('button:has-text("View Details")');
        await page.waitForURL(/\/project-details\//, { timeout: 10000 });
        await expect(page).toHaveURL(/\/project-details\//);
    });
});