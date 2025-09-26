import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:5000'),
  VITE_DOMAIN: z.string().default('localhost'),
  VITE_ADMIN_TITLE: z.string().default('Tour Admin'),
  VITE_ADMIN_LOGO: z.string().optional(),
  VITE_MINIO_ENDPOINT: z.string().default('localhost'),
  VITE_MINIO_PORT: z.string().transform(Number).default('9000'),
  VITE_MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  VITE_MINIO_SECRET_KEY: z.string().default('minioadmin123'),
  VITE_MINIO_BUCKET: z.string().default('tour-media'),
  VITE_MINIO_USE_SSL: z.string().transform(val => val === 'true').default('false'),
});

export const env = envSchema.parse(import.meta.env);

export type Env = z.infer<typeof envSchema>;
