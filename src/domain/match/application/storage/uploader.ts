export interface UploadParams {
  fileKey: string
  fileType?: string
  expiresInSeconds?: number
}

export abstract class Uploader {
  abstract generatePresignedUrl(params: UploadParams): Promise<string>
}
