import { Row, Col } from 'antd'

import { Agenda, DealsChart } from './components'

const Dashboard = () => {
  return (
    <div>
      <Row gutter={[32, 32]} className="mt-8">
        <Col xs={24} sm={24} xl={8} className="h-120">
          <Agenda />
        </Col>
        <Col xs={24} sm={24} xl={8} className="h-120">
          <DealsChart />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
