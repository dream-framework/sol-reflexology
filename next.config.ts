import type { NextConfig } from "next";

// When deploying to GitHub Pages (project page), the site is served from
// https://<user>.github.io/<repo>/ — so we need a basePath matching the repo.
const REPO = "sol-reflexology";
const isGhPages = process.env.DEPLOY_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  output: isGhPages ? "export" : "standalone",
  basePath: isGhPages ? `/${REPO}` : "",
  trailingSlash: true,
  images: {
    // Required for static export — the Next.js image optimizer needs a server.
    unoptimized: isGhPages,
  },
  // Expose basePath to client code so raw <img src="..."> can be prefixed.
  env: {
    NEXT_PUBLIC_BASE_PATH: isGhPages ? `/${REPO}` : "",
  },
  // Don't let type-checking block production builds.
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
