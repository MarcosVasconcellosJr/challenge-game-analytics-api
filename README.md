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

- Controle de partidas processadas no DynamoDB - LockAsync distribuído;

- Leitura do arquivo de logs usando nodeJS streams para maior performance.

- Enfileiramento de cada partida para geração das estatísticas;

## Roadmap

FIXME:

## Como escalar essa solução ainda mais?

Opção 1 - Melhorar performance das Views:

- Se o volume de dados crescer muito, podemos particionar a view ou usar um banco colunar como ClickHouse/Cassandra para analytics ainda mais rápidos.

Opção 2 - Mudar de arquitetura:

- Usar um airflow para coleta dos dados, tradução e persistência;

- Através do airflow usando DAG's de controle de fluxo, chamar um fluxo EMR da AWS para processar os dados "instantaneamente";

- EMR (Elastic MapReduce) é um serviço da Amazon Web Services (AWS) que permite processar, analisar e transformar grandes volumes de dados. Ele é uma plataforma de big data que usa o Apache Hadoop e outros frameworks;
