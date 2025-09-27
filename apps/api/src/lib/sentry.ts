import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { env } from '../env';

export function initSentry() {
  if (env.SENTRY_DSN) {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      environment: env.SENTRY_ENVIRONMENT,
      release: env.SENTRY_RELEASE,
      integrations: [
        // Enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // Enable Express.js tracing
        new Sentry.Integrations.Express({ app: undefined }),
        // Enable Prisma tracing
        new Sentry.Integrations.Prisma({ client: undefined }),
        // Enable profiling
        new ProfilingIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
      // Profiling
      profilesSampleRate: env.SENTRY_PROFILES_SAMPLE_RATE,
      beforeSend(event) {
        // Filter out development errors
        if (env.SENTRY_ENVIRONMENT === 'development') {
          return null;
        }
        return event;
      },
    });
  }
}

export { Sentry };
