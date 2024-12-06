import React, { useContext, useEffect } from 'react'
import { Switch } from 'antd'
import { Theme, ThemeContext } from '@components/ThemeContext'

const setClassList = (isDark = false) => {
  const classList = document.documentElement.classList
  if (isDark) {
    classList.add('dark')
  } else {
    classList.remove('dark')
  }
}

const Switcher: React.FC = () => {
  const APPEARANCE_KEY = 'appearance'
  const context = useContext(ThemeContext)

  const updateAppearance = () => {
    const userPreference = localStorage.getItem(APPEARANCE_KEY)
    setClassList(userPreference === 'dark')
    if (userPreference) {
      context?.setValue(userPreference as Theme)
    } else {
      context?.setValue('light')
      localStorage.setItem(APPEARANCE_KEY, 'light')
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      updateAppearance()
      window.addEventListener('storage', updateAppearance)
    }
  }, [])

  function toggle() {
    if (context?.value === 'dark') {
      context?.setValue('light')
      setClassList(false)
      // 本地状态存储
      localStorage.setItem(APPEARANCE_KEY, 'light')
    } else {
      context?.setValue('dark')
      setClassList(true)
      // 本地状态存储
      localStorage.setItem(APPEARANCE_KEY, 'dark')
    }
  }
  return (
    <Switch
      value={context?.value === 'light'}
      checkedChildren={<i className="fa-solid fa-sun" />}
      unCheckedChildren={<i className="fa-solid fa-moon" />}
      onClick={() => toggle()}
    />
  )
}

export default Switcher
