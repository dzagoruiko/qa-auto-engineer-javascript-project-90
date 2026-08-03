import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';

test.describe('Авторизация', () => {
  test('успешный вход с правильными данными', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.login('admin', 'admin');
    
    await loginPage.assertLoginSuccess();
  });
});

test.describe('Выход из приложения', () => {
  test('успешный выход', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Сначала входим
    await loginPage.navigate();
    await loginPage.login('admin', 'admin');
    await loginPage.assertLoginSuccess();
    
    // Затем выходим
    await loginPage.logout();
    await loginPage.assertLoggedOut();
  });
});