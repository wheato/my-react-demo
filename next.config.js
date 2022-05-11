const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

const { resolve } = require("path");

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
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
