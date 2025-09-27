import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3002'),
  
  // Telegram Bot
  TELEGRAM_BOT_TOKEN: z.string().min(1, 'TELEGRAM_BOT_TOKEN is required'),
  TELEGRAM_CHAT_ID: z.string().min(1, 'TELEGRAM_CHAT_ID is required'),
  
  // GitHub
  GITHUB_TOKEN: z.string().min(1, 'GITHUB_TOKEN is required'),
  GITHUB_REPO: z.string().min(1, 'GITHUB_REPO is required'),
  GITHUB_OWNER: z.string().min(1, 'GITHUB_OWNER is required'),
  
  // Services
  GRAFANA_URL: z.string().url().default('http://localhost:3000'),
  GRAFANA_USERNAME: z.string().default('admin'),
  GRAFANA_PASSWORD: z.string().default('admin123'),
  
  PROMETHEUS_URL: z.string().url().default('http://localhost:9090'),
  
  // Backup
  BACKUP_S3_BUCKET: z.string().optional(),
  BACKUP_S3_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  
  // Webhook
  WEBHOOK_SECRET: z.string().min(32, 'WEBHOOK_SECRET must be at least 32 characters'),
  
  // CORS
  CORS_ORIGIN: z.string().default('*'),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
