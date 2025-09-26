import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

const s3 = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY ? {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  } : undefined,
});

export async function getPresignedUpload(key: string, contentType: string) {
  const bucket = process.env.S3_BUCKET as string;
  const { url, fields } = await createPresignedPost(s3, {
    Bucket: bucket,
    Key: key,
    Conditions: [['content-length-range', 0, 50 * 1024 * 1024], ['starts-with', '$Content-Type', contentType.split('/')[0]]],
    Expires: 300,
    Fields: { 'Content-Type': contentType },
  });
  return { url, fields, objectUrl: `s3://${bucket}/${key}` };
}




