import { expect } from '@playwright/test';

export class StatusesPage {
  constructor(page) {
    this.page = page;
    
    // Навигация - кнопка Task statuses
    this.statusesLink = page.locator('a[href="#/task_statuses"]');
    
    // Кнопки
    this.createButton = page.locator('a[href="#/task_statuses/create"]');
    this.saveButton = page.locator('.MuiButtonBase-root.MuiButton-containedPrimary:has-text("SAVE")');
    this.deleteButton = page.locator('.ra-delete-button:has-text("DELETE")');
    this.bulkDeleteButton = page.getByRole('button', { name: 'Delete' });
    
    // Поля формы
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.slugInput = page.getByRole('textbox', { name: 'Slug' });
    
    // Чекбокс для массового выделения
    this.selectAllCheckbox = page.locator('thead input[type="checkbox"]');
    
    // Сообщения
    this.elementCreatedMessage = page.getByText('Element created');
    this.elementDeletedMessage = page.getByText('Element deleted');
    this.noStatusesMessage = page.getByText('No Task statuses yet');
    this.itemsSelectedMessage = page.getByText(/items selected/);
    this.requiredMessage = page.getByText('Required');
    
    // Заголовки таблицы
    this.nameHeader = page.getByText('Name');
    this.slugHeader = page.getByText('Slug');
    this.createdAtHeader = page.getByText('Created at');
    
    // Список статусов
    this.statusesList = page.locator('.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.MuiCard-root.RaList-content');
    this.statusRows = page.locator('tbody tr');
  }

  async navigate() {
    await this.statusesLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickStatusById(id) {
    const statusRow = this.page.locator(`td:has-text("${id}")`).first();
    await statusRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async createStatus(name, slug) {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
    
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.assertElementCreated();
    await this.navigate();
  }

  async editStatus(id, newName, newSlug) {
    await this.clickStatusById(id);
    await this.page.waitForLoadState('networkidle');
    
    await this.nameInput.clear();
    await this.nameInput.fill(newName);
    await this.slugInput.clear();
    await this.slugInput.fill(newSlug);
    
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteStatus(id) {
    await this.clickStatusById(id);
    await this.page.waitForLoadState('networkidle');
    
    await this.deleteButton.click();
    
    await this.page.waitForURL(/.*\/#\/task_statuses/);
    await this.page.waitForLoadState('networkidle');
  }

  async bulkDeleteStatuses() {
    await this.selectAllCheckbox.check();
    await this.page.waitForLoadState('networkidle');
    
    await this.bulkDeleteButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillInvalidName(name) {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.nameInput.fill(name);
    await this.slugInput.fill('test-slug');
    
    await this.saveButton.click();
  }

  async fillInvalidSlug(slug) {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.nameInput.fill('Test Status');
    await this.slugInput.fill(slug);
    
    await this.saveButton.click();
  }

  async assertStatusExists(name) {
    await expect(this.page.locator(`td:has-text("${name}")`).first()).toBeVisible();
  }

  async assertStatusNotExists(name) {
    await expect(this.page.locator(`td:has-text("${name}")`).first()).not.toBeVisible();
  }

  async assertStatusData(name, slug) {
    const row = this.page.locator(`tr:has-text("${name}")`);
    await expect(row.locator(`td:has-text("${slug}")`).first()).toBeVisible();
  }

  async assertStatusesListVisible() {
    await expect(this.statusesList).toBeVisible();
  }

  async assertHeadersVisible() {
    await expect(this.nameHeader).toBeVisible();
    await expect(this.slugHeader).toBeVisible();
    await expect(this.createdAtHeader).toBeVisible();
  }

  async assertElementCreated() {
    await expect(this.elementCreatedMessage).toBeVisible({ timeout: 10000 });
  }

  async assertElementDeleted() {
    await expect(this.elementDeletedMessage).toBeVisible();
  }

  async assertNoStatuses() {
    await expect(this.noStatusesMessage).toBeVisible();
  }

  async assertItemsSelected() {
    await expect(this.itemsSelectedMessage).toBeVisible();
  }

  async assertRequiredError() {
    await expect(this.requiredMessage).toBeVisible();
  }

  async getStatusRowsCount() {
    return await this.statusRows.count();
  }

  async assertStatusRowsCount(expectedCount) {
    await expect(this.statusRows).toHaveCount(expectedCount);
  }
}
