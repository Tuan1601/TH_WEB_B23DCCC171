// src/pages/Admin/index.tsx (Trang Quản trị chính với Tabs)
import React from 'react';
import { Tabs, Card } from 'antd'; // Giữ nguyên import từ antd
import DestinationsAdmin from './Destinations'; // Giữ nguyên import component con
import StatisticsAdmin from './Statistics';   // Giữ nguyên import component con
import styles from './index.less'; // Giữ nguyên import CSS Module (nếu dùng)

const { TabPane } = Tabs; // Giữ nguyên

// Tên component giữ nguyên
const AdminPage: React.FC = () => {
  return (
    // Nếu bạn không dùng CSS Module thì xóa className
    <div className={styles.adminPage}>
        <Card>
            <Tabs defaultActiveKey="1">
                {/* Tab title dịch sang tiếng Việt */}
                <TabPane tab="Quản lý Điểm đến" key="1">
                    <DestinationsAdmin />
                </TabPane>
                {/* Tab title dịch sang tiếng Việt */}
                <TabPane tab="Xem Thống kê" key="2">
                    <StatisticsAdmin />
                </TabPane>
                {/* Comment có thể dịch: Thêm các khu vực quản trị khác nếu cần */}
            </Tabs>
        </Card>
    </div>
  );
};

export default AdminPage; // Giữ nguyên export