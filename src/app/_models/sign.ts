export interface sign {
  s3PostPolicyEncodedString: string,
  id: number,
  fileName: string,
  fileSize: number,
  mimeType: string,
  expires: string,
  s3PostPolicy: {
    expiration: string,
    conditions: [
      object
    ]
  },
  s3PostPolicySignature: string,
  s3UploadUrl: string,
  restricted: boolean,
  discriminator: string,
  s3Url: string
}
