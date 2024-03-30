import { memo } from 'react'
import type { PropsWithChildren } from 'react'
import { DndContext } from '@dnd-kit/core'

const KanbanBoard = memo(({ children }: PropsWithChildren) => {
  return <DndContext>{children}</DndContext>
})

export default KanbanBoard
