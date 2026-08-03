import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { TasksPage } from './pages/TasksPage.js';

test.describe('Управление задачами', () => {
  let loginPage;
  let tasksPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    tasksPage = new TasksPage(page);
    
    await loginPage.navigate();
    await loginPage.login('admin', 'admin');
    await loginPage.assertLoginSuccess();
    
    await tasksPage.navigate();
  });

  test('должна отображаться доска задач', async () => {
    await tasksPage.assertTasksBoardVisible();
  });

  test('должен создавать новую задачу', async () => {
    const title = `Test Task ${Date.now()}`;
    const content = 'Test description';
    const assignee = 'john@google.com';
    const status = 'Draft';
    const label = 'critical';
    
    await tasksPage.createTask(title, content, assignee, status, label);
    await tasksPage.assertTaskExists(title);
  });

  test('должен удалять задачу', async () => {
    const title = 'Task 11';
    
    await tasksPage.deleteTaskByTitle(title);
    await tasksPage.assertElementDeleted();
    await tasksPage.assertTaskNotExists(title);
  });

  test('должен перемещать задачу между колонками', async () => {
    const title = 'Task 11';
    
    await tasksPage.dragTaskToColumn(title, 'To Review');
    await tasksPage.assertTaskExists(title);
  });

  test('должен фильтровать задачи по статусу', async ({ page }) => {
    const status = 'Draft';
    
    await tasksPage.filterByStatus(status);
    
    const visibleTasks = await tasksPage.getVisibleTasks();
    await expect(visibleTasks.first()).toBeVisible();
    
    // Задержка 5 секунд, чтобы увидеть результат фильтрации
    await page.waitForTimeout(5000);
  });
});
