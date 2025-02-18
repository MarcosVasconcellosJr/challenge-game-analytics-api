#!/bin/bash
echo "########### Setting env variables ###########"
export AWS_REGION=sa-east-1
export AWS_DEFAULT_PROFILE=localstack
export UPLOAD_FILE_EVENT_SQS=upload-file-event-sqs
export MATCH_EVENT_SQS=match-event-sqs.fifo
export BUCKET_NAME=file-log-processor

echo "########### Setting up localstack profile ###########"
aws configure set aws_access_key_id access_key --profile=localstack
aws configure set aws_secret_access_key secret_key --profile=localstack
aws configure set region $AWS_REGION --profile=localstack

echo "########### Creating SQS Queues ###########"
aws --endpoint-url=http://localstack:4566 sqs create-queue --queue-name $UPLOAD_FILE_EVENT_SQS
aws --endpoint-url=http://localstack:4566 sqs create-queue --queue-name $MATCH_EVENT_SQS --attributes "FifoQueue=true"

echo "########### ARN for upload file event SQS ###########"
UPLOAD_FILE_EVENT_SQS_ARN=$(aws --endpoint-url=http://localstack:4566 sqs get-queue-attributes\
                  --attribute-name QueueArn --queue-url=http://localhost:4566/000000000000/"$UPLOAD_FILE_EVENT_SQS"\
                  |  sed 's/"QueueArn"/\n"QueueArn"/g' | grep '"QueueArn"' | awk -F '"QueueArn":' '{print $2}' | tr -d '"' | xargs)


echo "########### Listing queues ###########"
aws --endpoint-url=http://localhost:4566 sqs list-queues

echo "########### Create S3 bucket ###########"
aws --endpoint-url=http://localhost:4566 s3api create-bucket\
    --bucket $BUCKET_NAME --region $AWS_REGION\
    --create-bucket-configuration LocationConstraint=$AWS_REGION

echo "########### List S3 bucket ###########"
aws --endpoint-url=http://localhost:4566 s3api list-buckets

echo "########### Set S3 bucket notification configurations ###########"
aws --endpoint-url=http://localhost:4566 s3api put-bucket-notification-configuration\
    --bucket $BUCKET_NAME\
    --notification-configuration  '{
                                      "QueueConfigurations": [
                                         {
                                           "QueueArn": "'"$UPLOAD_FILE_EVENT_SQS_ARN"'",
                                           "Events": ["s3:ObjectCreated:*"]
                                         }
                                       ]
                                     }'

echo "########### Get S3 bucket notification configurations ###########"
aws --endpoint-url=http://localhost:4566 s3api get-bucket-notification-configuration\
    --bucket $BUCKET_NAME