import React from 'react';
import { Card, Button, Space, Radio, DatePicker, Select } from 'antd';
import { PlusOutlined, CalendarOutlined, TableOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import TableLichHen from './components/TableLichHen';
import FormDatLich from './components/FormDatLich';
import { trangThaiLichHenText } from '@/services/DatLich/LichHen/constants';
import moment from 'moment';

const LichHenPage = () => {
  const { 
    setRecord, 
    setEdit, 
    visibleFormDatLich,
    setVisibleFormDatLich,
    viewMode,
    setViewMode,
    trangThaiFilter,
    setTrangThaiFilter,
    selectedDate,
    setSelectedDate
  } = useModel('datlich.lichhen');

  const handleCreateNew = () => {
    setRecord(undefined);
    setEdit(false);
    setVisibleFormDatLich(true);
  };

  const handleEdit = (record: any) => {
    setRecord(record);
    setEdit(true);
    setVisibleFormDatLich(true);
  };

  return (
    <>
      <Card 
        title="Quản lý lịch hẹn"
        extra={
          <Space>
            <DatePicker
              onChange={(date) => setSelectedDate(date?.format('YYYY-MM-DD'))}
              placeholder="Chọn ngày"
              format="DD/MM/YYYY"
              allowClear
            />
            
            <Select
              placeholder="Trạng thái"
              style={{ width: 150 }}
              onChange={setTrangThaiFilter}
              allowClear
              value={trangThaiFilter}
            >
              {Object.entries(trangThaiLichHenText).map(([key, text]) => (
                <Select.Option key={key} value={key}>
                  {text}
                </Select.Option>
              ))}
            </Select>
            
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNew}>
              Đặt lịch hẹn mới
            </Button>
          </Space>
        }
      >
        {viewMode === 'table' ? (
          <TableLichHen onEdit={handleEdit} />
        ) : (
          <div>Hiển thị lịch sẽ được thêm sau</div>
        )}
      </Card>
      
      <FormDatLich
        visible={visibleFormDatLich}
        onCancel={() => setVisibleFormDatLich(false)}
      />
    </>
  );
};

export default LichHenPage; 