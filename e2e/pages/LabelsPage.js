import { expect } from '@playwright/test';

export class LabelsPage {
  constructor(page) {
    this.page = page;
    
    // Навигация - кнопка Labels
    this.labelsLink = page.locator('a[href="#/labels"]');
    
    // Кнопки
    this.createButton = page.locator('a[href="#/labels/create"]');
    this.saveButton = page.locator('.MuiButtonBase-root.MuiButton-containedPrimary:has-text("SAVE")');
    this.deleteButton = page.locator('.ra-delete-button:has-text("DELETE")');
    this.bulkDeleteButton = page.getByRole('button', { name: 'Delete' });
    
    // Поля формы
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    
    // Чекбокс для массового выделения
    this.selectAllCheckbox = page.locator('thead input[type="checkbox"]');
    
    // Сообщения
    this.elementCreatedMessage = page.getByText('Element created');
    this.elementDeletedMessage = page.getByText('Element deleted');
    this.noLabelsMessage = page.getByText('No Labels yet');
    this.itemsSelectedMessage = page.getByText(/items selected/);
    this.requiredMessage = page.getByText('Required');
    
    // Заголовки таблицы
    this.nameHeader = page.getByText('Name');
    this.createdAtHeader = page.getByText('Created at');
    
    // Список меток
    this.labelsList = page.locator('.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.MuiCard-root.RaList-content');
    this.labelRows = page.locator('tbody tr');
  }

  async navigate() {
    await this.labelsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickLabelById(id) {
    const labelRow = this.page.locator(`td:has-text("${id}")`).first();
    await labelRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async createLabel(name) {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.nameInput.fill(name);
    
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.assertElementCreated();
    await this.navigate();
  }

  async editLabel(id, newName) {
    await this.clickLabelById(id);
    await this.page.waitForLoadState('networkidle');
    
    await this.nameInput.clear();
    await this.nameInput.fill(newName);
    
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteLabel(id) {
    await this.clickLabelById(id);
    await this.page.waitForLoadState('networkidle');
    
    await this.deleteButton.click();
    
    await this.page.waitForURL(/.*\/#\/labels/);
    await this.page.waitForLoadState('networkidle');
  }

  async bulkDeleteLabels() {
    await this.selectAllCheckbox.check();
    await this.page.waitForLoadState('networkidle');
    
    await this.bulkDeleteButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillInvalidName(name) {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.nameInput.fill(name);
    
    // Проверяем, что кнопка SAVE осталась disabled
    await expect(this.saveButton).toBeDisabled();
    // И проверяем, что появилось сообщение Required
    await this.assertRequiredError();
  }

  async assertLabelExists(name) {
    await expect(this.page.locator(`td:has-text("${name}")`).first()).toBeVisible();
  }

  async assertLabelNotExists(name) {
    await expect(this.page.locator(`td:has-text("${name}")`).first()).not.toBeVisible();
  }

  async assertLabelsListVisible() {
    await expect(this.labelsList).toBeVisible();
  }

  async assertHeadersVisible() {
    await expect(this.nameHeader).toBeVisible();
    await expect(this.createdAtHeader).toBeVisible();
  }

  async assertElementCreated() {
    await expect(this.elementCreatedMessage).toBeVisible({ timeout: 10000 });
  }

  async assertElementDeleted() {
    await expect(this.elementDeletedMessage).toBeVisible();
  }

  async assertNoLabels() {
    await expect(this.noLabelsMessage).toBeVisible();
  }

  async assertItemsSelected() {
    await expect(this.itemsSelectedMessage).toBeVisible();
  }

  async assertRequiredError() {
    await expect(this.requiredMessage).toBeVisible();
  }

  async getLabelRowsCount() {
    return await this.labelRows.count();
  }

  async assertLabelRowsCount(expectedCount) {
    await expect(this.labelRows).toHaveCount(expectedCount);
  }
}
