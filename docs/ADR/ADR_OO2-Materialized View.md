# ADR 001: Escolha do Banco de Dados Relacional

## Contexto

Precisamos armazenar grandes volumes de dados prontos para serem consumidos como estatística, podendo reprocessar, criar visões rápidas e olhando sempre aos dados de origem com alta escalabilidade.

## Decisão

Optamos pelo PostgreSQL devido à sua flexibilidade, capacidade de escalar verticalmente (dado o contexto analítico) e suportar VIEWS MATERIALIZADAS.

## Alternativas Consideradas

- MySQL: Exige também esquemas rígidos, tornando a iteração mais lenta, além de ser pouco conhecido pela equipe de desenvolvimento.
- Cassandra: Alta escalabilidade, mas complexidade operacional maior.

## Consequências

- Pode haver desafios na modelagem de dados relacionais.
- Mudanças de requisitos podem mudar drasticamente a modelagem dos dados.
