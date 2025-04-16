import React, { useState } from 'react';
import { Table, Select, Button } from 'antd';
import { storageService } from '../../../models/QuanLyClb/QuanLyClb';
import * as XLSX from 'xlsx';

const ThanhVien: React.FC = () => {
  const [members, setMembers] = useState(storageService.getMembers());

  const handleTeamChange = (id: string, value: string) => {
    const member = members.find(m => m.id === id);
    if (member) {
      const updated = { ...member, team: value as any };
      storageService.updateMember(updated);
      setMembers(storageService.getMembers());
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(members);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Members');
    XLSX.writeFile(wb, 'members.xlsx');
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Vai trò', dataIndex: 'role' },
    {
      title: 'Nhóm',
      dataIndex: 'team',
      render: (team: string, record: any) => (
        <Select
          value={team}
          onChange={(value) => handleTeamChange(record.id, value)}
          style={{ width: 120 }}
        >
          <Select.Option value="Team Design">Team Design</Select.Option>
          <Select.Option value="Team Dev">Team Dev</Select.Option>
          <Select.Option value="Team Media">Team Media</Select.Option>
        </Select>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Button onClick={exportToExcel} style={{ marginBottom: 16 }}>
        Export Excel
      </Button>
      <Table
        columns={columns}
        dataSource={members}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default ThanhVien;