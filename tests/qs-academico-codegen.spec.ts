import { test, expect } from '@playwright/test';

test('fluxo gravado no codegen - ajustar se necessário', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Nome do Aluno').fill('Ana Silva');
  await page.getByLabel('Nota 1').fill('8');
  await page.getByLabel('Nota 2').fill('7');
  await page.getByLabel('Nota 3').fill('9');
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await page.getByLabel('Nome do Aluno').fill('Carlos Lima');
  await page.getByLabel('Nota 1').fill('5');
  await page.getByLabel('Nota 2').fill('4');
  await page.getByLabel('Nota 3').fill('6');
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await page.getByLabel('Buscar por nome').fill('Ana');
  await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
  await expect(page.locator('#tabela-alunos tbody tr').first()).toContainText('Ana Silva');

  await page.getByLabel('Buscar por nome').fill('');
  await page.locator('#tabela-alunos tbody tr').nth(1).locator('button').click();

  await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
  await expect(page.locator('#tabela-alunos tbody tr').first()).toContainText('Ana Silva');
});
