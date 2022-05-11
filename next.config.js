const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

const { resolve } = require("path");

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    // Ensures that web workers can import scripts.
    config.output.publicPath = '/_next/';

    config.experiments = {
      asyncWebAssembly: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    config.plugins.push(
      new WasmPackPlugin({
        crateDirectory: resolve('./rust'),
        args: '--log-level warn',
      })
    );
    
    return config
  },
}

module.exports = nextConfig
