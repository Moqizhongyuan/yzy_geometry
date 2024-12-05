import React, { createContext, useState } from 'react'

type Theme = 'light' | 'dark'

// 创建一个 Context，默认值为空
const ThemeContext = createContext<
  { value: string; setValue: (value: Theme) => void } | undefined
>(undefined)

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const localStorageTheme = localStorage.getItem('appearance') ?? 'light'
  const [theme, setTheme] = useState<string>(localStorageTheme)

  return (
    <ThemeContext.Provider value={{ value: theme, setValue: setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeProvider, ThemeContext }
export type { Theme }
