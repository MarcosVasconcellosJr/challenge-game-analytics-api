# Localstack

Baixar o localstack desktop

```sh
https://docs.localstack.cloud/user-guide/tools/localstack-desktop/
```


## AWS S3

Listar objetos no bucket

```sh
export BUCKET_NAME=file-log-processor

aws --endpoint-url=http://localhost:4566 s3api list-objects --bucket $BUCKET_NAME
```

## AWS SQS

Listar mensagens na fila

```sh
export QUEUE_URL=http://localhost:4566/000000000000/upload-file-event-sqs

aws --endpoint-url=http://localhost:4566 sqs receive-message --queue-url $QUEUE_URL
```