'use client'

import React, { createContext, useState, useEffect } from 'react'
import { APPEARANCE_KEY, Theme } from '@constants/theme'

// 创建一个 Context，默认值为空
const ThemeContext = createContext<
  { value: string; setValue: (value: Theme) => void } | undefined
>(undefined)

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>('light')

  useEffect(() => {
    // 在客户端运行时获取 localStorage
    const localStorageTheme = localStorage.getItem(APPEARANCE_KEY) ?? 'light'
    setTheme(localStorageTheme)
  }, [])

  return (
    <ThemeContext.Provider value={{ value: theme, setValue: setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext
export { ThemeProvider }
