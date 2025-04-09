import React, { useState } from 'react';
import { Card, Button, Input, Space, Modal } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import TableNhanVien from './components/TableNhanVien';
import FormNhanVien from './components/FormNhanVien';
import LichLamViec from './components/LichLamViec';

const NhanVienPage = () => {
  const [visibleForm, setVisibleForm] = useState(false);
  const [visibleLichLamViec, setVisibleLichLamViec] = useState(false);
  const { setRecord, setEdit } = useModel('datlich.nhanvien');
  const [selectedNhanVien, setSelectedNhanVien] = useState<any>(null);

  const showFormAdd = () => {
    setRecord(undefined);
    setEdit(false);
    setVisibleForm(true);
  };

  const showFormEdit = (record: any) => {
    setRecord(record);
    setEdit(true);
    setVisibleForm(true);
  };

  const showLichLamViec = (record: any) => {
    setSelectedNhanVien(record);
    setVisibleLichLamViec(true);
  };

  const handleCancel = () => {
    setVisibleForm(false);
  };

  const handleCancelLichLamViec = () => {
    setVisibleLichLamViec(false);
  };

  return (
    <Card 
      title="Quản lý nhân viên"
      extra={
        <Space>
          <Input 
            placeholder="Tìm kiếm nhân viên" 
            prefix={<SearchOutlined />} 
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showFormAdd}>
            Thêm nhân viên mới
          </Button>
        </Space>
      }
    >
      <TableNhanVien onEdit={showFormEdit} onViewSchedule={showLichLamViec} />
      <FormNhanVien visible={visibleForm} onCancel={handleCancel} />
      
    </Card>
  );
};

export default NhanVienPage; 