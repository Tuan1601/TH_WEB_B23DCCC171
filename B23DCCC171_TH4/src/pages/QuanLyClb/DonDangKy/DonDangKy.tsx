// src/pages/RegistrationManagement.tsx
import React, { useState } from 'react';
import { Table, Button, Modal, Input, Space } from 'antd';
import { storageService } from '../../../models/QuanLyClb/QuanLyClb';
import { Registration } from '../../../services/QuanLyClb/typing';

const DonDangKy: React.FC = () => {
  const [registrations, setRegistrations] = useState(storageService.getRegistrations());
  const [note, setNote] = useState('');

  const handleStatusChange = (record: Registration, status: 'approved' | 'rejected') => {
    Modal.confirm({
      title: `Xác nhận ${status === 'approved' ? 'duyệt' : 'từ chối'} đơn`,
      content: status === 'rejected' && (
        <Input.TextArea
          placeholder="Nhập lý do từ chối"
          onChange={(e) => setNote(e.target.value)}
        />
      ),
      onOk: () => {
        const updated = {
          ...record,
          status,
          note: status === 'rejected' ? note : undefined,
          log: `Admin đã ${status} vào lúc ${new Date().toLocaleString()} ${status === 'rejected' ? `với lý do: ${note}` : ''}`
        };
        
        storageService.updateRegistration(updated);
        if (status === 'approved') {
          storageService.saveMember({
            ...record,
            role: 'Member',
            team: `Team ${record.aspiration.charAt(0).toUpperCase() + record.aspiration.slice(1)}` as any
          });
        }
        setRegistrations(storageService.getRegistrations());
        setNote('');
      }
    });
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName', sorter: (a: Registration, b: Registration) => a.fullName.localeCompare(b.fullName) },
    { title: 'Email', dataIndex: 'email', sorter: (a: Registration, b: Registration) => a.email.localeCompare(b.email) },
    { title: 'Nguyện vọng', dataIndex: 'aspiration' },
    { title: 'Lý do', dataIndex: 'reason' },
    { title: 'Trạng thái', dataIndex: 'status' },
    {
      title: 'Hành động',
      render: (_: any, record: Registration) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button onClick={() => handleStatusChange(record, 'approved')}>Duyệt</Button>
              <Button danger onClick={() => handleStatusChange(record, 'rejected')}>Từ chối</Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={registrations}
      pagination={{ pageSize: 10 }}
      rowKey="id"
      scroll={{ x: 'max-content' }}
    />
  );
};

export default DonDangKy;