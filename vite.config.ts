import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import VitePluginImp from 'vite-plugin-imp'
import path from 'path'
import viteImagemin from 'vite-plugin-imagemin'
import createPlugins from './plugins'
// import { chunkSplitPlugin } from 'vite-plugin-chunk-split'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mkcert(),
    react(),
    VitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: name => {
            if (name === 'col' || name === 'row') {
              return 'antd/lib/style/index.js'
            }
            return `antd/es/${name}/style/index.js`
          }
        }
      ]
    }),
    ...createPlugins(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 3
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 70
      },
      webp: {
        quality: 70
      }
    }),
    visualizer({
      // 打包完成后自动打开浏览器，显示产物体积报告
      open: false
    })
    // chunkSplitPlugin({
    //   strategy: 'single-vendor',
    //   customSplitting: {
    //     // 'react-vendor': ['/node_modules/react', '/node_modules/react-dom'],
    //     canvas: ['/src/canvas']
    //     // library: ['/node_modules/antd']
    //   }
    // })
  ],
  server: {
    // https: true, // 启用 https
    open: true // 自动打开浏览器
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@canvas': path.resolve(__dirname, 'src/canvas'),
      '@constants': path.resolve(__dirname, 'src/constants')
    }
  },
  build: {
    minify: 'esbuild',
    terserOptions: {
      output: {
        comments: false // 删除所有注释
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendors': ['react', 'react-dom'],
          'canvas-vendors': ['@canvas'],
          'antd-vendors': ['antd']
        }
      }
    }
  }
})
