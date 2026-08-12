import { expect } from '@playwright/test';
import { BaseCrudPage } from './BaseCrudPage.js';

export class LabelsPage extends BaseCrudPage {
  constructor(page) {
    super(page, 'labels', 'No Labels yet');
    
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    
    this.nameHeader = page.getByText('Name');
    this.createdAtHeader = page.getByText('Created at');
  }

  // Действие: только создание метки
  async createLabel(name) {
    await this.createButton.click();
    await this.page.waitForSelector('h6:has-text("Create Label")');
    
    await this.nameInput.fill(name);
    
    await this.saveButton.click();
    await this.navigate();
  }

  async editLabel(id, newName) {
    await this.clickItemById(id);
    
    await this.nameInput.clear();
    await this.nameInput.fill(newName);
    
    await this.saveButton.click();
    await this.assertElementUpdated();
  }

  async deleteLabel(id) {
    await this.clickItemById(id);
    await this.deleteButton.click();
    await this.assertElementDeleted();
  }

  async bulkDeleteLabels() {
    await this.selectAllCheckbox.check();
    await this.bulkDeleteButton.click();
    await this.assertNoItems();
  }

  async assertLabelExists(name) {
    await expect(this.page.locator('tr', {
      has: this.page.locator(`.column-name:has-text("${name}")`),
    }).first()).toBeVisible();
  }

  async assertLabelNotExists(name) {
    await expect(this.page.locator('tr', {
      has: this.page.locator(`.column-name:has-text("${name}")`),
    }).first()).not.toBeVisible();
  }

  async assertHeadersVisible() {
    await expect(this.nameHeader).toBeVisible();
    await expect(this.createdAtHeader).toBeVisible();
  }
}
