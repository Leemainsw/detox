export function getLoginRedirectUrl(targetPath: string) {
  return `/login?redirect=${encodeURIComponent(targetPath)}`;
}
