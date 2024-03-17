import { useCallback } from 'react'
import dayjs from 'dayjs'
import { useList } from '@refinedev/core'
import { Card, Skeleton, List, Badge } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import { TextField } from '@refinedev/antd'

import { DASHBORAD_CALENDAR_UPCOMING_EVENTS_QUERY } from '~/graphql/queries'

const Agenda = () => {
  const { data, isLoading } = useList({
    resource: 'events',
    pagination: { pageSize: 5 },
    sorters: [
      {
        field: 'startDate',
        order: 'asc',
      },
    ],
    filters: [
      {
        field: 'startDate',
        operator: 'gte',
        value: dayjs().format('YYYY-MM-DD'),
      },
    ],
    meta: {
      gqlQuery: DASHBORAD_CALENDAR_UPCOMING_EVENTS_QUERY,
    },
  })

  const renderDate = useCallback((start: string, end: string) => {
    return `${dayjs(start).format('MMM DD, YYYY - HH:mm')} - ${dayjs(end).format('MMM DD, YYYY - HH:mm')}`
  }, [])

  return (
    <Card
      className="h-full"
      styles={{ header: { padding: '0.5rem 1rem' }, body: { padding: '0 1rem' } }}
      title={
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <TextField value="日程" className="text-sm ml-3" />
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({ index }))}
          renderItem={() => (
            <List.Item>
              <List.Item.Meta
                avatar={<Badge color="transparent" />}
                title={<Skeleton.Button active className="h-4!" />}
                description={<Skeleton.Button active className="w-75! mt-2! h-4!" />}
              />
            </List.Item>
          )}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={data?.data || []}
          renderItem={(item) => {
            const date = renderDate(item.startDate, item.endDate)

            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color={item.color} />}
                  title={<TextField className="text-xs" value={date} />}
                  description={<TextField ellipsis={{ tooltip: true }} strong value={item.title} />}
                />
              </List.Item>
            )
          }}
        />
      )}

      {!isLoading && data?.data.length === 0 && <span className="flex items-center justify-center h-55">没有日程</span>}
    </Card>
  )
}

export default Agenda
