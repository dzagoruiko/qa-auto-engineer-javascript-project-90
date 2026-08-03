import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Sign in' });
    // Селектор для аватара пользователя
    this.userMenu = page.locator('.css-6u3hli-RaUserMenu-root');
    // Кнопка Logout (индекс 1)
    this.logoutMenuItem = page.locator('.MuiList-root').nth(1);
  }

  async navigate() {
    await this.page.goto('http://localhost:5173/#/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoginSuccess() {
    await expect(this.loginButton).not.toBeVisible();
  }

  async logout() {
    // Нажимаем на аватар пользователя
    await this.userMenu.click();
    // Нажимаем на Logout
    await this.logoutMenuItem.click();
  }

  async assertLoggedOut() {
    await expect(this.loginButton).toBeVisible({ timeout: 10000 });
  }
}
