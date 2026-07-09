import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { LabelsPage } from './pages/LabelsPage.js';

test.describe('Управление метками', () => {
  let loginPage;
  let labelsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    labelsPage = new LabelsPage(page);
    
    await loginPage.navigate();
    await loginPage.login('admin', 'admin');
    await loginPage.assertLoginSuccess();
    
    await labelsPage.navigate();
  });

  test('должен отображаться список меток', async () => {
    await labelsPage.assertLabelsListVisible();
    await labelsPage.assertHeadersVisible();
  });

  test('должен создавать новую метку', async () => {
    const name = `test-label-${Date.now()}`;
    
    await labelsPage.createLabel(name);
  });

  test('должен редактировать метку', async () => {
    const newName = `edited-label-${Date.now()}`;
    
    await labelsPage.editLabel('1', newName);
    await labelsPage.assertLabelExists(newName);
  });

  test('должен удалять метку', async () => {
    const initialCount = await labelsPage.getLabelRowsCount();
    
    await labelsPage.deleteLabel('1');
    await labelsPage.assertElementDeleted();
    
    await labelsPage.assertLabelRowsCount(initialCount - 1);
  });

  test('должен массово удалять метки', async () => {
    await labelsPage.bulkDeleteLabels();
    await labelsPage.assertNoLabels();
  });
});
