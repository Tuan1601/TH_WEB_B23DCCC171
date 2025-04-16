import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Row, Statistic, Progress, Spin, message } from 'antd';  
import { PageContainer } from '@ant-design/pro-layout';  
import { Application, ASPIRATIONS, GROUPS, queryApplications } from '@/services/application';  

 
interface DashboardStats {
  totalApplications: number;
  applicationsByAspiration: Record<string, number>;  
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  approvalRate: number;
  rejectionRate: number;
  membersByGroup: Record<string, number>;  
  totalMembers: number;
}

const Dashboard: React.FC = () => {
  
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

 
  useEffect(() => {
    const fetchAllDataForStats = async () => {
      setLoading(true);
      try {
        
        const response = await queryApplications({ pageSize: 10000 });  

        if (response && response.success) {
        
          setAllApplications(response.data);
        } else {
          message.error('Lỗi: Không thể tải dữ liệu thống kê.');
          setAllApplications([]);  
        }
      } catch (error) {
        console.error('Lỗi fetch dữ liệu dashboard:', error);
        message.error('Đã xảy ra lỗi khi tải dữ liệu thống kê.');
        setAllApplications([]);
      } finally {
        setLoading(false);  
      }
    };

    fetchAllDataForStats();
  }, []);  

   
  const stats: DashboardStats = useMemo(() => {
  
    const defaultStats: DashboardStats = {
      totalApplications: 0,
      applicationsByAspiration: {},
      approvedCount: 0,
      rejectedCount: 0,
      pendingCount: 0,
      approvalRate: 0,
      rejectionRate: 0,
      membersByGroup: {},
      totalMembers: 0,
    };

    if (!allApplications || allApplications.length === 0) {
      return defaultStats;
    }

     
    const totalApplications = allApplications.length;

    
    const applicationsByAspiration = ASPIRATIONS.reduce((acc, asp) => {
      acc[asp.value] = allApplications.filter(app => app.aspiration === asp.value).length;
      return acc;
    }, {} as Record<string, number>);

 
    const approvedCount = allApplications.filter(app => app.status === 'approved').length;
    const rejectedCount = allApplications.filter(app => app.status === 'rejected').length;
    const pendingCount = totalApplications - approvedCount - rejectedCount;  

  
    const decidedCount = approvedCount + rejectedCount;
    const approvalRate = decidedCount > 0 ? Math.round((approvedCount / decidedCount) * 100) : 0;
    const rejectionRate = decidedCount > 0 ? 100 - approvalRate : 0;  

    
    const members = allApplications.filter(app => app.status === 'approved');
    const totalMembers = members.length;
    const membersByGroup = GROUPS.reduce((acc, group) => {
      acc[group.value] = members.filter(mem => mem.group === group.value).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalApplications,
      applicationsByAspiration,
      approvedCount,
      rejectedCount,
      pendingCount,
      approvalRate,
      rejectionRate,
      membersByGroup,
      totalMembers,
    };
  }, [allApplications]); 

  
  if (loading) {
    return (
      <PageContainer title="Báo cáo & Thống kê">
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Báo cáo & Thống kê">
      <Row gutter={[16, 16]}>
      
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic title="Tổng số đơn" value={stats.totalApplications} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic title="Đang chờ xử lý" value={stats.pendingCount} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic title="Đã duyệt" value={stats.approvedCount} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic title="Đã từ chối" value={stats.rejectedCount} />
          </Card>
        </Col>

    
        <Col xs={24} sm={12} md={8}>
          <Card title="Tỷ lệ xử lý đơn">
            {stats.approvedCount + stats.rejectedCount > 0 ? (
              <>
                <Progress percent={stats.approvalRate} status="success" format={percent => `${percent}% Duyệt`} />
                <Progress percent={stats.rejectionRate} status="exception" format={percent => `${percent}% Từ chối`} style={{ marginTop: 8 }} />
              </>
            ) : (
              <p>Chưa có đơn nào được xử lý.</p>
            )}
          </Card>
        </Col>

      
        <Col xs={24} md={16}>
          <Card title="Số lượng đơn theo Nguyện vọng">
            <Row gutter={[16, 0]}>
              {ASPIRATIONS.map(asp => (
                <Col key={asp.value} xs={24} sm={8}>
                  <Statistic title={asp.label} value={stats.applicationsByAspiration[asp.value] ?? 0} />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

    
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Tổng số thành viên" value={stats.totalMembers} />
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="Số lượng thành viên theo Nhóm">
             {stats.totalMembers > 0 ? (
                 <Row gutter={[16, 0]}>
                    {GROUPS.map(group => (
                        <Col key={group.value} xs={24} sm={8}>
                        <Statistic title={`Team ${group.label}`} value={stats.membersByGroup[group.value] ?? 0} />
                        </Col>
                    ))}
                </Row>
             ) : (
                 <p>Chưa có thành viên nào.</p>
             )}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

 
export default Dashboard;