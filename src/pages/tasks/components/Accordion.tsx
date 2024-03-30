import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'
import { Skeleton } from 'antd'
import { TextField } from '@refinedev/antd'

interface Props {
  accordionKey: string
  activeKey?: string
  setActive: (key?: string) => void
  icon: React.ReactNode
  isLoading: boolean
  label: string
  fallback: string | React.ReactNode
}

const Accordion = memo(
  ({ accordionKey, activeKey, setActive, icon, isLoading, children, label, fallback }: PropsWithChildren<Props>) => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 py-3 px-6 border-b border-b-solid border-b-gray-200">
          <Skeleton.Avatar size="small" shape="square" />
          <Skeleton.Input size="small" block className="h-6" />
        </div>
      )
    }

    const isActive = activeKey === accordionKey

    const toggleAccordion = () => {
      if (isActive) {
        setActive(undefined)
      } else {
        setActive(accordionKey)
      }
    }

    return (
      <div className="flex py-3 px-6 gap-3 items-start border-b border-b-solid border-b-gray-200">
        <div className="mt-[1px] flex-shrink-0">{icon}</div>
        {isActive ? (
          <div className="flex flex-col gap-3 flex-1">
            <TextField strong onClick={toggleAccordion} className="cursor-pointer" value={label} />
            {children}
          </div>
        ) : (
          <div onClick={toggleAccordion} className="cursor-pointer flex-1">
            {fallback}
          </div>
        )}
      </div>
    )
  },
)

export default Accordion
