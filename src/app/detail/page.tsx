'use client'

import { lazy, Suspense } from 'react'

const DetailContent = lazy(() => import('@components/DetailContent'))

export default function Detail() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center text-center text-3xl">
          <div>加载中...</div>
        </div>
      }
    >
      <DetailContent />
    </Suspense>
  )
}
