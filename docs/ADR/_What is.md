# O que são ADRs?

Architecture Decision Records - são registros de decisões arquiteturais tomadas durante o desenvolvimento de um sistema.

Eles documentam por que uma decisão foi feita, quais alternativas foram consideradas, quais foram os critérios de escolha e quais as implicações da decisão.

## 📌 Por que usar ADRs?

- **Histórico de decisões**

  > Permite entender o contexto das escolhas feitas ao longo do tempo.

- **Melhoria na comunicação**

  > Documenta as decisões para novos membros da equipe.

- **Justificativa para mudanças**

  > Ajuda a evitar retrabalho e decisões arbitrárias.

- **Facilidade de revisão**
  > Se um problema surgir, a equipe pode revisitar a decisão rapidamente.

## 🔹 Formato básico de um ADR

Um ADR normalmente segue um modelo simples, como este:

```shell
# ADR 001: Escolha do Banco de Dados NoSQL

## Contexto
Precisamos armazenar grandes volumes de dados semi-estruturados com alta escalabilidade.

## Decisão
Optamos pelo MongoDB devido à sua flexibilidade, capacidade de escalar horizontalmente e suporte para documentos JSON.

## Alternativas Consideradas
- PostgreSQL: Exige esquemas rígidos, tornando a iteração mais lenta.
- Cassandra: Alta escalabilidade, mas complexidade operacional maior.

## Consequências
- A equipe precisará se familiarizar com MongoDB.
- Pode haver desafios na modelagem de dados relacionais.
```
