# ADR 001: Escolha do Banco de Dados Relacional

## Contexto

Precisamos criar views que sejam performáticas agrupando dados de diversas tabelas para fornecer estatísticas globais de partidas e jogadores.

## Decisão

Optamos por criar VIEWS MATERIALIZADAS no PostgreSQL para facilitar o gerenciamento da atualização periódica dos dados e controle ACID.

## Alternativas Consideradas

- NestJS: A própria aplicação calcular os rankings globais, simplificaria testes unitários, mas, perde muito em performance e controle de dados sujos.

## Consequências

- Equipe precisa tomar cuidado com a frequência de atualização da VIEW MATERIALIZADA;
- Mudanças de requisitos vão necessitar de alterações na VIEW, que pode ser gerida pelo ORM da aplicação em forma de migrations.