# Code challenge

Este projeto consiste em implementar um leitor de log de um jogo de tiro em primeira pessoa.

# Resultado esperado

- Montar o ranking de cada partida, com a quantidade de frags\* e a quantidade de mortes de cada jogador;

- Permitir que o seu código receba logs de múltiplas rodadas em um único arquivo.

## Funcionalidades

- Upload de arquivos de log com dados das partidas;

- Enfileiramento do arquivo para processamento e resiliência;

- Integração com SQS para processamento sequencial dos arquivos;

- Implementação de consumo de filas SQS com tratamento de DLQ/Visibility;

- Controle de `arquivos & partidas` já processadas usando o Redis - Distribuited Lock;

- Leitura do arquivo de logs usando nodeJS streams para maior performance.

- Enfileiramento de cada partida para geração das estatísticas;


# Documentação

[🔗 Getting Started](./docs/1-Getting%20Started.md)