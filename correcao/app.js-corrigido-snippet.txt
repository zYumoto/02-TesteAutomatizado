// ============================================
// QS Acadêmico — Sistema de Gestão de Notas
// ============================================
// Este sistema foi desenvolvido para fins didáticos.
// Ele contém pelo menos um defeito intencional de
// implementação que deve ser descoberto por meio
// de testes automatizados.
// ============================================

let alunos = [];
let proximoId = 1;

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function normalizarClasse(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function calcularMedia(nota1, nota2, nota3) {
  return (nota1 + nota2 + nota3) / 3;
}

function determinarSituacao(media) {
    if (media >= 7) return 'Aprovado';
    if (media >= 5) return 'Recuperação';
    return 'Reprovado';
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastro');
    const campoBusca = document.getElementById('busca');
    const btnLimpar = document.getElementById('btn-limpar');

    form.addEventListener('submit', cadastrarAluno);
    campoBusca.addEventListener('input', (e) => atualizarTabela(e.target.value));
    btnLimpar.addEventListener('click', limparTudo);

    atualizarTabela();
    atualizarEstatisticas();
});

function cadastrarAluno(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const nota1 = parseFloat(document.getElementById('nota1').value);
    const nota2 = parseFloat(document.getElementById('nota2').value);
    const nota3 = parseFloat(document.getElementById('nota3').value);

    if (!nome) {
        exibirMensagem('Por favor, preencha o nome do aluno.', 'erro');
        return;
    }

    if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
        exibirMensagem('Por favor, preencha todas as notas corretamente.', 'erro');
        return;
    }

    if (nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10 || nota3 < 0 || nota3 > 10) {
        exibirMensagem('As notas devem estar entre 0 e 10.', 'erro');
        return;
    }

    const media = calcularMedia(nota1, nota2, nota3);
    const situacao = determinarSituacao(media);

    const aluno = {
        id: proximoId++,
        nome,
        nota1,
        nota2,
        nota3,
        media,
        situacao
    };

    alunos.push(aluno);
    atualizarTabela(document.getElementById('busca').value);
    atualizarEstatisticas();
    limparFormulario();
    exibirMensagem(`Aluno "${nome}" cadastrado com sucesso!`, 'sucesso');
}

function atualizarTabela(filtro = '') {
    const tbody = document.querySelector('#tabela-alunos tbody');
    tbody.innerHTML = '';

    const alunosFiltrados = filtro
        ? alunos.filter(a => a.nome.toLowerCase().includes(filtro.toLowerCase()))
        : alunos;

    if (alunosFiltrados.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" class="texto-central">Nenhum aluno cadastrado.</td>';
        tbody.appendChild(tr);
        return;
    }

    alunosFiltrados.forEach(aluno => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-testid', `aluno-${aluno.id}`);
        tr.innerHTML = `
            <td>${escapeHtml(aluno.nome)}</td>
            <td>${aluno.nota1.toFixed(1)}</td>
            <td>${aluno.nota2.toFixed(1)}</td>
            <td>${aluno.nota3.toFixed(1)}</td>
            <td>${aluno.media.toFixed(2)}</td>
            <td><span class="badge badge-${normalizarClasse(aluno.situacao)}">${aluno.situacao}</span></td>
            <td><button type="button" class="btn-excluir" onclick="excluirAluno(${aluno.id})" aria-label="Excluir ${escapeHtml(aluno.nome)}">&#10005;</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarEstatisticas() {
    const total = alunos.length;
    const aprovados = alunos.filter(a => a.situacao === 'Aprovado').length;
    const recuperacao = alunos.filter(a => a.situacao === 'Recuperação').length;
    const reprovados = alunos.filter(a => a.situacao === 'Reprovado').length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-aprovados').textContent = aprovados;
    document.getElementById('stat-recuperacao').textContent = recuperacao;
    document.getElementById('stat-reprovados').textContent = reprovados;
}

function excluirAluno(id) {
    alunos = alunos.filter(a => a.id !== id);
    atualizarTabela(document.getElementById('busca').value);
    atualizarEstatisticas();
    exibirMensagem('Aluno removido com sucesso.', 'sucesso');
}

function limparTudo() {
    if (alunos.length === 0) return;

    if (confirm('Tem certeza que deseja remover todos os alunos?')) {
        alunos = [];
        proximoId = 1;
        atualizarTabela();
        atualizarEstatisticas();
        exibirMensagem('Todos os registros foram removidos.', 'sucesso');
    }
}

function limparFormulario() {
    document.getElementById('form-cadastro').reset();
    document.getElementById('nome').focus();
}

function exibirMensagem(texto, tipo) {
    const div = document.getElementById('mensagem');
    div.textContent = texto;
    div.className = `mensagem ${tipo}`;
    div.hidden = false;

    setTimeout(() => {
        div.hidden = true;
    }, 4000);
}
