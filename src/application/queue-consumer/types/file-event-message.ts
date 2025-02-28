interface OwnerIdentity {
  principalId: string
}

interface S3Bucket {
  name: string
  ownerIdentity: OwnerIdentity
  arn: string
}

interface S3Object {
  key: string
  sequencer: string
  eTag: string
  size: number
}

interface UserIdentity {
  principalId: string
}

interface RequestParameters {
  sourceIPAddress: string
}

interface ResponseElements {
  'x-amz-request-id': string
  'x-amz-id-2': string
}

interface S3Details {
  s3SchemaVersion: string
  configurationId: string
  bucket: S3Bucket
  object: S3Object
}
interface S3Record {
  eventVersion: string
  eventSource: string
  awsRegion: string
  eventTime: string
  eventName: string
  userIdentity: UserIdentity
  requestParameters: RequestParameters
  responseElements: ResponseElements
  s3: S3Details
}

export interface S3Event {
  Records: S3Record[]
  Event: string
}
