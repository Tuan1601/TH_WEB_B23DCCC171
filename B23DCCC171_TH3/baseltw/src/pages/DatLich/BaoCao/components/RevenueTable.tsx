import { Table } from 'antd';
import React from 'react';

interface RevenueTableProps {
  title: string;
  data: Record<string, number>;
}

const RevenueTable: React.FC<RevenueTableProps> = ({ title, data }) => {
  const columns = [
    { title: title, dataIndex: 'key', key: 'key' },
    { title: 'Doanh thu', dataIndex: 'value', key: 'value' },
  ];

  const dataSource = Object.entries(data).map(([key, value]) => ({ key, value }));

  return (
    <>
      <h3>Doanh thu theo {title.toLowerCase()}</h3>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </>
  );
};

export default RevenueTable;