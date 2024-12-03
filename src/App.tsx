import React from 'react'
import './index.css'
import GeometryMenu from './components/GeometryMenu'

const App: React.FC = () => {
  return (
    <div className="flex h-full">
      <GeometryMenu />
      <div className="h-full w-full">
        <canvas></canvas>
      </div>
    </div>
  )
}

export default App
