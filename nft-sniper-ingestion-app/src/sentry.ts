import * as Sentry from '@sentry/node';
import '@sentry/tracing';

Sentry.init({
  dsn: 'https://3d7809742b3741f98407141edea0aba1@o1384720.ingest.sentry.io/4504248961466368',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: 'test',
  name: 'My First Test Transaction',
});

setTimeout(() => {
  try {
    throw new Error('Test error');
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99);
