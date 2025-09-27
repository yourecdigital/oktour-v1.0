import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  client: {
    VITE_API_URL: z.string().url().default('http://localhost:5000'),
    VITE_DOMAIN: z.string().default('localhost'),
    VITE_SENTRY_DSN: z.string().url().optional(),
    VITE_SENTRY_ENVIRONMENT: z.string().default('development'),
    VITE_SENTRY_RELEASE: z.string().optional(),
    VITE_SENTRY_TRACES_SAMPLE_RATE: z.string().transform(Number).default(0.1),
    VITE_SENTRY_REPLAYS_SAMPLE_RATE: z.string().transform(Number).default(0.1),
    VITE_APP_VERSION: z.string().default('1.0.0'),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VITE_API_URL: process.env.VITE_API_URL,
    VITE_DOMAIN: process.env.VITE_DOMAIN,
    VITE_SENTRY_DSN: process.env.VITE_SENTRY_DSN,
    VITE_SENTRY_ENVIRONMENT: process.env.VITE_SENTRY_ENVIRONMENT,
    VITE_SENTRY_RELEASE: process.env.VITE_SENTRY_RELEASE,
    VITE_SENTRY_TRACES_SAMPLE_RATE: process.env.VITE_SENTRY_TRACES_SAMPLE_RATE,
    VITE_SENTRY_REPLAYS_SAMPLE_RATE: process.env.VITE_SENTRY_REPLAYS_SAMPLE_RATE,
    VITE_APP_VERSION: process.env.VITE_APP_VERSION,
  },
});

export type Env = typeof env;