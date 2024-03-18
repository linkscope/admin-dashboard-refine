import { useCustom } from '@refinedev/core'
import { Row, Col } from 'antd'

import { DASHBOARD_TOTAL_COUNTS_QUERY } from '~/graphql/queries'
import type { DashboardTotalCountsQuery } from '~/graphql/types'

import { Agenda, DealsChart, TotalCountCard, LatestActivities } from './components'

const Dashboard = () => {
  const { data, isLoading } = useCustom<DashboardTotalCountsQuery>({
    url: '',
    method: 'get',
    meta: {
      gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY,
    },
  })

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8}>
          <TotalCountCard
            resource="companies"
            isLoading={isLoading}
            totalCount={data?.data.companies.totalCount || 0}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <TotalCountCard resource="contacts" isLoading={isLoading} totalCount={data?.data.contacts.totalCount || 0} />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <TotalCountCard resource="deals" isLoading={isLoading} totalCount={data?.data.deals.totalCount || 0} />
        </Col>
      </Row>
      <Row gutter={[32, 32]} className="mt-8">
        <Col xs={24} sm={24} xl={8} className="h-120">
          <Agenda />
        </Col>
        <Col xs={24} sm={24} xl={16} className="h-120">
          <DealsChart />
        </Col>
      </Row>
      <Row gutter={[32, 32]} className="mt-8">
        <Col xs={24}>
          <LatestActivities />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
