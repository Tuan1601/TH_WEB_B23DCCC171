import { Layout, Typography, Space, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import './Header.css';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

function Header({ currentUser, onLogout }) {
  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: onLogout,
    }
  ];

  return (
    <AntHeader className="app-header">
      <div className="header-logo">
        <Title level={4} style={{ margin: 0 }}>Quản lý Công việc Nhóm</Title>
      </div>

      <div className="header-user">
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Space className="dropdown-trigger" style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span className="username">{currentUser}</span>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  );
}

export default Header;
