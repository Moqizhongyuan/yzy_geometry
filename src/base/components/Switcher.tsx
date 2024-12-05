import React, { useContext, useEffect } from 'react'
import { Switch } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { Theme, ThemeContext } from '@components/ThemeContext'

const Switcher: React.FC = () => {
  const APPEARANCE_KEY = 'appearance'
  const context = useContext(ThemeContext)

  const updateAppearance = () => {
    const userPreference = localStorage.getItem(APPEARANCE_KEY)
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
      // 本地状态存储
      localStorage.setItem(APPEARANCE_KEY, 'light')
    } else {
      context?.setValue('dark')
      // 本地状态存储
      localStorage.setItem(APPEARANCE_KEY, 'dark')
    }
  }
  return (
    <Switch
      value={context?.value === 'light'}
      checkedChildren={<SunOutlined />}
      unCheckedChildren={<MoonOutlined />}
      onClick={() => toggle()}
    />
  )
}

export default Switcher
