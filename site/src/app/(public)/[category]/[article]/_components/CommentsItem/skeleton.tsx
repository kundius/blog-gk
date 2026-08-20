import React from 'react'
import Skeleton from 'react-loading-skeleton'

export function CommentsItemSkeleton () {
  return (
    <div className="mt-8">
      <div className="flex items-start">
        <div className="mr-5">
          <Skeleton height={60} width={60} circle />
        </div>
        <div className="flex-grow space-y-2">
          <div>
            <Skeleton height={32} />
          </div>
          <div>
            <Skeleton count={2} />
          </div>
        </div>
      </div>
    </div>
  )
}
