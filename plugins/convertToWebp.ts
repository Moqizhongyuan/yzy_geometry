import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import { Plugin } from 'vite'
// import imagemin from 'vite-plugin-imagemin'

export function convertToWebpPlugin(options = {}): Plugin {
  return {
    name: 'vite-plugin-webp-convert',
    apply: 'build',
    async buildStart() {
      const srcDir = path.resolve(__dirname, '../public/images')
      // 读取 srcDir 目录中的所有 .jpg 文件
      const files = await fs.promises.readdir(srcDir)
      const convertFiles = files.filter(file =>
        /jpeg|jpg/.test(path.extname(file))
      )

      // 对每个 .jpg 文件进行处理
      for (const file of convertFiles) {
        const srcFilePath = path.resolve(srcDir, file)
        const destFilePath = srcFilePath + '.webp'

        try {
          // 使用 sharp 转换成 webp 格式
          await sharp(srcFilePath).webp(options).toFile(destFilePath)

          console.log(
            `Converted ${file} to ${path.basename(file, '.jpg')}.webp`
          )
        } catch (error) {
          console.error(`Error converting ${file}:`, error)
        }
      }
    }
  }
}
