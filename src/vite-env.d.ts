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
