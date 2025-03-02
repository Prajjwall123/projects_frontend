import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
    if (testInfo.title === 'Homepage should load and display correct content') {
        return;
    }

    await page.goto('http://localhost:5173/login');

    await page.waitForSelector('h2:has-text("Sign in")', { timeout: 10000 });

    const emailInput = page.locator('input[placeholder="Enter Email Address"]');
    const passwordInput = page.locator('input[placeholder="Enter password"]');
    const submitButton = page.locator('button:has-text("Sign in")');

    if (testInfo.title === 'Freelancer can view project details and redirect to correct URL') {
        await emailInput.fill('findmepokhrel@gmail.com');
        await passwordInput.fill('password');
    } else if (testInfo.title === 'Non-freelancer cannot view project details and sees toast message') {
        await emailInput.fill('pokhrelprajwal29@gmail.com');
        await passwordInput.fill('password');
    }

    await submitButton.click();

    await page.waitForURL('http://localhost:5173');
});

test('Homepage should load and display correct content', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/Projects Yeti/i);
    const freelancerButton = page.locator('text=I am a freelancer');
    await expect(freelancerButton).toBeVisible();
    const enterpriseButton = page.locator('text=I am an enterprise');
    await expect(enterpriseButton).toBeVisible();
    const searchBar = page.locator('input[placeholder="Search by project title..."]');
    await expect(searchBar).toBeVisible();
});

test('Freelancer can view project details and redirect to correct URL', async ({ page }) => {

    await expect(page).toHaveTitle(/Projects Yeti/i);

    const firstProjectCard = page.locator('h2:has-text("MOBILE APPLICATION FOR SANIMA BANK")');
    await expect(firstProjectCard).toBeVisible();

    const viewDetailsButton = page.locator('button:has-text("View Details")').first();
    await viewDetailsButton.waitFor({ state: 'visible', timeout: 10000 });
    await viewDetailsButton.click();

    await page.waitForURL('http://localhost:5173/project-details/67b98183d78296584c1e3bb9');
    await expect(page).toHaveURL('http://localhost:5173/project-details/67b98183d78296584c1e3bb9');
});

test('Non-freelancer cannot view project details and sees toast message', async ({ page }) => {

    await expect(page).toHaveTitle(/Projects Yeti/i);

    const firstProjectCard = page.locator('h2:has-text("MOBILE APPLICATION FOR SANIMA BANK")');
    await expect(firstProjectCard).toBeVisible();

    const viewDetailsButton = page.locator('button:has-text("View Details")').first();
    await viewDetailsButton.waitFor({ state: 'visible', timeout: 10000 });
    await viewDetailsButton.click();

    await expect(page).toHaveURL('http://localhost:5173');

    const toastMessage = page.locator('text="You must be a freelancer to view details"');
    await expect(toastMessage).toBeVisible();
});