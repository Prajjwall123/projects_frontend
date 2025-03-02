import { test, expect } from '@playwright/test';

test.describe('CompanyDashboard Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        await page.waitForSelector('h2:has-text("Sign in")', { timeout: 10000 });

        const emailInput = page.locator('input[placeholder="Enter Email Address"]');
        const passwordInput = page.locator('input[placeholder="Enter password"]');
        const submitButton = page.locator('button:has-text("Sign in")');

        console.log('Email input visible:', await emailInput.isVisible());
        console.log('Password input visible:', await passwordInput.isVisible());
        console.log('Submit button visible:', await submitButton.isVisible());

        await emailInput.fill('pokhrelprajwal29@gmail.com');
        await passwordInput.fill('password');

        await submitButton.click();

        await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
        await expect(page).toHaveURL('http://localhost:5173/');

        await page.reload();
        await page.waitForURL('http://localhost:5173/', { timeout: 10000 });

        await page.waitForSelector('div.navbar', { timeout: 10000 });

        const avatar = page.locator('div.btn-circle.avatar img');
        console.log('Avatar visible:', await avatar.isVisible());
        await avatar.click();

        const profileOption = page.locator('ul.dropdown-content a:has-text("Profile")');
        console.log('Profile option visible:', await profileOption.isVisible());
        await profileOption.click();

        await page.waitForURL('http://localhost:5173/company/679e52a2570ca2c950216916', { timeout: 10000 });
        await expect(page).toHaveURL('http://localhost:5173/company/679e52a2570ca2c950216916');
    });

    test('should display company dashboard with projects', async ({ page }) => {
        await page.waitForSelector('h2:has-text("Hello Technergy Global")', { timeout: 10000 });

        await expect(page.locator('h2:has-text("Hello Technergy Global")')).toBeVisible();

        await expect(page.locator('li:has-text("Dashboard")')).toBeVisible();
        await expect(page.locator('li:has-text("Notifications")')).toBeVisible();
        await expect(page.locator('li:has-text("Company Profile")')).toBeVisible();
        await expect(page.locator('li:has-text("Your Wallet")')).toBeVisible();
        await expect(page.locator('button:has-text("Post New Project")')).toBeVisible();
        await expect(page.locator('text=Projects Posted')).toBeVisible();
        await expect(page.locator('text=3').first()).toBeVisible();
        await expect(page.locator('text=Projects Awarded')).toBeVisible();
        await expect(page.locator('text=1').first()).toBeVisible();
        await expect(page.locator('text=Projects Completed')).toBeVisible();
        await expect(page.locator('text=0').first()).toBeVisible();
        await expect(page.locator('text=Your Current Projects')).toBeVisible();
        await expect(page.locator('text=Mobile application for Sanima bank')).toBeVisible();
        await expect(page.locator('text=22/02/2025')).toBeVisible();
        await expect(page.locator('button:has-text("Bidders")').first()).toBeVisible();

    });

    test('should redirect to login if directly accessing dashboard URL without proper navigation', async ({ page }) => {
        await page.goto('http://localhost:5173/company/679e52a2570ca2c950216916');
        await page.waitForURL('http://localhost:5173/login', { timeout: 10000 });
        await expect(page).toHaveURL('http://localhost:5173/login');
    });

    test('should navigate between sidebar sections', async ({ page }) => {
        await page.waitForSelector('h2:has-text("Hello Technergy Global")', { timeout: 10000 });

        await expect(page.locator('text=Your Current Projects')).toBeVisible();

        await page.click('li:has-text("Notifications")');
        await expect(page.locator('h2:has-text("Notifications")')).toBeVisible();

        await page.click('li:has-text("Company Profile")');
        await expect(page.locator(`h1:text("Technergy Global")`)).toBeVisible();

        await page.click('li:has-text("Your Wallet")');
        await expect(page.locator('h2:has-text("Your Wallet")')).toBeVisible();

        await page.click('button:has-text("Post New Project")');
        await expect(page.locator('label:has-text("Project Title")')).toBeVisible();

        await page.click('li:has-text("Dashboard")');
        await expect(page.locator('text=Your Current Projects')).toBeVisible();
    });
});