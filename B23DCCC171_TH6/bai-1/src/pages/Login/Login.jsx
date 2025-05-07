import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTasks } from '../../contexts/TaskContext';
import './Login.css';

const { Title } = Typography;
const { Content } = Layout;

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const { addTeamMember } = useTasks();

  const handleSubmit = () => {
    if (username.trim()) {
      // Thêm người dùng vào danh sách thành viên
      addTeamMember(username);
      
      // Gọi hàm đăng nhập từ component cha
      onLogin(username);
    }
  };

  return (
    <Layout className="login-layout">
      <Content className="login-content">
        <Card className="login-card">
          <Title level={2} className="login-title">Đăng nhập</Title>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên của bạn"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}

export default Login;