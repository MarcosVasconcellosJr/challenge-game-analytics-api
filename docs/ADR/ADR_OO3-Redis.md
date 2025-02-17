# ADR 001: Escolha do Banco de Dados Relacional

## Contexto

Precisamos ter uma performance melhorada ao mostrar os dados finais de estatísticas, já que os mesmos não são atualizados com frequência. Além disso precisamos evitar processamentos em duplicata porque estamos em um cenário de uso de SQS e vários PODs simultâneos.

## Decisão

Optamos pelo Redis devido ao costume do time, facilidade de integração e rapidez no retorno, além de suportar as duas necessidades:

1) Caching
2) Distribuited Lock

## Alternativas Consideradas

- MemCached: Dificuldade de rodar local e gerenciar.
- Memory Cache: Perigo de concorrência no banco de dados por registros descasados em PODS/Instancias diferentes da aplicação.

## Consequências

- A medida que tivermos que escalar mais o número de partidas, podemos ter que escalar horizontalmente/verticalmente no cloud provider.

---

🔙 [Voltar: Arquitetura](../2-Architecture.md)