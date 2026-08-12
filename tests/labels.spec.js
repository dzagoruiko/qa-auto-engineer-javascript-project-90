import { test } from './fixtures.js';
import { LabelsPage } from './pages/LabelsPage.js';

test.describe('Управление метками', () => {
  let labelsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    labelsPage = new LabelsPage(authenticatedPage);
    await labelsPage.navigate();
  });

  test('должен отображаться список меток', async () => {
    await labelsPage.assertListVisible();
    await labelsPage.assertHeadersVisible();
  });

  test('должен создавать новую метку', async () => {
    const name = `test-label-${Date.now()}`;
    
    // Действие
    await labelsPage.createLabel(name);
    
    // Проверки
    await labelsPage.assertElementCreated();
    await labelsPage.assertLabelExists(name);
  });

  test('должен редактировать метку', async () => {
    const name = `edit-label-${Date.now()}`;
    
    await labelsPage.createLabel(name);
    await labelsPage.assertLabelExists(name);
    
    const row = labelsPage.page.locator(`tr:has-text("${name}")`);
    const idCell = row.locator('td.column-id');
    const id = await idCell.textContent();
    
    const newName = `edited-label-${Date.now()}`;
    
    await labelsPage.editLabel(id.trim(), newName);
    
    await labelsPage.assertElementUpdated();
    await labelsPage.assertLabelExists(newName);
  });

  test('должен удалять метку', async () => {
    const name = `delete-label-${Date.now()}`;
    
    await labelsPage.createLabel(name);
    await labelsPage.assertLabelExists(name);
    
    const row = labelsPage.page.locator(`tr:has-text("${name}")`);
    const idCell = row.locator('td.column-id');
    const id = await idCell.textContent();
    
    await labelsPage.deleteLabel(id.trim());
    
    await labelsPage.assertElementDeleted();
    await labelsPage.assertLabelNotExists(name);
  });

  test('должен массово удалять метки', async () => {
    await labelsPage.bulkDeleteLabels();
    await labelsPage.assertNoItems();
  });
});
