import React from 'react';
import { Table, Space, Button, Tag, Tooltip, Popconfirm, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

interface TableDichVuProps {
  onEdit: (record: any) => void;
}

interface IDichVuRecord {
  _id: string;
  maDichVu: string;
  tenDichVu: string;
  moTa: string;
  giaTien: number;
  thoiGianThucHien: number;
  trangThai: boolean;
  createdAt: string;
  updatedAt: string;
}

const TableDichVu: React.FC<TableDichVuProps> = ({ onEdit }) => {
  const { data, loading, deleteModel } = useModel('datlich.dichvu');

  const handleDelete = async (id: string) => {
    await deleteModel(id);
  };

  const columns = [
    {
      title: 'Mã dịch vụ',
      dataIndex: 'maDichVu',
      key: 'maDichVu',
      sorter: (a: IDichVuRecord, b: IDichVuRecord) => a.maDichVu.localeCompare(b.maDichVu),
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'tenDichVu',
      key: 'tenDichVu',
      sorter: (a: IDichVuRecord, b: IDichVuRecord) => a.tenDichVu.localeCompare(b.tenDichVu),
    },
    {
      title: 'Giá tiền',
      dataIndex: 'giaTien',
      key: 'giaTien',
      render: (giaTien: number) => (
        <Tag color="blue">{giaTien.toLocaleString('vi-VN')} đ</Tag>
      ),
      sorter: (a: IDichVuRecord, b: IDichVuRecord) => a.giaTien - b.giaTien,
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: 'thoiGianThucHien',
      key: 'thoiGianThucHien',
      render: (thoiGian: number) => `${thoiGian} phút`,
      sorter: (a: IDichVuRecord, b: IDichVuRecord) => a.thoiGianThucHien - b.thoiGianThucHien,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: boolean) => (
        <Tag color={trangThai ? 'green' : 'red'}>
          {trangThai ? 'Hoạt động' : 'Tạm ngưng'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record: IDichVuRecord) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(record)} size="small" />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa dịch vụ này?"
              onConfirm={() => handleDelete(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Danh sách dịch vụ" bordered={false} style={{ borderRadius: 10, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
      />
    </Card>
  );
};

export default TableDichVu;
