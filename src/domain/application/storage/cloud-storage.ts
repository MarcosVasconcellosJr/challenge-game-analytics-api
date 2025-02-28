export interface UploadParams {
  fileKey: string
  fileType?: string
  expiresInSeconds?: number
}

export abstract class CloudStorageService {
  abstract generatePreSignedUrl(params: UploadParams): Promise<string>
  abstract downloadFile(bucketName: string, fileKey: string): Promise<string>
}
