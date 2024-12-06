import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import VitePluginImp from 'vite-plugin-imp'
import path from 'path'

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
    })
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
  }
})
