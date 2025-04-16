import React, { useState } from 'react';
import { Card, Button, Input, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import TableDichVu from './components/TableDichVu';
import FormDichVu from './components/FormDichVu';


const DichVuPage = () => {
  const [visibleForm, setVisibleForm] = useState(false);
  const { setRecord, setEdit } = useModel('datlich.dichvu');

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

  const handleCancel = () => {
    setVisibleForm(false);
  };

  return (
    <Card 
      title="Quản lý dịch vụ"
      extra={
        <Space>
          <Input 
            placeholder="Tìm kiếm dịch vụ" 
            prefix={<SearchOutlined />} 
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showFormAdd}>
            Thêm dịch vụ mới
          </Button>
        </Space>
      }
    >
      <TableDichVu onEdit={showFormEdit} />
      <FormDichVu visible={visibleForm} onCancel={handleCancel} />
    </Card>
  );
};

export default DichVuPage; 