import { expect } from '@playwright/test';
import { BaseCrudPage } from './BaseCrudPage.js';

export class UsersPage extends BaseCrudPage {
  constructor(page) {
    super(page, 'users');
    
    this.emailInput = page.getByLabel('Email');
    this.firstNameInput = page.getByLabel('First name');
    this.lastNameInput = page.getByLabel('Last name');
    
    this.emailHeader = page.getByText('Email');
    this.firstNameHeader = page.getByText('First name');
    this.lastNameHeader = page.getByText('Last name');
  }

  // Действие: только создание пользователя
  async createUser(email, firstName, lastName) {
    await this.createButton.click();
    await this.page.waitForSelector('h6:has-text("Create User")');
    
    await this.emailInput.fill(email);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    
    await this.saveButton.click();
    await this.navigate();
  }

  async editUser(id, newEmail, newFirstName, newLastName) {
    await this.clickItemById(id);
    
    await this.emailInput.clear();
    await this.emailInput.fill(newEmail);
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(newFirstName);
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(newLastName);
    
    await this.saveButton.click();
    await this.assertElementUpdated();
  }

  async deleteUser(id) {
    await this.clickItemById(id);
    await this.deleteButton.click();
    await this.assertElementDeleted();
  }

  async bulkDeleteUsers() {
    await this.selectAllCheckbox.check();
    await this.bulkDeleteButton.click();
    await this.assertNoItems();
  }

  async fillInvalidEmail(email) {
    await this.createButton.click();
    await this.page.waitForSelector('h6:has-text("Create User")');
    
    await this.emailInput.fill(email);
    await this.firstNameInput.fill('Test');
    await this.lastNameInput.fill('User');
    
    await this.saveButton.click();
  }

  async assertInvalidEmailError() {
    await expect(this.page.locator('.RaNotification-error')).toBeVisible();
  }

  async assertUserExists(email) {
    await expect(this.page.locator('tr', {
      has: this.page.locator(`.column-email:has-text("${email}")`),
    }).first()).toBeVisible();
  }

  async assertUserNotExists(email) {
    await expect(this.page.locator('tr', {
      has: this.page.locator(`.column-email:has-text("${email}")`),
    }).first()).not.toBeVisible();
  }

  async assertUserData(email, firstName, lastName) {
    const row = this.page.locator('tr', {
      has: this.page.locator(`.column-email:has-text("${email}")`),
    });
    await expect(row.locator(`.column-firstName:has-text("${firstName}")`)).toBeVisible();
    await expect(row.locator(`.column-lastName:has-text("${lastName}")`)).toBeVisible();
  }

  async assertHeadersVisible() {
    await expect(this.emailHeader).toBeVisible();
    await expect(this.firstNameHeader).toBeVisible();
    await expect(this.lastNameHeader).toBeVisible();
  }
}
