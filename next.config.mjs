import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import withTM from 'next-transpile-modules';

const withTranspileModules = withTM(['usb']);

/** @type {import('next').NextConfig} */
const nextConfig = withTranspileModules({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        usb: false,
        noble: false,
      };
    }

    // Add a rule to ignore .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader'
    });

    return config;
  },
});

export default nextConfig;