import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // preprocessorOptions: {
    //   less: {
    //     math: "always",
    //     relativeUrls: true,
    //     javascriptEnabled: true
    //   },
    // },
    // lightningcss: {
    //   cssModule: true,
    // },
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  build: {
    outDir: 'dist',
    watch: {},
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'auChat',
      // 将添加适当的扩展名后缀
      fileName: 'auChat',
    },
    rollupOptions: {
      // 确保外部化处理那些
      // 你不想打包进库的依赖
      external: ['react', 'react-dom'],
      // output: {
      //   // 在 UMD 构建模式下为这些外部化的依赖
      //   // 提供一个全局变量
      //   globals: {
      //     vue: 'Vue',
      //   },
      // },
    },
  }
})
