// src/pages/Reports.tsx
import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { storageService } from '../../../models/QuanLyClb/QuanLyClb';

const BaoCao: React.FC = () => {
  const registrations = storageService.getRegistrations();
  const members = storageService.getMembers();

  const aspirationStats = {
    design: registrations.filter(r => r.aspiration === 'design').length,
    dev: registrations.filter(r => r.aspiration === 'dev').length,
    media: registrations.filter(r => r.aspiration === 'media').length
  };

  const statusStats = {
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
    pending: registrations.filter(r => r.status === 'pending').length
  };

  const teamStats = {
    design: members.filter(m => m.team === 'Team Design').length,
    dev: members.filter(m => m.team === 'Team Dev').length,
    media: members.filter(m => m.team === 'Team Media').length
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card title="Thống kê nguyện vọng">
            <Statistic title="Design" value={aspirationStats.design} />
            <Statistic title="Development" value={aspirationStats.dev} />
            <Statistic title="Media" value={aspirationStats.media} />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card title="Tỉ lệ xử lý">
            <Statistic title="Đã duyệt" value={statusStats.approved} />
            <Statistic title="Từ chối" value={statusStats.rejected} />
            <Statistic title="Đang chờ" value={statusStats.pending} />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card title="Thành viên theo nhóm">
            <Statistic title="Team Design" value={teamStats.design} />
            <Statistic title="Team Dev" value={teamStats.dev} />
            <Statistic title="Team Media" value={teamStats.media} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BaoCao;