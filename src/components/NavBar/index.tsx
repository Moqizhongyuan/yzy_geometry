import { Link } from 'react-router-dom'
import Switcher from '../../base/components/Switcher'
import styles from './index.module.scss'
import { useContext, useEffect } from 'react'
import ThemeContext from '@components/ThemeContext'
import { APPEARANCE_KEY, Theme } from '@constants/theme'
const items = [
  { text: '首页', url: '/home' },
  { text: '使用', url: '/detail' },
  { text: '文档', url: '/doc' }
]

const NavBar = () => {
  const setClassList = (isDark = false) => {
    const classList = document.documentElement.classList
    if (isDark) {
      classList.add('dark')
    } else {
      classList.remove('dark')
    }
  }
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
    <header
      className={`h-10 flex px-6 border-b-2 transition duration-300 ${styles.nav}`}
    >
      <div className="flex-[3] text-4xl">
        <Link className="font-semibold hover:opacity-60" to={'/home'}>
          RY
        </Link>
      </div>
      <div className="flex flex-[2] justify-between items-center">
        <Switcher
          value={context?.value !== 'dark'}
          onClickFn={toggle}
          icon1={<i className="fa-solid fa-sun" />}
          icon2={<i className="fa-solid fa-moon" />}
        />
        {items.map(item => (
          <Link key={item.text} className={styles.link} to={item.url}>
            {item.text}
          </Link>
        ))}
        <div className={`${styles.socialLinkIcon} ml-2`}>
          <a href="https://github.com/Moqizhongyuan/yzy_geometry/">
            <div className="fa-brands fa-github text-xl w-5 h-5 fill-current"></div>
          </a>
        </div>
      </div>
    </header>
  )
}

export default NavBar
