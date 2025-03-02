import { test, expect } from '@playwright/test';

test.describe('CompanyView Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/company-view/679e52a2570ca2c950216916');
    });

    test('should display company details', async ({ page }) => {
        await page.waitForSelector('h2:has-text("About the Company")', { timeout: 10000 });

        await page.waitForSelector('h3:has-text("Company Information")', { timeout: 10000 });

        await expect(page.locator('h1:has-text("Technergy Global")')).toBeVisible();
        await expect(page.locator('p:has-text("Sifal, Kathmandu")')).toBeVisible();
        await expect(page.locator('p:has-text("We, at Technergy Global are a passionate team of developers and engineers looking forward to making tech revolutions in Nepal and beyond.")')).toBeVisible();
        await expect(page.locator('h3:has-text("Projects Posted")')).toBeVisible();
        await expect(page.locator('text=3').first()).toBeVisible();
        await expect(page.locator('h3:has-text("Projects Awarded")')).toBeVisible();
        await expect(page.locator('text=1').first()).toBeVisible();
        await expect(page.locator('h3:has-text("Projects Completed")')).toBeVisible();
        await expect(page.locator('text=0').first()).toBeVisible();
        await expect(page.locator('li:has-text("Founded:")')).toContainText('2022');
        await expect(page.locator('li:has-text("CEO:")')).toContainText('Basanta Adhikari');
        await expect(page.locator('li:has-text("Employees:")')).toContainText('12');

        const industryElement = page.locator('li:has-text("Industry:")');
        const industryText = await industryElement.innerText();
        console.log('Industry element text:', industryText);

        await expect(industryElement).toContainText('IT');
        await expect(page.locator('strong:has-text("Website:")')).toBeVisible();
        await expect(page.locator('a:has-text("https://technergy.com.np/")')).toBeVisible();
    });


    test('should navigate to company website', async ({ page }) => {
        await page.waitForSelector('h2:has-text("About the Company")', { timeout: 10000 });

        const [newPage] = await Promise.all([
            page.context().waitForEvent('page', { timeout: 10000 }),
            page.click('a:has-text("https://technergy.com.np/")'),
        ]);

        await expect(newPage).toHaveURL('https://technergy.com.np/');
        await newPage.close();
    });
});