/**
 * Public origin of the app, from APP_URL.
 *
 * Redirects must not be built from `request.url`: behind Amplify's CloudFront
 * the Next server sees its internal host (localhost:3000), so the browser would
 * be sent there instead of the real domain.
 */
export function getAppOrigin(): string {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/** Absolute URL on the public origin for a same-origin path. */
export function appUrl(path: string): URL {
  return new URL(path, `${getAppOrigin()}/`);
}
