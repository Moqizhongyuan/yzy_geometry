import React, { useEffect, useState } from 'react'
import { Switch } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'

const Switcher: React.FC = () => {
  const APPEARANCE_KEY = 'appearance'
  const updateAppearance = () => {
    const userPreference = localStorage.getItem(APPEARANCE_KEY)
    setAppearance(userPreference === 'dark')
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      updateAppearance()
      window.addEventListener('storage', updateAppearance)
    }
  }, [])

  function toggle() {
    if (appearance) {
      setAppearance(false)
      // 本地状态存储
      localStorage.setItem(APPEARANCE_KEY, 'light')
    } else {
      setAppearance(true)
      // 本地状态存储
      localStorage.setItem(APPEARANCE_KEY, 'dark')
    }
  }
  const [appearance, setAppearance] = useState(true)
  return (
    <Switch
      value={appearance}
      checkedChildren={<SunOutlined />}
      unCheckedChildren={<MoonOutlined />}
      onClick={() => toggle()}
    />
  )
}

export default Switcher
