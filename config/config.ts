// bigfish-library 框架文档: https://bigfish.antgroup-inc.cn/docs/advanced/library
import { defineConfig } from '@alipay/bigfish-library';
import path from 'path';

export default defineConfig({
  // 这一层是 dumi（用于工具资产文档编译）的配置项，请访问: https://d.umijs.org/config
  resolve: {
    entryFile: './src/index.ts',
  },
  library: {
    // 以下是 father（用于工具资产源码构建）的配置项，请访问：https://github.com/umijs/father/blob/master/docs/config.md
    esm: {},
    umd: {
      // externals: {
      //   react: 'React',
      //   'react-dom': 'ReactDOM',
      //   // antd: 'antd',
      // },
      name: 'ZChat',
      extractCSS: true,
      chainWebpack: (memo) => {
        memo.module.rules.delete('less');
        memo.module
          .rule('less-to-css')
          .test(/\.less$/)
          .use('style-loader')
          .loader('style-loader')
          .end()
          .use('css-loader')
          .loader('css-loader')
          .options({
            modules: {
              localIdentName: 'zchat-[local]-[hash:base64:5]',
            },
          })
          .end()
          .use('less-loader')
          .loader('less-loader')
          .options({
            lessOptions: {
              javascriptEnabled: true, // 允许在 LESS 中使用 JavaScript
            },
          });

        memo.module.rules.delete('css');
        memo.module
          .rule('tailwindcss')
          .test(/\.css$/)
          .use('style-loader')
          .loader('style-loader')
          .end()
          .use('css-loader')
          .loader('css-loader')
          .end()
          .use('postcss-loader')
          .loader('postcss-loader')
          .options({
            postcssOptions: {
              plugins: [
                require('tailwindcss')('./tailwind.config.js'),
                require('autoprefixer'),
              ],
            },
          });

        memo.plugin('dts')
          .use(require('npm-dts-webpack-plugin'), [{
            entry: path.resolve(__dirname, '../src/index.ts'),
            output: path.resolve(__dirname, '../dist/index.d.ts'),
          }]);

        return memo;
      },
    },
  },
  normalCSSLoaderModules: { localIdentName: 'zchat-[local]-[file]' },
  tailwindcss: {},
  plugins: ['@umijs/plugins/dist/tailwindcss'],
});
