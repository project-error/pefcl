const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
// const deps = require('./package.json').dependencies;
const port = process.env.PORT ?? 3000;

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  output: {
    publicPath: 'auto',
    filename: '[name].js',
  },
  devServer: {
    port,
    hot: true,
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // new ModuleFederationPlugin({
    //   name: 'bank',
    //   shared: {
    //     ...deps,
    //     react: {
    //       singleton: true,
    //       requiredVersion: deps.react,
    //     },
    //     'react-dom': {
    //       singleton: true,
    //       requiredVersion: deps['react-dom'],
    //     },
    //   },
    // }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      process: { env: {} },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    plugins: [new TsconfigPathsPlugin()],
  },
};
