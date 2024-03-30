import { memo } from 'react'
import type { PropsWithChildren } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import { MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'

const KanbanBoard = memo(
  ({
    children,
    onDragEnd,
  }: PropsWithChildren<{
    onDragEnd: (e: DragEndEvent) => void
  }>) => {
    const mouseSensor = useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })

    const touchSensor = useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
      },
    })

    const sensors = useSensors(mouseSensor, touchSensor)

    return (
      <DndContext onDragEnd={onDragEnd} sensors={sensors}>
        {children}
      </DndContext>
    )
  },
)

export default KanbanBoard
