import { Plugin } from 'vite'
import { convertToWebpPlugin } from './convertToWebp'

export default function createPlugins(): Plugin[] {
  return [convertToWebpPlugin({ quality: 75 })]
}
