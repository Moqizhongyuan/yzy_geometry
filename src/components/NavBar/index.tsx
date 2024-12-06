import { Link } from 'react-router-dom'
import Switcher from '../../base/components/Switcher'
import styles from './index.module.scss'

const items = [
  { text: '首页', url: '/home' },
  { text: '使用', url: '/detail' },
  { text: '文档', url: '/doc' }
]

const NavBar = () => {
  return (
    <header className={`h-10 flex px-6 border-b-2 ${styles.nav}`}>
      <div className="flex-[3] text-4xl">
        <Link className="font-semibold hover:opacity-60" to={'/home'}>
          RY
        </Link>
      </div>
      <div className="flex flex-[2] justify-between items-center">
        <Switcher />
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
