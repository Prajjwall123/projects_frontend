import { test, expect } from '@playwright/test';

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
