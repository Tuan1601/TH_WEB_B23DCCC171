import React from 'react';
import { Tabs, Card } from 'antd'; 
import DestinationsAdmin from './Destinations';
import StatisticsAdmin from './Statistics';   
import styles from './index.less'; 

const { TabPane } = Tabs; 

const AdminPage: React.FC = () => {
  return (
    <div className={styles.adminPage}>
        <Card>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Quản lý Điểm đến" key="1">
                    <DestinationsAdmin />
                </TabPane>
                <TabPane tab="Xem Thống kê" key="2">
                    <StatisticsAdmin />
                </TabPane>
            </Tabs>
        </Card>
    </div>
  );
};

export default AdminPage; 