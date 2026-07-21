import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Product media served from Supabase Storage.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

// Wraps the config so Sentry can instrument the build and (when a Sentry auth
// token + org/project are present) upload source maps. All Sentry runtime
// behaviour stays disabled until NEXT_PUBLIC_SENTRY_DSN is set.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  // Route browser Sentry requests through the app to dodge ad-blockers.
  tunnelRoute: "/monitoring",
});
