import { Menu, MenuProps, MenuTheme } from 'antd'
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

export type MenuItem = Required<MenuProps>['items'][number]

const GeometryMenu = ({
  items,
  clickFn,
  selectKeys,
  className
}: {
  items: MenuItem[]
  clickFn: MenuProps['onClick']
  selectKeys?: string[]
  className?: string
}) => {
  const context = useContext(ThemeContext)
  return (
    <Menu
      style={{ width: 200 }}
      mode="inline"
      theme={context?.value as MenuTheme}
      onClick={clickFn}
      items={items}
      selectedKeys={selectKeys}
      className={className}
    />
  )
}

export { GeometryMenu }
