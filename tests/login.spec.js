import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {

    test('should successfully log in with correct credentials', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        await page.fill('input[name="email"]', 'pokhrelprajwal29@gmail.com');
        await page.fill('input[name="password"]', 'password');

        await page.click('button[type="submit"]');

        await page.waitForURL('http://localhost:5173/');

        await expect(page).toHaveURL('http://localhost:5173/');
    });

    test('should toggle password visibility', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        await page.fill('input[name="password"]', 'TestPassword123');

        const passwordInput = page.locator('input[name="password"]');

        await expect(passwordInput).toHaveAttribute('type', 'password');

        await page.click('svg.cursor-pointer');

        await expect(passwordInput).toHaveAttribute('type', 'text');

        await page.click('svg.cursor-pointer');

        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

});
