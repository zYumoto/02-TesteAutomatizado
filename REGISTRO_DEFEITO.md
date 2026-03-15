# Registro de Defeito

**Sistema:** QS Acadêmico — Sistema de Gestão de Notas  
**Arquivo afetado:** `docs/js/app.js`  
**Função:** `calcularMedia(nota1, nota2, nota3)`

## Descrição
A média do aluno era calculada usando apenas duas notas, ignorando a terceira.

## Comportamento incorreto
```js
return (nota1 + nota2) / 2;
```

## Comportamento correto
```js
return (nota1 + nota2 + nota3) / 3;
```

## Impacto
- médias incorretas
- situação do aluno incorreta
- estatísticas inconsistentes
- falha em testes E2E relacionados a cadastro, média e situação
