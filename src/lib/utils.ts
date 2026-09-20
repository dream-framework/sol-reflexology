import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Prefix a static asset path with the Next.js basePath.
 *
 * Use this for raw <img src=...> / <link href=...> / CSS background-image
 * URLs that point to files in /public. Next.js's `basePath` config only
 * applies to next/image, next/link, and routes — raw HTML tags need to be
 * prefixed manually.
 *
 * In dev (no DEPLOY_TARGET=gh-pages env), NEXT_PUBLIC_BASE_PATH is "" so
 * the path is returned unchanged. In the GitHub Pages build, it becomes
 * "/sol-reflexology" and the asset resolves correctly under the repo subpath.
 */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  return `${base}${path}`
}
