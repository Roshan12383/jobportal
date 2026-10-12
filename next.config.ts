import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,

  images:{
    remotePatterns:[{hostname:"s710dmca33.ufs.sh",protocol:"https"}],
  }
};

export default nextConfig;
