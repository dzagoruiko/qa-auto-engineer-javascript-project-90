import { test } from './fixtures.js';
import { UsersPage } from './pages/UsersPage.js';

test.describe('Управление пользователями', () => {
  let usersPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    usersPage = new UsersPage(authenticatedPage);
    await usersPage.navigate();
  });

  test('должен отображаться список пользователей', async () => {
    await usersPage.assertListVisible();
    await usersPage.assertHeadersVisible();
  });

  test('должен создавать нового пользователя', async () => {
    const email = `ivanov${Date.now()}@mail.ru`;
    const firstName = 'Ivan';
    const lastName = 'Ivanov';
    
    // Действие
    await usersPage.createUser(email, firstName, lastName);
    
    // Проверки
    await usersPage.assertElementCreated();
    await usersPage.assertUserExists(email);
  });

  test('должен редактировать пользователя', async () => {
    const email = `edit${Date.now()}@mail.ru`;
    const firstName = 'Edit';
    const lastName = 'User';
    
    await usersPage.createUser(email, firstName, lastName);
    await usersPage.assertUserExists(email);
    
    const row = usersPage.page.locator(`tr:has-text("${email}")`);
    const idCell = row.locator('td.column-id');
    const id = await idCell.textContent();
    
    const newEmail = `edited${Date.now()}@mail.ru`;
    const newFirstName = 'Edited';
    const newLastName = 'User2';
    
    await usersPage.editUser(id.trim(), newEmail, newFirstName, newLastName);
    
    await usersPage.assertElementUpdated();
    await usersPage.assertUserExists(newEmail);
    await usersPage.assertUserData(newEmail, newFirstName, newLastName);
  });

  test('должен показывать ошибку при невалидном email', async () => {
    await usersPage.fillInvalidEmail('6666666');
    await usersPage.assertInvalidEmailError();
  });

  test('должен удалять пользователя', async () => {
    const email = `delete${Date.now()}@mail.ru`;
    const firstName = 'Delete';
    const lastName = 'User';
    
    await usersPage.createUser(email, firstName, lastName);
    await usersPage.assertUserExists(email);
    
    const row = usersPage.page.locator(`tr:has-text("${email}")`);
    const idCell = row.locator('td.column-id');
    const id = await idCell.textContent();
    
    await usersPage.deleteUser(id.trim());
    
    await usersPage.assertElementDeleted();
    await usersPage.assertUserNotExists(email);
  });
});
