import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Sign in' });
    // Используем роли вместо CSS-хешей
    this.userMenu = page.getByRole('button', { name: 'Profile' });
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
    this.errorMessage = page.locator('.RaLogin-error');
  }

  async navigate() {
    await this.page.goto('/#/login');
    await this.page.waitForSelector('.MuiButtonBase-root');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoginSuccess() {
    await expect(this.loginButton).not.toBeVisible();
  }

  async assertLoginError(expectedMessage) {
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutMenuItem.click();
  }

  async assertLoggedOut() {
    await expect(this.loginButton).toBeVisible({ timeout: 10000 });
  }
}
