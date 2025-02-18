import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string().url(),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
  AWS_ENDPOINT: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_REGION: z.string().default('sa-east-1'),
  AWS_S3_BUCKET_NAME: z.string(),
  AWS_SQS_REGION: z.string().default('sa-east-1'),
  AWS_SQS_QUEUE_URL_MATCH: z.string(),
  AWS_SQS_QUEUE_URL_FILE: z.string(),
})

export type Env = z.infer<typeof envSchema>
