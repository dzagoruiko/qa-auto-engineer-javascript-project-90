import { test, expect } from './fixtures.js';
import { TasksPage } from './pages/TasksPage.js';

test.describe('Управление задачами', () => {
  let tasksPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    tasksPage = new TasksPage(authenticatedPage);
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
    
    // Проверяем, что задача появилась на доске
    await tasksPage.assertTaskExists(title);
  });

  test('должен удалять задачу', async () => {
    const title = `Delete Task ${Date.now()}`;
    const content = 'Delete description';
    const assignee = 'john@google.com';
    const status = 'Draft';
    const label = 'critical';
    
    await tasksPage.createTask(title, content, assignee, status, label);
    await tasksPage.assertTaskExists(title);
    
    await tasksPage.deleteTaskByTitle(title);
    await tasksPage.assertElementDeleted();
    await tasksPage.assertTaskNotExists(title);
  });

  test('должен перемещать задачу между колонками', async () => {
    const title = `Move Task ${Date.now()}`;
    const content = 'Move description';
    const assignee = 'john@google.com';
    const status = 'Draft';
    const label = 'critical';
    
    await tasksPage.createTask(title, content, assignee, status, label);
    await tasksPage.assertTaskExists(title);
    
    await tasksPage.dragTaskToColumn(title, 'To Review');
    await tasksPage.assertTaskInColumn(title, 'To Review');
  });

  test('должен фильтровать задачи по статусу', async ({ authenticatedPage }) => {
    const status = 'Draft';
    
    const initialCount = await authenticatedPage.locator('.MuiCard-root').count();
    
    await tasksPage.filterByStatus(status);
    
    const filteredCount = await authenticatedPage.locator('.MuiCard-root').count();
    expect(filteredCount).toBeLessThan(initialCount);
  });
});
