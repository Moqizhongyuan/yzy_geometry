import React from 'react'
import { Switch } from 'antd'
import { SwitchChangeEventHandler } from 'antd/es/switch'

const Switcher = ({
  icon1,
  icon2,
  onClickFn,
  value
}: {
  icon1?: React.ReactNode
  icon2?: React.ReactNode
  onClickFn: SwitchChangeEventHandler
  value?: boolean
}) => {
  return (
    <Switch
      value={value}
      checkedChildren={icon1}
      unCheckedChildren={icon2}
      onClick={onClickFn}
    />
  )
}

export default Switcher
