## Rodando localmente
Para começar temos que baixar o código e executar o clone, após isso rodar o docker e a infra e só então rodar testes ou rodar a aplicação.

## Clonando o projeto

Clone o projeto

```bash
  git clone https://github.com/MarcosVasconcellosJr/challenge-game-analytics-api.git
```

Entre no diretório do projeto

```bash
  cd challenge-game-analytics-api
```


## Rodando o docker e infra local

Para rodar o docker-compose, rode o seguinte comando

```bash
  docker compose up -d
```

Quando quiser encerrar a infra do docker, rode o seguinte comando

```bash
  docker compose down
```

## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  yarn test
```

## Rodando localmente

Instale as dependências

```bash
  yarn
```

Inicie o servidor

```bash
  yarn start
```

# Navegação

🔙 [Voltar: Arquitetura](./2-Architecture.md)

🔜 [Avançar: Roadmap](./4-Roadmap.md)