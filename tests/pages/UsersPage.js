import { expect } from '@playwright/test';

export class UsersPage {
  constructor(page) {
    this.page = page;
    
    this.usersLink = page.locator('.MuiButtonBase-root').nth(7);
    
    this.createButton = page.locator('a.RaCreateButton-root[href="#/users/create"]');
    this.saveButton = page.locator('.MuiButtonBase-root.MuiButton-containedPrimary:has-text("SAVE")');
    this.deleteButton = page.locator('.ra-delete-button:has-text("DELETE")');
    this.bulkDeleteButton = page.getByRole('button', { name: 'Delete' });
    
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
    
    this.selectAllCheckbox = page.locator('thead input[type="checkbox"]');
    
    this.elementCreatedMessage = page.getByText('Element created');
    this.elementDeletedMessage = page.getByText('Element deleted');
    this.noUsersMessage = page.getByText('No Users yet');
    this.itemsSelectedMessage = page.getByText(/items selected/);
    this.invalidEmailMessage = page.getByText('Incorrect email format');
    
    this.emailHeader = page.getByText('Email');
    this.firstNameHeader = page.getByText('First name');
    this.lastNameHeader = page.getByText('Last name');
    
    this.usersList = page.locator('.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.MuiCard-root.RaList-content');
    this.userRows = page.locator('tbody tr');
  }

  async navigate() {
    await this.usersLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickUserById(id) {
    const userRow = this.page.locator(`td:has-text("${id}")`).first();
    await userRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async createUser(email, firstName, lastName) {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.emailInput.fill(email);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.assertElementCreated();
    await this.navigate();
  }

  async editUser(email, newEmail, newFirstName, newLastName) {
    const userRow = this.page.locator(`td:has-text("${email}")`).first();
    await userRow.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.emailInput.clear();
    await this.emailInput.fill(newEmail);
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(newFirstName);
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(newLastName);
    
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteUser(id) {
    await this.clickUserById(id);
    await this.page.waitForLoadState('networkidle');
    
    await this.deleteButton.click();
    
    // Ждём, пока страница Users загрузится
    await this.page.waitForURL(/.*\/#\/users/);
    await this.page.waitForLoadState('networkidle');
  }

  async bulkDeleteUsers() {
    await this.selectAllCheckbox.check();
    await this.page.waitForLoadState('networkidle');
    
    await this.bulkDeleteButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillInvalidEmail(email) {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.emailInput.fill(email);
    await this.firstNameInput.fill('Test');
    await this.lastNameInput.fill('User');
    
    await this.saveButton.click();
  }

  async assertUserExists(email) {
    await expect(this.page.locator(`td:has-text("${email}")`).first()).toBeVisible();
  }

  async assertUserNotExists(email) {
    await expect(this.page.locator(`td:has-text("${email}")`).first()).not.toBeVisible();
  }

  async assertUserNotExistsById(id) {
    await expect(this.page.locator(`td:has-text("${id}")`).first()).not.toBeVisible();
  }

  async assertUserData(email, firstName, lastName) {
    const row = this.page.locator(`tr:has-text("${email}")`);
    await expect(row.locator(`td:has-text("${firstName}")`).first()).toBeVisible();
    await expect(row.locator(`td:has-text("${lastName}")`).first()).toBeVisible();
  }

  async assertUsersListVisible() {
    await expect(this.usersList).toBeVisible();
  }

  async assertHeadersVisible() {
    await expect(this.emailHeader).toBeVisible();
    await expect(this.firstNameHeader).toBeVisible();
    await expect(this.lastNameHeader).toBeVisible();
  }

  async assertElementCreated() {
    await expect(this.elementCreatedMessage).toBeVisible({ timeout: 10000 });
  }

  async assertElementDeleted() {
    await expect(this.elementDeletedMessage).toBeVisible();
  }

  async assertNoUsers() {
    await expect(this.noUsersMessage).toBeVisible();
  }

  async assertItemsSelected() {
    await expect(this.itemsSelectedMessage).toBeVisible();
  }

  async assertInvalidEmailError() {
    await expect(this.invalidEmailMessage).toBeVisible();
  }

  async getUserRowsCount() {
    return await this.userRows.count();
  }

  async assertUserRowsCount(expectedCount) {
    await expect(this.userRows).toHaveCount(expectedCount);
  }
}