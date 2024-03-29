import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Avatar, Card, List, Pagination, Skeleton, Space } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'
import { TextField } from '@refinedev/antd'
import { useList } from '@refinedev/core'

import { DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY, DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY } from '~/graphql/queries'
import type { GetFieldsFromList } from '@refinedev/nestjs-query'
import type { DashboardLatestActivitiesAuditsQuery, DashboardLatestActivitiesDealsQuery } from '~/graphql/types'

const createInitialPagination = () => ({
  pageSize: 10,
  total: 0,
  current: 1,
})

const LatestActivities = () => {
  const [pagination, setPagination] = useState(createInitialPagination)
  const { data: audits, isLoading: isAuditsLoading } = useList<GetFieldsFromList<DashboardLatestActivitiesAuditsQuery>>(
    {
      resource: 'audits',
      pagination: { pageSize: pagination.pageSize, current: pagination.current },
      meta: {
        gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
      },
    },
  )

  const auditIdList = useMemo(() => audits?.data.map((item) => item.targetId), [audits?.data])
  const { data: deals, isLoading: isDealsLoading } = useList<GetFieldsFromList<DashboardLatestActivitiesDealsQuery>>({
    resource: 'deals',
    queryOptions: { enabled: !!auditIdList?.length },
    pagination: {
      mode: 'off',
    },
    filters: [{ field: 'id', operator: 'in', value: auditIdList }],
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
    },
  })

  useEffect(() => {
    setPagination({
      ...pagination,
      total: audits?.total || 0,
    })
  }, [audits?.total])

  const isLoading = useMemo(() => isAuditsLoading || isDealsLoading, [isAuditsLoading, isDealsLoading])

  return (
    <Card
      styles={{ header: { padding: '1rem' }, body: { padding: '0 1rem' } }}
      title={
        <div className="flex items-center gap-2">
          <UnorderedListOutlined />
          <TextField className="text-sm ml-2" value="最新活动" />
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({ id: index }))}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={<Skeleton.Avatar active size={48} shape="square" className="rounded-1!" />}
                title={<Skeleton.Button active className="h-4!" />}
                description={<Skeleton.Button active className="w-75! h-4!" />}
              />
            </List.Item>
          )}
        />
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={audits?.data}
            renderItem={(item) => {
              const deal = deals?.data.find((deal) => deal.id === String(item.targetId)) || undefined
              return (
                <List.Item>
                  <List.Item.Meta
                    title={dayjs(deal?.createdAt).format('MMM DD, YYYY - HH:mm')}
                    avatar={
                      <Avatar shape="square" size={48} src={deal?.company.avatarUrl}>
                        {deal?.company.name}
                      </Avatar>
                    }
                    description={
                      <Space size={4}>
                        <TextField value={item?.user?.name} strong />
                        <TextField value={item.action === 'CREATE' ? '创建' : '移动'} />
                        <TextField strong value={deal?.title} />
                        <TextField value="交易" />
                        <TextField value={item.action === 'CREATE' ? '新建' : '即将'} />
                        <TextField strong value={deal?.stage?.title} />
                      </Space>
                    }
                  />
                </List.Item>
              )
            }}
          />
          <Pagination
            className="flex justify-end py-4"
            defaultCurrent={pagination.current}
            total={pagination.total}
            showSizeChanger={false}
            onChange={(page) => setPagination({ ...pagination, current: page })}
          />
        </>
      )}
    </Card>
  )
}

export default LatestActivities
