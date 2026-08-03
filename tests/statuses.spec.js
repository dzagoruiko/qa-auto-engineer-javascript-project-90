import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { StatusesPage } from './pages/StatusesPage.js';

test.describe('Управление статусами', () => {
  let loginPage;
  let statusesPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    statusesPage = new StatusesPage(page);
    
    await loginPage.navigate();
    await loginPage.login('admin', 'admin');
    await loginPage.assertLoginSuccess();
    
    await statusesPage.navigate();
  });

  test('должен отображаться список статусов', async () => {
    await statusesPage.assertStatusesListVisible();
    await statusesPage.assertHeadersVisible();
  });

  test('должен создавать новый статус', async () => {
    const name = `Test Status ${Date.now()}`;
    const slug = `test-status-${Date.now()}`;
    
    await statusesPage.createStatus(name, slug);
  });

  test('должен редактировать статус', async () => {
    const newName = `Edited Status ${Date.now()}`;
    const newSlug = `edited-status-${Date.now()}`;
    
    await statusesPage.editStatus('1', newName, newSlug);
    await statusesPage.assertStatusExists(newName);
    await statusesPage.assertStatusData(newName, newSlug);
  });

  test('должен показывать ошибку при пустом name', async () => {
    await statusesPage.fillInvalidName('');
    await statusesPage.assertRequiredError();
  });

  test('должен показывать ошибку при пустом slug', async () => {
    await statusesPage.fillInvalidSlug('');
    await statusesPage.assertRequiredError();
  });

  test('должен удалять статус', async () => {
    const initialCount = await statusesPage.getStatusRowsCount();
    
    await statusesPage.deleteStatus('1');
    await statusesPage.assertElementDeleted();
    
    await statusesPage.assertStatusRowsCount(initialCount - 1);
  });

  test('должен массово удалять статусы', async () => {
    await statusesPage.bulkDeleteStatuses();
    await statusesPage.assertNoStatuses();
  });
});
