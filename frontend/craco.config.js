// frontend/craco.config.js
// Configuration to fix source map warnings and optimize build

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignore source map warnings for third-party packages
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /ENOENT: no such file or directory.*\.js\.map/
      ];

      // Optimize bundle size
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three',
              chunks: 'all',
              priority: 10,
            },
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer',
              chunks: 'all',
              priority: 10,
            }
          }
        }
      };

      return webpackConfig;
    }
  },
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    }
  }
};
