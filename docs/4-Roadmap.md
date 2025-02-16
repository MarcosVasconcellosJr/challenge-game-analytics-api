## Roadmap

FIXME:

## Como escalar essa solução ainda mais?

Opção 1 - Melhorar performance das Views:

- Se o volume de dados crescer muito, podemos particionar a view ou usar um banco colunar como ClickHouse/Cassandra para analytics ainda mais rápidos.

Opção 2 - Mudar de arquitetura:

- Usar um airflow para coleta dos dados, tradução e persistência;

- Através do airflow usando DAG's de controle de fluxo, chamar um fluxo EMR da AWS para processar os dados "instantaneamente";

- EMR (Elastic MapReduce) é um serviço da Amazon Web Services (AWS) que permite processar, analisar e transformar grandes volumes de dados. Ele é uma plataforma de big data que usa o Apache Hadoop e outros frameworks;