'use client'

import React from 'react'
import { ThemeProvider as AntThemeProvider } from 'antd-style'
import { ThemeProvider } from '@components/ThemeContext'
import { useContext } from 'react'
import ThemeContext from '@components/ThemeContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const context = useContext(ThemeContext)

  return (
    <AntThemeProvider
      themeMode={context?.value}
      theme={(appearance: string) => {
        // 如果是暗色模式，就返回暗色主题
        if (appearance === 'dark') {
          return {
            token: {
              colorPrimary: '#149684',
              colorBgBase: '#1b1b1b'
            }
          }
        }

        // 否则就返回默认主题
        return {
          token: {
            colorPrimary: '#41c6b0',
            colorBgBase: '#fff'
          }
        }
      }}
    >
      {children}
    </AntThemeProvider>
  )
}
