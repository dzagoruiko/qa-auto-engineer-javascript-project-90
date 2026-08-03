import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { UsersPage } from './pages/UsersPage.js';

test.describe('Управление пользователями', () => {
  let loginPage;
  let usersPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    usersPage = new UsersPage(page);
    
    await loginPage.navigate();
    await loginPage.login('admin', 'admin');
    await loginPage.assertLoginSuccess();
    
    await usersPage.navigate();
  });

  test('должен отображаться список пользователей', async () => {
    await usersPage.assertUsersListVisible();
    await usersPage.assertHeadersVisible();
  });

  test('должен создавать нового пользователя', async () => {
    const email = `ivanov${Date.now()}@mail.ru`;
    const firstName = 'Ivan';
    const lastName = 'Ivanov';
    
    await usersPage.createUser(email, firstName, lastName);
  });

  test('должен редактировать пользователя', async () => {
    const oldEmail = 'john@google.com';
    const newEmail = `test${Date.now()}@mail.ru`;
    const newFirstName = 'Test';
    const newLastName = 'Testovich';
    
    await usersPage.editUser(oldEmail, newEmail, newFirstName, newLastName);
    await usersPage.assertUserExists(newEmail);
    await usersPage.assertUserData(newEmail, newFirstName, newLastName);
  });

  test('должен показывать ошибку при невалидном email', async () => {
    await usersPage.fillInvalidEmail('6666666');
    await usersPage.assertInvalidEmailError();
  });

  test('должен удалять пользователя', async () => {
    const initialCount = await usersPage.getUserRowsCount();
    
    await usersPage.deleteUser('1');
    await usersPage.assertElementDeleted();
    
    await usersPage.assertUserRowsCount(initialCount - 1);
  });

  test('должен массово удалять пользователей', async () => {
    await usersPage.bulkDeleteUsers();
    await usersPage.assertNoUsers();
  });
});
