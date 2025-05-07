import { Row, Col, Card, Statistic } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';

function TaskStatistics({ statistics }) {
  return (
    <Row gutter={16} className="statistics-row">
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Tổng số công việc"
            value={statistics.total}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Chưa làm"
            value={statistics.notStarted}
            valueStyle={{ color: '#d9d9d9' }}
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Đang làm"
            value={statistics.inProgress}
            valueStyle={{ color: '#fa8c16' }}
            prefix={<ExclamationCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Đã hoàn thành"
            value={statistics.completed}
            valueStyle={{ color: '#52c41a' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default TaskStatistics;