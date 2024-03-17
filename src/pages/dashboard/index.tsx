import { Row, Col } from 'antd'

import { Agenda } from './components'

const Dashboard = () => {
  return (
    <div>
      <Row gutter={[32, 32]} className="mt-8">
        <Col xs={24} sm={24} xl={8} className="h-115">
          <Agenda />
        </Col>
        <Col xs={24} sm={24} xl={8} className="h-115">
          仪表盘图表
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
