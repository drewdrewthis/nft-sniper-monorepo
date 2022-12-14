export * from './enhanceApp';

/**
 * Sleep function.
 * @param ms Miliseconds for the sleep
 * @returns void
 */
export function sleep(ms: number) {
  if (process.env.NODE_ENV === 'test') return;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
