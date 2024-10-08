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

    config.module.rules.push(
      {
        test: /\.node$/,
        use: 'ignore-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.example$/,
        use: 'example-loader',
      }
    );

    return config;
  },
});

export default nextConfig;
