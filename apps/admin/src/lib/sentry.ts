import * as Sentry from '@sentry/react';
import { Replay } from '@sentry/replay';
import { env } from '../env';

export const initSentry = () => {
  if (env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: env.VITE_SENTRY_DSN,
      environment: env.VITE_SENTRY_ENVIRONMENT,
      release: env.VITE_SENTRY_RELEASE,
      integrations: [
        new Sentry.BrowserTracing({
          // Set sampling rate for performance monitoring
          tracePropagationTargets: [
            'localhost',
            /^https:\/\/yourserver\.io\/api/,
          ],
        }),
        new Replay({
          // Set sampling rate for session replay
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: env.VITE_SENTRY_TRACES_SAMPLE_RATE,
      // Session Replay
      replaysSessionSampleRate: env.VITE_SENTRY_REPLAYS_SAMPLE_RATE,
      replaysOnErrorSampleRate: 1.0,
      beforeSend(event) {
        // Filter out development errors
        if (env.VITE_SENTRY_ENVIRONMENT === 'development') {
          return null;
        }
        return event;
      },
    });
  }
};

export { Sentry };
