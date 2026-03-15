import { test, expect, type Page } from '@playwright/test';

async function cadastrarAluno(page: Page, nome: string, nota1: string, nota2: string, nota3: string) {
  await page.getByLabel('Nome do Aluno').fill(nome);
  await page.getByLabel('Nota 1').fill(nota1);
  await page.getByLabel('Nota 2').fill(nota2);
  await page.getByLabel('Nota 3').fill(nota3);
  await page.getByRole('button', { name: 'Cadastrar' }).click();
}

test.describe('QS Acadêmico — Testes E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve cadastrar um aluno com dados válidos', async ({ page }) => {
    await cadastrarAluno(page, 'João Silva', '7', '8', '6');
    const linhas = page.locator('#tabela-alunos tbody tr');
    await expect(linhas).toHaveCount(1);
    await expect(linhas.first()).toContainText('João Silva');
  });

  test('deve exibir mensagem de sucesso após cadastro', async ({ page }) => {
    await cadastrarAluno(page, 'Ana Costa', '9', '8', '10');
    await expect(page.locator('#mensagem')).toContainText('cadastrado com sucesso');
  });

  test('não deve cadastrar aluno sem nome', async ({ page }) => {
    await page.getByLabel('Nota 1').fill('7');
    await page.getByLabel('Nota 2').fill('8');
    await page.getByLabel('Nota 3').fill('6');
    await page.getByRole('button', { name: 'Cadastrar' }).click();
    await expect(page.locator('#mensagem')).toContainText('preencha o nome');
    await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
  });

  test('deve cadastrar 3 alunos consecutivos', async ({ page }) => {
    await cadastrarAluno(page, 'Aluno 1', '8', '7', '9');
    await cadastrarAluno(page, 'Aluno 2', '5', '5', '6');
    await cadastrarAluno(page, 'Aluno 3', '2', '3', '4');
    await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);
  });

  test('deve calcular a média aritmética das três notas', async ({ page }) => {
    await cadastrarAluno(page, 'Pedro Santos', '8', '6', '10');
    const celulaMedia = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(4);
    await expect(celulaMedia).toHaveText('8.00');
  });

  test('deve exibir situação Aprovado', async ({ page }) => {
    await cadastrarAluno(page, 'Maria Souza', '8', '7', '9');
    await expect(page.locator('#tabela-alunos tbody tr').first()).toContainText('Aprovado');
  });

  test('deve exibir situação Reprovado', async ({ page }) => {
    await cadastrarAluno(page, 'Carlos Lima', '2', '4', '3');
    await expect(page.locator('#tabela-alunos tbody tr').first()).toContainText('Reprovado');
  });

  test('deve exibir situação Recuperação', async ({ page }) => {
    await cadastrarAluno(page, 'Paula Reis', '5', '6', '6');
    await expect(page.locator('#tabela-alunos tbody tr').first()).toContainText('Recuperação');
  });

test('deve rejeitar nota fora do intervalo 0 a 10', async ({ page }) => {
  await page.getByLabel('Nome do Aluno').fill('Aluno Teste');

  await page.getByLabel('Nota 1').fill('11');
  await page.getByLabel('Nota 2').fill('5');
  await page.getByLabel('Nota 3').fill('5');

  await page.locator('#form-cadastro').evaluate((form: HTMLFormElement) => {
    form.noValidate = true;
  });

  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await expect(page.locator('#mensagem')).toContainText('As notas devem estar entre 0 e 10.');
});

  test('deve filtrar por nome', async ({ page }) => {
    await cadastrarAluno(page, 'Ana Silva', '8', '7', '9');
    await cadastrarAluno(page, 'Bruno Costa', '5', '4', '6');
    await page.getByLabel('Buscar por nome').fill('Ana');
    const linhas = page.locator('#tabela-alunos tbody tr');
    await expect(linhas).toHaveCount(1);
    await expect(linhas.first()).toContainText('Ana Silva');
  });

  test('deve excluir um aluno', async ({ page }) => {
    await cadastrarAluno(page, 'Aluno Excluir', '8', '7', '9');
    await page.locator('#tabela-alunos tbody tr button').first().click();
    await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
  });

  test('deve limpar todos os alunos', async ({ page }) => {
    await cadastrarAluno(page, 'Aluno 1', '8', '7', '9');
    await cadastrarAluno(page, 'Aluno 2', '5', '6', '7');
    page.once('dialog', async dialog => dialog.accept());
    await page.getByRole('button', { name: 'Limpar Tudo' }).click();
    await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    await expect(page.locator('#stat-total')).toHaveText('0');
  });

  test('deve mostrar totais corretos nos cards', async ({ page }) => {
    await cadastrarAluno(page, 'Aluno Aprovado', '8', '8', '8');
    await cadastrarAluno(page, 'Aluno Recuperacao', '5', '6', '6');
    await cadastrarAluno(page, 'Aluno Reprovado', '2', '3', '4');
    await expect(page.locator('#stat-total')).toHaveText('3');
    await expect(page.locator('#stat-aprovados')).toHaveText('1');
    await expect(page.locator('#stat-recuperacao')).toHaveText('1');
    await expect(page.locator('#stat-reprovados')).toHaveText('1');
  });
});
