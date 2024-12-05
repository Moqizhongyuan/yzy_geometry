import { Link } from 'react-router-dom'
import Switcher from '../base/components/Switcher'

const NavBar = () => {
  return (
    <div className="h-10 flex px-6 border-b-2">
      <Link to={'/home'} className="flex-[3] text-4xl">
        RY
      </Link>
      <div className="flex flex-[2] justify-between items-center">
        <Switcher />
        <Link to={'/home'}>首页</Link>
        <Link to={'/detail'}>详情</Link>
        <Link to={'/docs'}>文档</Link>
        <div className="rounded-full h-8 w-8 bg-gray-500"></div>
      </div>
    </div>
  )
}

export default NavBar
