import { test } from './fixtures.js';
import { StatusesPage } from './pages/StatusesPage.js';

test.describe('Управление статусами', () => {
  let statusesPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    statusesPage = new StatusesPage(authenticatedPage);
    await statusesPage.navigate();
  });

  test('должен отображаться список статусов', async () => {
    await statusesPage.assertListVisible();
    await statusesPage.assertHeadersVisible();
  });

  test('должен создавать новый статус', async () => {
    const name = `Test Status ${Date.now()}`;
    const slug = `test-status-${Date.now()}`;
    
    // Действие
    await statusesPage.createStatus(name, slug);
    
    // Проверки
    await statusesPage.assertElementCreated();
    await statusesPage.assertStatusExists(name);
  });

  test('должен редактировать статус', async () => {
    const name = `Edit Status ${Date.now()}`;
    const slug = `edit-status-${Date.now()}`;
    
    await statusesPage.createStatus(name, slug);
    await statusesPage.assertStatusExists(name);
    
    const row = statusesPage.page.locator(`tr:has-text("${name}")`);
    const idCell = row.locator('td.column-id');
    const id = await idCell.textContent();
    
    const newName = `Edited Status ${Date.now()}`;
    const newSlug = `edited-status-${Date.now()}`;
    
    await statusesPage.editStatus(id.trim(), newName, newSlug);
    
    await statusesPage.assertElementUpdated();
    await statusesPage.assertStatusExists(newName);
    await statusesPage.assertStatusData(newName, newSlug);
  });

  test('должен удалять статус', async () => {
    const name = `Delete Status ${Date.now()}`;
    const slug = `delete-status-${Date.now()}`;
    
    await statusesPage.createStatus(name, slug);
    await statusesPage.assertStatusExists(name);
    
    const row = statusesPage.page.locator(`tr:has-text("${name}")`);
    const idCell = row.locator('td.column-id');
    const id = await idCell.textContent();
    
    await statusesPage.deleteStatus(id.trim());
    
    await statusesPage.assertElementDeleted();
    await statusesPage.assertStatusNotExists(name);
  });

  test('должен массово удалять статусы', async () => {
    await statusesPage.bulkDeleteStatuses();
    await statusesPage.assertNoItems();
  });
});
