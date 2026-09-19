/**
 * Prefix an asset path with the configured basePath.
 * Use this for raw <img src="..."> tags in client components — Next.js
 * auto-prefixes <Link> and next/image, but does NOT prefix raw <img>.
 *
 * In dev (no basePath), this returns the path unchanged.
 */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
