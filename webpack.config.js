const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/app.ts',
    mode: isProduction ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                noEmit: false,
                declaration: false,
                declarationMap: false
              }
            }
          },
          exclude: /node_modules/,
        },

        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
          ],
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].chunk.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '/'
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true
          }
        }
      },
      usedExports: true,
      sideEffects: false
    },
    plugins: [
      new Dotenv(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body'
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'manifest.json', to: 'manifest.json', noErrorOnMissing: true },
          { from: 'sw.js', to: 'sw.js', noErrorOnMissing: true },
          { from: 'sound', to: 'sound', noErrorOnMissing: true },
          { from: 'icon.svg', to: 'icon.svg', noErrorOnMissing: true }
        ],
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/',
      },
      hot: true,
      host: '0.0.0.0',
      port: 4001,
      compress: true,
      historyApiFallback: true,
      open: false,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    stats: {
      errorDetails: true
    }
  };
};
