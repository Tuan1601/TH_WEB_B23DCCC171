import React, { useEffect } from 'react';
import type { Dispatch } from 'umi'; 
import { connect } from 'umi';     
import { Card, Row, Col, Spin, List, Typography } from 'antd'; 
import type { AdminStatisticsModelState } from '@/models/adminStatistics'; 
import styles from '../index.less'; 

const { Text } = Typography; 

interface StatisticsAdminProps {
  dispatch: Dispatch;
  adminStatistics: AdminStatisticsModelState;
}

const StatisticsAdmin: React.FC<StatisticsAdminProps> = ({ dispatch, adminStatistics }) => {
  const { stats, loading } = adminStatistics;

  useEffect(() => {
    dispatch({ type: 'adminStatistics/fetchStats' }); 
  }, [dispatch]); 

  const popularDestinations = stats?.popularDestinations || [];
  const itinerariesByMonth = stats?.itinerariesByMonth || {};

  return (
    <div className={styles.statisticsPage}>
        <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Lịch trình được tạo theo tháng">
                        {Object.keys(itinerariesByMonth).length > 0 ? (
                            <List
                                size="small"
                                dataSource={Object.entries(itinerariesByMonth)}
                                renderItem={([month, count]: [string, number]) => (
                                    <List.Item>
                                         <Text strong>{month}:</Text> {count} lịch trình
                                    </List.Item>
                                )}
                            />
                        ) : (
                             <Text type="secondary">Không có dữ liệu theo tháng.</Text>
                        )}
                         <div style={{ marginTop: 16, color: '#aaa', textAlign: 'center' }}>(Trực quan hóa bằng biểu đồ cột sẽ ở đây)</div>
                    </Card>
                </Col>
                 <Col xs={24} md={12}>
                    <Card title="Điểm đến phổ biến nhất">
                         {popularDestinations.length > 0 ? (
                             <List
                                size="small"
                                dataSource={popularDestinations}
                                renderItem={(item: { name: string, count: number }, index: number) => (
                                     <List.Item>
                                         <Text strong>{index + 1}. {item.name}:</Text> {item.count} lượt bao gồm
                                    </List.Item>
                                )}
                            />
                         ) : (
                            <Text type="secondary">Không có dữ liệu về độ phổ biến.</Text>
                         )}
                         {/* Placeholder cho biểu đồ (dịch) */}
                         <div style={{ marginTop: 16, color: '#aaa', textAlign: 'center' }}>(Trực quan hóa bằng biểu đồ tròn hoặc cột sẽ ở đây)</div>
                    </Card>
                </Col>
            </Row>
        </Spin>
    </div>
  );
};

export default connect(({ adminStatistics }: { adminStatistics: AdminStatisticsModelState }) => ({
  adminStatistics,
}))(StatisticsAdmin);