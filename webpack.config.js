const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// const ReactRefreshTypeScript = require('react-refresh-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isDevelopment = process.env.NODE_ENV !== 'production'
const isProduction = !isDevelopment

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment && 'inline-source-map',
  entry: {
    popup: './src/popup.tsx',
    background: './src/background.ts',
    content: './src/content.ts',
  },
  output: {
    clean: isProduction,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['popup'],
      filename: 'popup.html',
    }),
    new ForkTsCheckerWebpackPlugin(),
    // isDevelopment && new ReactRefreshWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/manifest.json', to: '' },
        // { from: "other", to: "public" },
      ],
      // options: {
      //   concurrency: 100,
      // },
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            // options: {
            //   getCustomTransformers: () => ({
            //     before: isDevelopment ? [ReactRefreshTypeScript()] : [],
            //   }),
            // },
          },
        ],
      },
    ],
  },
  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    // compress: true,
    port: 9000,
    // hot: true,
    writeToDisk: true,
    publicPath: 'http://localhost:9000',
  },
}
