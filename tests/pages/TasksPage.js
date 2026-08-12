import { expect } from '@playwright/test';

export class TasksPage {
  constructor(page) {
    this.page = page;
    
    this.tasksLink = page.locator('a[href="#/tasks"]');
    
    this.createButton = page.locator('a[href="#/tasks/create"]');
    this.saveButton = page.locator('.MuiButtonBase-root.MuiButton-containedPrimary:has-text("SAVE")');
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    
    this.assigneeInput = page.getByRole('combobox', { name: 'Assignee' });
    this.titleInput = page.getByRole('textbox', { name: 'Title' });
    this.contentInput = page.getByRole('textbox', { name: 'Content' });
    this.statusInput = page.getByRole('combobox', { name: 'Status' });
    this.labelInput = page.getByRole('combobox', { name: 'Label' });
    
    this.elementCreatedMessage = page.getByText('Element created');
    this.elementDeletedMessage = page.getByText('Element deleted');
    
    this.taskCards = page.locator('.MuiCard-root');
  }

  async navigate() {
    await this.tasksLink.click();
    await this.page.waitForSelector('.MuiCard-root');
  }

  async createTask(title, content, assignee, status, label) {
    await this.createButton.click();
    await this.page.waitForSelector('h6:has-text("Create Task")');
    
    await this.titleInput.fill(title);
    await this.contentInput.fill(content);
    
    await this.assigneeInput.click();
    await this.page.locator(`.MuiMenuItem-root:has-text("${assignee}")`).click();
    
    await this.statusInput.click();
    await this.page.locator(`.MuiMenuItem-root:has-text("${status}")`).click();
    
    await this.labelInput.click();
    await this.page.locator(`.MuiMenuItem-root:has-text("${label}")`).click();
    
    await this.page.locator('body').click();
    
    await this.saveButton.click();
    await this.assertElementCreated();
    await this.navigate();
  }

  async deleteTaskByTitle(title) {
    const taskCard = this.page.locator('.MuiCard-root', {
      has: this.page.locator(`.MuiTypography-h5:has-text("${title}")`),
    }).first();
    await taskCard.locator('.RaEditButton-root').click();
    await this.page.waitForSelector('h6:has-text("Task")');
    
    // Ждём 2 секунды перед нажатием DELETE
    await this.page.waitForTimeout(2000);
    
    await this.deleteButton.click();
    await this.assertElementDeleted();
    await this.page.waitForURL(/.*\/#\/tasks/);
    await this.page.waitForTimeout(2000);
    await this.page.waitForSelector('.MuiCard-root');
  }

  async dragTaskToColumn(title, columnName) {
    const taskCard = this.page.locator('.MuiCard-root', {
      has: this.page.locator(`.MuiTypography-h5:has-text("${title}")`),
    }).first();
    const column = this.page.locator(`h6:has-text("${columnName}")`).first();
    
    const cardBox = await taskCard.boundingBox();
    const columnBox = await column.boundingBox();
    
    if (!cardBox || !columnBox) {
      throw new Error('Card or column not found');
    }
    
    const cardX = cardBox.x + cardBox.width / 2;
    const cardY = cardBox.y + cardBox.height / 2;
    const targetX = columnBox.x + columnBox.width / 2;
    const targetY = columnBox.y + columnBox.height / 2;
    
    await this.page.mouse.move(cardX, cardY);
    await this.page.mouse.down();
    await this.page.mouse.move(targetX, targetY, { steps: 10 });
    await this.page.mouse.up();
    
    await this.assertTaskInColumn(title, columnName);
  }

  async filterByStatus(status) {
    const statusField = this.page.locator('.filter-field[data-source="status_id"]');
    await statusField.click();
    
    await this.page.locator(`.MuiMenuItem-root:has-text("${status}")`).click();
    
    await this.page.waitForTimeout(2000);
  }

  async getVisibleTasks() {
    return this.page.locator('.MuiCard-root');
  }

  async assertTaskExists(title) {
    await expect(this.page.getByText(title).first()).toBeVisible();
  }

  async assertTaskNotExists(title) {
    await expect(this.page.getByText(title).first()).not.toBeVisible();
  }

  async assertTaskInColumn(taskTitle, columnName) {
    const column = this.page.locator(`h6:has-text("${columnName}")`).locator('..');
    await expect(column.getByText(taskTitle).first()).toBeVisible();
  }

  async assertElementCreated() {
    await expect(this.elementCreatedMessage).toBeVisible({ timeout: 10000 });
  }

  async assertElementDeleted() {
    await expect(this.elementDeletedMessage).toBeVisible();
  }

  async assertTasksBoardVisible() {
    await expect(this.taskCards.first()).toBeVisible();
  }
}
