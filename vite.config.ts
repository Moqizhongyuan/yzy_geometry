import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import VitePluginImp from 'vite-plugin-imp'

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
    https: true, // 启用 https
    open: true // 自动打开浏览器
  }
})
