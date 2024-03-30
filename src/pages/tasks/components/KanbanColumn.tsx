import { memo } from 'react'
import type { PropsWithChildren } from 'react'
import type { UseDroppableArguments } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { Badge, Button, Skeleton, Space } from 'antd'
import { TextField } from '@refinedev/antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'

interface Props {
  title: string
  count: number
  description?: string
  id: string
  data?: UseDroppableArguments['data']
  onAddClick?: (id: string) => void
}

export const KanbanColumnSkeleton = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col px-4">
      <div className="p-3">
        <Space className="w-full justify-between">
          <Skeleton.Button size="small" className="w-32" />
          <Button disabled type="text" shape="circle" icon={<MoreOutlined style={{ transform: 'rotate(90deg)' }} />} />
          <Button disabled shape="circle" icon={<PlusOutlined />} />
        </Space>
      </div>
      <div className="flex-1 border-2 border-dashed border-transparent rounded">
        <div className="mt-3 flex flex-col gap-2">{children}</div>
      </div>
    </div>
  )
}

const KanbanColumn = memo(({ children, title, count, description, id, data, onAddClick }: PropsWithChildren<Props>) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id,
    data,
  })

  return (
    <div ref={setNodeRef} className="flex flex-col px-4">
      <div className="p-3">
        <Space className="w-full justify-between">
          <Space>
            <TextField ellipsis={{ tooltip: title }} strong className="text-sm whitespace-nowrap" value={title} />
            {!!count && <Badge count={count} color="cyan" />}
          </Space>
          <Button shape="circle" size="small" icon={<PlusOutlined />} onClick={() => onAddClick?.(id)} />
        </Space>
        {description}
      </div>
      <div
        className="flex-1 border-2 border-dashed border-transparent rounded"
        style={{
          overflowY: active ? 'unset' : 'scroll',
          borderColor: isOver ? '#000040' : 'transparent',
        }}
      >
        <div className="mt-3 flex flex-col gap-2">{children}</div>
      </div>
    </div>
  )
})

export default KanbanColumn
