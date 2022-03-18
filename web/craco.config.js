const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { getLoader, loaderByName } = require('@craco/craco');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        ({ constructor: c }) => !c || c.name !== 'ModuleScopePlugin',
      );
      // Because CEF has issues with loading source maps properly atm,
      // lets use the best we can get in line with `eval-source-map`
      if (webpackConfig.mode === 'development' && process.env.IN_GAME_DEV) {
        webpackConfig.devtool = 'eval-source-map';
        webpackConfig.output.path = path.join(__dirname, 'build');
      }

      const { isFound, match } = getLoader(webpackConfig, loaderByName('babel-loader'));
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat([path.join(__dirname, '../typings')]);
      }

      webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin());

      return {
        ...webpackConfig,
        module: {
          ...webpackConfig.module,
          rules: [
            ...webpackConfig.module.rules,
            {
              type: 'javascript/auto',
              test: /\.mjs$/,
              include: /node_modules/,
            },
          ],
        },
      };
    },
  },

  devServer: (devServerConfig) => {
    if (process.env.IN_GAME_DEV) {
      devServerConfig.writeToDisk = true;
    }

    return devServerConfig;
  },
};
