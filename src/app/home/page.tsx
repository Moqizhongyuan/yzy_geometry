'use client'

import { useEffect, useRef } from 'react'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 设置容器高度
    if (containerRef.current) {
      containerRef.current.style.height = 'calc(100vh - 40px)' // 减去NavBar的高度
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="text-5xl flex items-center justify-center w-full"
    >
      <div>欢迎来到我的图形编辑工具</div>
    </div>
  )
}
