import {
  PutObjectCommand,
  type PutObjectCommandOutput,
  S3Client,
  DeleteObjectCommand,
  type DeleteObjectCommandOutput,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from 'dotenv'

dotenv.config()

const s3 = new S3Client()

export interface SaveParams {
  readonly key: string
  readonly body: Buffer
  readonly cacheControl?: string
  readonly isPublic?: boolean
  readonly contentType?: string
}

export const save = async ({
  key,
  body,
  cacheControl,
  isPublic,
  contentType,
}: SaveParams): Promise<PutObjectCommandOutput> => {
  const upload = await s3.send(
    new PutObjectCommand({
      Key: key,
      Body: body,
      Bucket: process.env.S3_BUCKET,
      CacheControl: cacheControl || 'private, max-age=604800, immutable',
      ACL: isPublic ? 'public-read' : undefined,
      ContentType: contentType,
    }),
  )

  return upload
}

export interface SaveMulterFileParams {
  readonly file: Express.Multer.File
  readonly directory: string
  readonly cacheControl?: string
  readonly isPublic?: boolean
  readonly contentType?: string
}

export const remove = async (
  key: string,
): Promise<DeleteObjectCommandOutput> => {
  const remove = await s3.send(
    new DeleteObjectCommand({ Key: key, Bucket: process.env.S3_BUCKET }),
  )
  return remove
}

export const getUrl = async (key: string) => {
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }),
  )
  return url
}
