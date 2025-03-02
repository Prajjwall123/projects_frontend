import { test, expect } from '@playwright/test';

test.describe('ProjectDetails Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/project-details/67c301e3e9aa44afd33df4de');
    });

    test('should display project details', async ({ page }) => {
        await page.waitForSelector('h2:has-text("AI-Powered Resume Screening System")', { timeout: 10000 });

        await expect(page.locator('h2:has-text("AI-Powered Resume Screening System")')).toBeVisible();
        await expect(page.locator('h3:has-text("Technergy Global")')).toBeVisible();
        await expect(page.locator('p:has-text("Looking for an AI system that can analyze resumes and shortlist candidates based on job descriptions.")')).toBeVisible();
        await expect(page.locator('text=0 Bids')).toBeVisible();

        await expect(page.locator('strong:has-text("Posted Date:")')).toBeVisible();
        await expect(page.locator('text=3/1/2025')).toBeVisible();
        await expect(page.locator('strong:has-text("Duration:")')).toBeVisible();
        await expect(page.locator('text=8')).toBeVisible();
        await expect(page.locator('strong:has-text("Categories:")')).toBeVisible();
        await expect(page.locator('span:has-text("Web Development")')).toBeVisible();
        await expect(page.locator('span:has-text("Machine Learning")')).toBeVisible();
        await expect(page.locator('strong:has-text("Status:")')).toBeVisible();

        await expect(page.locator('h3:has-text("Requirements")')).toBeVisible();
        await expect(page.locator('li:has-text("Custom product filtering & search")')).toBeVisible();
        await expect(page.locator('li:has-text("Secure payment gateway integration (Stripe, Khalti)")')).toBeVisible();
        await expect(page.locator('li:has-text("Mobile-responsive UI")')).toBeVisible();
        await expect(page.locator('li:has-text("Order & Inventory Management")')).toBeVisible();
        await expect(page.locator('li:has-text("Multi-language support (English, Nepali)")')).toBeVisible();

        await expect(page.locator('button:has-text("Bid")')).toBeVisible();
    });

    test('should navigate to company view on logo click', async ({ page }) => {
        await page.waitForSelector('h2:has-text("AI-Powered Resume Screening System")', { timeout: 10000 });

        await page.click('h3:has-text("Technergy Global")');

        await page.waitForURL('http://localhost:5173/company-view/679e52a2570ca2c950216916', { timeout: 10000 });
        await expect(page).toHaveURL('http://localhost:5173/company-view/679e52a2570ca2c950216916');
    });

});