// src/pages/Admin/Statistics/index.tsx (Admin - Xem Thống Kê)
import React, { useEffect } from 'react';
import type { Dispatch } from 'umi'; // Giữ nguyên import từ umi
import { connect } from 'umi';      // Giữ nguyên import từ umi
import { Card, Row, Col, Spin, List, Typography } from 'antd'; // Giữ nguyên import từ antd
import type { AdminStatisticsModelState } from '@/models/adminStatistics'; // Giữ nguyên import type
import styles from '../index.less'; // Giữ nguyên import CSS Module (nếu dùng)

const { Text } = Typography; // Giữ nguyên

// Interface giữ nguyên tên tiếng Anh
interface StatisticsAdminProps {
  dispatch: Dispatch;
  adminStatistics: AdminStatisticsModelState;
}

// Tên component giữ nguyên
const StatisticsAdmin: React.FC<StatisticsAdminProps> = ({ dispatch, adminStatistics }) => {
  // Tên biến giữ nguyên
  const { stats, loading } = adminStatistics;

  useEffect(() => {
    // Comment có thể dịch
    // Lấy dữ liệu thống kê khi component được mount
    dispatch({ type: 'adminStatistics/fetchStats' }); // Type của dispatch giữ nguyên
  }, [dispatch]); // Dependency array giữ nguyên

  // --- Placeholder cho Biểu đồ ---
  // Comment có thể dịch:
  // Một lần nữa, các biểu đồ như biểu đồ cột cho xu hướng hàng tháng hoặc điểm đến phổ biến
  // sẽ yêu cầu thư viện như @ant-design/charts. Chúng ta sẽ hiển thị dữ liệu đơn giản.

  // Tên biến giữ nguyên
  const popularDestinations = stats?.popularDestinations || [];
  const itinerariesByMonth = stats?.itinerariesByMonth || {};

  return (
    // Nếu bạn đã xóa className={styles.statisticsPage} ở bước trước thì giữ nguyên là <div>
    // Nếu bạn vẫn dùng thì giữ nguyên:
    <div className={styles.statisticsPage}>
        <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    {/* Tiêu đề Card dịch */}
                    <Card title="Lịch trình được tạo theo tháng">
                        {Object.keys(itinerariesByMonth).length > 0 ? (
                            <List
                                size="small"
                                // header={<div>Tháng - Số lượng</div>} // Header tùy chọn (đã comment)
                                dataSource={Object.entries(itinerariesByMonth)}
                                renderItem={([month, count]: [string, number]) => (
                                    <List.Item>
                                         {/* Text hiển thị dịch */}
                                         <Text strong>{month}:</Text> {count} lịch trình
                                    </List.Item>
                                )}
                            />
                        ) : (
                             // Text hiển thị dịch
                             <Text type="secondary">Không có dữ liệu theo tháng.</Text>
                        )}
                        {/* Placeholder cho biểu đồ (dịch) */}
                         <div style={{ marginTop: 16, color: '#aaa', textAlign: 'center' }}>(Trực quan hóa bằng biểu đồ cột sẽ ở đây)</div>
                    </Card>
                </Col>
                 <Col xs={24} md={12}>
                     {/* Tiêu đề Card dịch */}
                    <Card title="Điểm đến phổ biến nhất">
                         {popularDestinations.length > 0 ? (
                             <List
                                size="small"
                                dataSource={popularDestinations}
                                renderItem={(item: { name: string, count: number }, index: number) => (
                                     <List.Item>
                                         {/* Text hiển thị dịch */}
                                         <Text strong>{index + 1}. {item.name}:</Text> {item.count} lượt bao gồm
                                    </List.Item>
                                )}
                            />
                         ) : (
                            // Text hiển thị dịch
                            <Text type="secondary">Không có dữ liệu về độ phổ biến.</Text>
                         )}
                         {/* Placeholder cho biểu đồ (dịch) */}
                         <div style={{ marginTop: 16, color: '#aaa', textAlign: 'center' }}>(Trực quan hóa bằng biểu đồ tròn hoặc cột sẽ ở đây)</div>
                    </Card>
                </Col>
                 {/* Comment có thể dịch: Thêm các thẻ thống kê khác nếu cần */}
                 {/* <Col xs={24}>
                     <Card title="Thống kê chung"> // Tiêu đề dịch
                        <Row gutter={16}>
                            <Col span={8}><Statistic title="Tổng số điểm đến" value={stats?.totalDestinations || 0} /></Col> // Tiêu đề Statistic dịch
                            <Col span={8}><Statistic title="Tổng số lịch trình" value={stats?.totalItineraries || 0} /></Col> // Tiêu đề Statistic dịch
                        </Row>
                    </Card>
                 </Col> */}
            </Row>
        </Spin>
    </div>
  );
};

// Phần connect giữ nguyên cấu trúc
export default connect(({ adminStatistics }: { adminStatistics: AdminStatisticsModelState }) => ({
  adminStatistics,
}))(StatisticsAdmin);