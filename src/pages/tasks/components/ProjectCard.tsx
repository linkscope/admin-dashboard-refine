import type { User } from '~/graphql/schema.types'
import { Avatar, Skeleton, Space, Tag, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import { Button } from 'antd'
import { Card, ConfigProvider, Dropdown, theme } from 'antd'
import { TextField } from '@refinedev/antd'
import { memo, useMemo } from 'react'
import Icon, { ClockCircleOutlined, DeleteOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons'
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'
import dayjs from 'dayjs'
import { useDelete, useNavigation } from '@refinedev/core'
import getDateColor from '~/utilities/getDateColor'

interface Props {
  id: string
  title: string
  dueDate?: string
  users?: {
    id: string
    name: string
    avatarUrl?: User['avatarUrl']
  }[]
  updatedAt: string
}

const TextIconSvg = memo((props: Partial<CustomIconComponentProps>) => {
  const svg = useMemo(
    () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M1.3125 2.25C1.26094 2.25 1.21875 2.29219 1.21875 2.34375V3C1.21875 3.05156 1.26094 3.09375 1.3125 3.09375H10.6875C10.7391 3.09375 10.7812 3.05156 10.7812 3V2.34375C10.7812 2.29219 10.7391 2.25 10.6875 2.25H1.3125Z"
          fill="black"
          fillOpacity="0.65"
        />
        <path
          d="M1.3125 5.57812C1.26094 5.57812 1.21875 5.62031 1.21875 5.67188V6.32812C1.21875 6.37969 1.26094 6.42188 1.3125 6.42188H10.6875C10.7391 6.42188 10.7812 6.37969 10.7812 6.32812V5.67188C10.7812 5.62031 10.7391 5.57812 10.6875 5.57812H1.3125Z"
          fill="black"
          fillOpacity="0.65"
        />
        <path
          d="M1.3125 8.90625C1.26094 8.90625 1.21875 8.94844 1.21875 9V9.65625C1.21875 9.70781 1.26094 9.75 1.3125 9.75H7.6875C7.73906 9.75 7.78125 9.70781 7.78125 9.65625V9C7.78125 8.94844 7.73906 8.90625 7.6875 8.90625H1.3125Z"
          fill="black"
          fillOpacity="0.65"
        />
      </svg>
    ),
    [],
  )

  return <Icon component={() => svg} {...props} />
})

export const ProjectCardSkeleton = () => {
  return (
    <Card
      size="small"
      styles={{
        body: {
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
        },
      }}
      title={<Skeleton.Button active size="small" className="w-50 h-6" />}
    >
      <Skeleton.Button active size="small" className="w-50" />
      <Skeleton.Avatar active size="small" />
    </Card>
  )
}

const ProjectCard = memo(
  ({ id, title, dueDate, users }: Props) => {
    const { token } = theme.useToken()
    const { edit } = useNavigation()
    const { mutate: deleteTask } = useDelete()

    const dropdownItems = useMemo(() => {
      const dropdownItems: MenuProps['items'] = [
        {
          label: '查看卡片',
          key: '0',
          icon: <EyeOutlined />,
          onClick: () => edit('tasks', id, 'replace'),
        },
        {
          danger: true,
          label: '删除卡片',
          key: '1',
          icon: <DeleteOutlined />,
          onClick: () =>
            deleteTask({
              resource: 'tasks',
              id,
              meta: {
                operation: 'task',
              },
            }),
        },
      ]

      return dropdownItems
    }, [])

    const dueDateOptions = useMemo(() => {
      if (!dueDate) return null

      return {
        color: getDateColor(dueDate),
        text: dayjs(dueDate).format('MMM DD'),
      }
    }, [dueDate])

    return (
      <ConfigProvider
        theme={{ components: { Tag: { colorText: token.colorTextSecondary }, Card: { headerBg: 'transparent' } } }}
      >
        <Card
          size="small"
          title={<TextField ellipsis={{ tooltip: title }} value={title} />}
          extra={
            <Dropdown menu={{ items: dropdownItems }} placement="bottom" arrow={{ pointAtCenter: true }}>
              <Button
                type="text"
                shape="circle"
                icon={
                  <MoreOutlined
                    style={{ transform: 'rotate(90deg)' }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
              />
            </Dropdown>
          }
        >
          <div className="flex flex-wrap items-center gap-2">
            <TextIconSvg className="mr-1" />
            {dueDateOptions && (
              <Tag
                icon={<ClockCircleOutlined className="text-xs" />}
                className="px-1"
                style={{
                  marginInlineEnd: 0,
                  backgroundColor: dueDateOptions.color === 'default' ? 'transparent' : 'unset',
                }}
                color={dueDateOptions.color}
                bordered={dueDateOptions.color !== 'default'}
              >
                {dueDateOptions.text}
              </Tag>
            )}
            {!!users?.length && (
              <Space size={4} wrap direction="horizontal" align="center" className="flex justify-end ml-auto mr-0">
                {users.map((user) => (
                  <Tooltip key={user.id} title={user.name}>
                    <Avatar src={user.avatarUrl}>{user.name}</Avatar>
                  </Tooltip>
                ))}
              </Space>
            )}
          </div>
        </Card>
      </ConfigProvider>
    )
  },
  (prev, next) =>
    prev.id === next.id &&
    prev.title === next.title &&
    prev.dueDate === next.dueDate &&
    prev.users?.length === next.users?.length &&
    prev.updatedAt === next.updatedAt,
)

export default ProjectCard
