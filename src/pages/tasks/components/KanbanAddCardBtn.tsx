import { Button } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons'
import { memo } from 'react'
import type { PropsWithChildren } from 'react'
import { TextField } from '@refinedev/antd'

const KanbanAddCardBtn = memo(
  ({
    children,
    onClick,
  }: PropsWithChildren<{
    onClick: () => void
  }>) => {
    return (
      <Button size="large" icon={<PlusSquareOutlined />} className="m-4" onClick={onClick}>
        {children ?? <TextField className="text-md" type="secondary" value="添加新任务" />}
      </Button>
    )
  },
)

export default KanbanAddCardBtn
