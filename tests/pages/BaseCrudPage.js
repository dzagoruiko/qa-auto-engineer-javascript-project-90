import { expect } from '@playwright/test';

export class BaseCrudPage {
  constructor(page, resourcePath, noItemsText) {
    this.page = page;
    this.resourcePath = resourcePath;
    
    // Общие локаторы
    this.createButton = page.locator(`a[href="#/${resourcePath}/create"]`);
    this.saveButton = page.getByRole('button', { name: 'SAVE' });
    this.deleteButton = page.getByRole('button', { name: 'DELETE' });
    this.bulkDeleteButton = page.getByRole('button', { name: 'Delete' });
    this.selectAllCheckbox = page.locator('thead input[type="checkbox"]');
    
    // Общие сообщения
    this.elementCreatedMessage = page.getByText('Element created');
    this.elementUpdatedMessage = page.getByText('Element updated');
    this.elementDeletedMessage = page.getByText('Element deleted');
    // Используем переданный текст или формируем по умолчанию
    this.noItemsMessage = page.getByText(noItemsText || `No ${resourcePath} yet`);
    
    // Общие элементы
    this.list = page.locator('.RaList-content');
    this.rows = page.locator('tbody tr');
  }

  async navigate() {
    await this.page.locator(`a[href="#/${this.resourcePath}"]`).click();
    await this.page.waitForSelector('.RaList-content');
  }

  async clickItemById(id) {
    const row = this.page.locator('tr', {
      has: this.page.locator(`.column-id:has-text("${id}")`),
    });
    await row.click();
    await expect(this.saveButton).toBeVisible();
  }

  async assertElementCreated() {
    await expect(this.elementCreatedMessage).toBeVisible({ timeout: 10000 });
  }

  async assertElementUpdated() {
    await expect(this.elementUpdatedMessage).toBeVisible({ timeout: 10000 });
  }

  async assertElementDeleted() {
    await expect(this.elementDeletedMessage).toBeVisible({ timeout: 10000 });
  }

  async assertNoItems() {
    await expect(this.noItemsMessage).toBeVisible();
  }

  async assertListVisible() {
    await expect(this.list).toBeVisible();
  }

  async getRowsCount() {
    return await this.rows.count();
  }

  async assertRowsCount(expectedCount) {
    await expect(this.rows).toHaveCount(expectedCount);
  }
}
