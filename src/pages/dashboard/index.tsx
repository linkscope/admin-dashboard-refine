import { Row, Col } from 'antd'

const Dashboard = () => {
  return (
    <div>
      <Row gutter={[32, 32]} className="mt-8">
        <Col xs={24} sm={24} xl={8} className="h-120">
          日历更新
        </Col>
        <Col xs={24} sm={24} xl={8} className="h-120">
          仪表盘图表
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
