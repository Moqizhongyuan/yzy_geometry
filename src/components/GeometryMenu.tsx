import { MenuProps } from 'antd'
import GMenu from '../base/components/GMenu'

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    key: 'rectangle',
    label: '矩形'
  }
]

const GeometryMenu = () => {
  return <GMenu onClickFn={e => console.log(e)} items={items} />
}

export default GeometryMenu
