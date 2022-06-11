import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'node:path';
import Webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import 'webpack-dev-server';

import babelConfig from './babel.config';
import { BuildConfig } from './BuildConfig';
import postcssConfig from './postcss.config';
import { only } from './utils';


declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      BUNDLE_ANALYZER?: string
      DEV_PROXY_TARGET?: string
    }
  }
}

export default async (config: BuildConfig): Promise<Webpack.Configuration> => {
  return {
    mode: config.mode,
    devtool: config.mode === 'development' ? 'inline-source-map' : false,
    cache: {
      type: 'filesystem',
    },
    context: path.resolve(config.context, './src'),
    entry: {
      index: './index.tsx',
    },
    output: {
      path: path.resolve(config.context, './dist'),
      publicPath: config.publicUrl,
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    resolve: {
      extensions: [ '.ts', '.tsx', '.js', '.jsx' ],
      alias: {
        '~': path.resolve(config.context, './src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/i,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: babelConfig,
          },
        },
        {
          test: /\.s[ca]ss$/i,
          use: [
            require.resolve('style-loader'),
            require.resolve('css-loader'),
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: await postcssConfig(config),
              },
            },
            require.resolve('sass-loader'),
          ],
        },
      ],
    },
    plugins: only([
      config.mode === 'development' && new ReactRefreshPlugin(),
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(config.mode),
        },
      }),
      new Webpack.CleanPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(config.context, './public/index.html'),
        templateParameters: {
          publicUrl: config.publicUrl,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            context: path.resolve(config.context, './public'),
            from: '**/*',
            filter: filename => !filename.endsWith('.html'),
          },
        ],
      }),
      process.env.BUNDLE_ANALYZER === 'true' && new BundleAnalyzerPlugin(),
    ]),
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom|redux|@reduxjs)[\\/]/,
            priority: -5,
            reuseExistingChunk: true,
          },
          mantine: {
            name: 'mantine',
            test: /[\\/]node_modules[\\/](@mantine)[\\/]/,
            priority: -5,
            reuseExistingChunk: true,
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      },
    },
    devServer: {
      proxy: only([
        process.env.DEV_PROXY_TARGET ? {
          context: '/power',
          target: process.env.DEV_PROXY_TARGET,
          changeOrigin: true,
        } : null,
        process.env.DEV_PROXY_TARGET ? {
          context: '/socket',
          target: process.env.DEV_PROXY_TARGET,
          changeOrigin: true,
          ws: true,
        } : null,
      ]),
    },
  };
};
