import { expect } from '@playwright/test';
import { BaseCrudPage } from './BaseCrudPage.js';

export class StatusesPage extends BaseCrudPage {
  constructor(page) {
    super(page, 'task_statuses', 'No Task statuses yet');
    
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.slugInput = page.getByRole('textbox', { name: 'Slug' });
    
    this.nameHeader = page.getByText('Name');
    this.slugHeader = page.getByText('Slug');
    this.createdAtHeader = page.getByText('Created at');
  }

  // Действие: только создание статуса
  async createStatus(name, slug) {
    await this.createButton.click();
    await this.page.waitForSelector('h6:has-text("Create Task status")');
    
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
    
    await this.saveButton.click();
    await this.navigate();
  }

  async editStatus(id, newName, newSlug) {
    await this.clickItemById(id);
    
    await this.nameInput.clear();
    await this.nameInput.fill(newName);
    await this.slugInput.clear();
    await this.slugInput.fill(newSlug);
    
    await this.saveButton.click();
    await this.assertElementUpdated();
  }

  async deleteStatus(id) {
    await this.clickItemById(id);
    await this.deleteButton.click();
    await this.assertElementDeleted();
  }

  async bulkDeleteStatuses() {
    await this.selectAllCheckbox.check();
    await this.bulkDeleteButton.click();
    await this.assertNoItems();
  }

  async assertStatusExists(name) {
    await expect(this.page.locator('tr', {
      has: this.page.locator(`.column-name:has-text("${name}")`),
    }).first()).toBeVisible();
  }

  async assertStatusNotExists(name) {
    await expect(this.page.locator('tr', {
      has: this.page.locator(`.column-name:has-text("${name}")`),
    }).first()).not.toBeVisible();
  }

  async assertStatusData(name, slug) {
    const row = this.page.locator('tr', {
      has: this.page.locator(`.column-name:has-text("${name}")`),
    });
    await expect(row.locator(`.column-slug:has-text("${slug}")`)).toBeVisible();
  }

  async assertHeadersVisible() {
    await expect(this.nameHeader).toBeVisible();
    await expect(this.slugHeader).toBeVisible();
    await expect(this.createdAtHeader).toBeVisible();
  }
}
