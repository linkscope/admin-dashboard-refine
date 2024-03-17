import { memo, useCallback, useMemo } from 'react'
import { useList } from '@refinedev/core'
import dayjs from 'dayjs'
import { Card } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import { TextField } from '@refinedev/antd'
import { Area } from '@ant-design/plots'
import type { AreaConfig } from '@ant-design/plots'
import type { GetFieldsFromList } from '@refinedev/nestjs-query'
import type { DashboardDealsChartQuery } from '~/graphql/types'

import { DASHBOARD_DEALS_CHART_QUERY } from '~/graphql/queries'

type DealsAggregate = GetFieldsFromList<DashboardDealsChartQuery>['dealsAggregate'][0]

const DealsChart = memo(() => {
  const { data } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource: 'dealStages',
    filters: [
      {
        field: 'title',
        operator: 'in',
        value: ['WON', 'LOST'],
      },
    ],
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
    },
  })

  const normalizeDealsData = useCallback(() => {
    const dealsData = data?.data || []
    const won = dealsData.find((item) => item.title === 'WON')
    const lost = dealsData.find((item) => item.title === 'LOST')

    const groupBy = (deals: DealsAggregate[], title: string) => {
      return deals
        .filter((item) => item.groupBy?.closeDateMonth && item.groupBy.closeDateYear)
        .map((item) => {
          const { closeDateYear, closeDateMonth } = item.groupBy as NonNullable<DealsAggregate['groupBy']>
          const date = dayjs(`${closeDateYear}-${closeDateMonth}-01`)
          return {
            timeUnix: date.unix(),
            timeText: date.format('MMM YYYY'),
            value: item.sum?.value ?? 0,
            title,
          }
        })
    }

    const wonDeals = groupBy(won?.dealsAggregate || [], '赢')
    const lostDeals = groupBy(lost?.dealsAggregate || [], '输')

    return [...wonDeals, ...lostDeals].sort((a, b) => a.timeUnix - b.timeUnix)
  }, [data?.data])

  const areaConfig = useMemo<AreaConfig>(
    () => ({
      data: normalizeDealsData(),
      xField: 'timeText',
      yField: 'value',
      isStack: false,
      seriesField: 'title',
      animation: true,
      startOnZero: false,
      smooth: true,
      legend: {
        offsetY: -6,
      },
      yAxis: {
        tickCount: 6,
        label: {
          formatter: (v: string) => `$${Number(v) / 1000}k`,
        },
      },
      tooltip: {
        formatter: (data) => ({
          name: data.title,
          value: `$${Number(data.value) / 1000}k`,
        }),
      },
    }),
    [data?.data],
  )

  return (
    <Card
      className="h-full"
      styles={{
        header: { padding: '0.5rem 1rem' },
        body: { padding: '1.5rem 1.5rem 0 1.5rem' },
      }}
      title={
        <div className="flex items-center gap-2">
          <DollarOutlined />
          <TextField className="text-sm ml-2" value="交易" />
        </div>
      }
    >
      <Area {...areaConfig} height={375} />
    </Card>
  )
})

export default DealsChart
