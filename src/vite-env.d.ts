/// <reference types="vite/client" />

declare module '@components' {
  import { FC } from 'react'
  const Component: FC<any>
  export default Component
}

declare module '@assets*' {
  const asset: string
  export default asset
}

declare module '@canvas*' {
  const canvas: any
  export default canvas
}

declare module '@constants*' {
  const constant: any
  export default constant
}

declare module 'antd-style' {
  const content: any
  export const ThemeProvider: React.FC<any>
  export default content
}
