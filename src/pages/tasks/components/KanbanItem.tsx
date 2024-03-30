import { memo } from 'react'
import type { PropsWithChildren } from 'react'
import type { UseDraggableArguments } from '@dnd-kit/core'
import { DragOverlay } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'

const KanbanItem = memo(
  ({
    children,
    id,
    data,
  }: PropsWithChildren<{
    id: string
    data?: UseDraggableArguments['data']
  }>) => {
    const { attributes, listeners, setNodeRef, active } = useDraggable({
      id,
      data,
    })

    return (
      <div className="relative">
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className="rounded-2 relative cursor-grab"
          style={{
            opacity: active ? (active.id === id ? 1 : 0.5) : 1,
          }}
        >
          {active?.id === id && (
            <DragOverlay zIndex={1000}>
              <div className="rouned-2 cursor-grabbing" style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
                {children}
              </div>
            </DragOverlay>
          )}
          {children}
        </div>
      </div>
    )
  },
)

export default KanbanItem
