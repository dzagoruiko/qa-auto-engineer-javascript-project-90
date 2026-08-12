import { test, expect } from '@playwright/test';

test('приложение успешно рендерится', async ({ page }) => {
  // Используем относительный путь (baseURL уже настроен в playwright.config.js)
  await page.goto('/');
  
  await expect(page.getByText('SIGN IN')).toBeVisible();
  await expect(page.getByText('Username')).toBeVisible();
  await expect(page.getByText('Password')).toBeVisible();
});
