const path = require('path');
const webpack = require('webpack');
// const { FederatedTypesPlugin } = require('@module-federation/typescript');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const devServer = require('./webpack/devServer');
const rules = require('./webpack/rules');
// const federationConfig = require('./webpack/mfPlugin');

const buildDate = new Date().toLocaleString();
const isDevelopment = process.env.NODE_ENV === 'development';
const DIST_ROOT_PATH = path.join(__dirname, './', 'dist');

const fs = require('fs');

const getWorkspaceAlias = () => {
  const basePath = path.resolve(__dirname, './');
  const pkg = fs.readFileSync(path.resolve(basePath, 'package.json')) || {};
  const results = {};
  const workspaces = pkg.workspaces;
  if (Array.isArray(workspaces)) {
    workspaces.forEach((pattern) => {
      const { found } = new GlobSync(pattern, { cwd: basePath });
      found.forEach((name) => {
        const pkg = fs.readFileSync(
          path.resolve(basePath, name, './package.json')
        );
        results[pkg.name] = path.resolve(basePath, name, './src');
      });
    });
  }
  return results;
};

// for (const key in baseConfig.entry) {
//   if (Array.isArray(baseConfig.entry[key])) {
//     baseConfig.entry[key].push(
//       devServer,
//       `${client}?http://localhost:${PORT}`
//       // require.resolve('webpack/hot/dev-server'),
//       // `${require.resolve('webpack-dev-server/client')}?http://localhost:${PORT}`
//     );
//   }
// }

// const entry = 


module.exports = (env, argv) => {
  return {
    // devtool: isDevelopment ? 'eval-source-map' : 'hidden-source-map',
    devtool: 'inline-source-map',
    entry: {
      playground: path.resolve(__dirname, './playground/main.tsx'),
    },
    mode: process.env.NODE_ENV || 'development',
    performance: { maxAssetSize: 1000000 },
    devServer: devServer,
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].[hash].bundle.js',
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js'],
      // alias: {
      //   '@': path.resolve(__dirname, 'src')
      // }
      alias: getWorkspaceAlias(),
    },
    module: {
      rules: rules
    },
    plugins: [
      new webpack.EnvironmentPlugin({ BUILD_DATE: buildDate }),
      new webpack.DefinePlugin({ 'process.env': JSON.stringify(process.env) }),
      // new FederatedTypesPlugin({
      //   federationConfig,
      //   disableDownloadingRemoteTypes: process.env.NODE_ENV !== 'development'
      // }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        icon: './public/assets/icon/iconfont.css'
      }),
      new ForkTsCheckerWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join('./', 'public', 'assets'),
            to: path.join(DIST_ROOT_PATH, 'assets')
          }
        ]
      }),
      new CssMinimizerWebpackPlugin(),
      new MiniCssExtractPlugin(),
      new TsconfigPathsPlugin({ configFile: 'tsconfig.json' })
    ]
  };
};
