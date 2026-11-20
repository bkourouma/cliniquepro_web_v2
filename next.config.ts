import type { NextConfig } from "next";

// Evaluated by next build and serialized into the standalone artifact.
// An unknown/local revision must never be presented as a production SHA.
const buildCommitSha = process.env.BUILD_COMMIT_SHA;
const commitSha = buildCommitSha?.length === 40 && /^[a-f0-9]{40}$/.test(buildCommitSha)
  ? buildCommitSha
  : null;

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return commitSha ? [{
      source: "/:path*",
      headers: [{ key: "x-commit-sha", value: commitSha }],
    }] : [];
  },
};

export default nextConfig;
