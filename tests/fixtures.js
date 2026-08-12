import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';

// Расширяем базовый тест, добавляя авторизованную страницу
export const test = base.extend({
  // Фикстура для авторизованной страницы
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('admin', 'admin');
    await loginPage.assertLoginSuccess();
    
    // Передаём авторизованную страницу в тест
    await use(page);
  },
});

export { expect } from '@playwright/test';
