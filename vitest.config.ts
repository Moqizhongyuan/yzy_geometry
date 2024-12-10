// import { JSDOM } from 'jsdom'
import { defineConfig } from 'vitest/config'

// // 在全局环境中模拟浏览器的 document 和 window
// const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
// global.document = dom.window.document
// global.HTMLElement = dom.window.HTMLElement
// global.HTMLCanvasElement = dom.window.HTMLCanvasElement

export default defineConfig({
  test: {
    environment: 'node',
    passWithNoTests: true,
    exclude: ['**/node_modules/**', '**/dist/**'],
    setupFiles: './test/setup.ts'
  }
})
