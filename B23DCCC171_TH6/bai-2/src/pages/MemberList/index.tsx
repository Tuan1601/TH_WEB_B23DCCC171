import React, { useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { Table, Select, Button, Card, Space, message } from 'antd';
import { Member, GROUPS } from '@/services/application';  
import { MembersModelState } from '@/models/members';  
import { PageContainer } from '@ant-design/pro-layout';

 

const { Option } = Select;

interface MemberListProps {
  dispatch: Dispatch;
  members: MembersModelState;
}

const MemberList: React.FC<MemberListProps> = ({ dispatch, members }) => {
  const { list, pagination, loading } = members;

  useEffect(() => {
    dispatch({
      type: 'members/fetch',
      payload: { current: 1, pageSize: 10 },  
    });
  }, [dispatch]);

  const handleTableChange = (paginationParams: any, filters: any, sorter: any) => {
    
    dispatch({
      type: 'members/fetch',
      payload: {
        current: paginationParams.current,
        pageSize: paginationParams.pageSize,
        
      },
    });
  };

  const handleGroupChange = (memberId: string, newGroup: 'design' | 'dev' | 'media') => {
      console.log(`Changing group for ${memberId} to ${newGroup}`);
      dispatch({
          type: 'members/updateGroup',
          payload: { id: memberId, group: newGroup },
      });
  };

  const handleExport = () => {
    message.info('Export functionality requires the `xlsx` library. See console for data.');
    console.log('Data to export:', list);  

     
     if (!list || list.length === 0) {
        message.warning('No data to export.');
        return;
    }
     try {
        const header = ['Họ tên', 'Email', 'Vai trò', 'Nhóm'];
        const csvData = list.map(member => ([
             `"${member.name.replace(/"/g, '""')}"`,  
             `"${member.email.replace(/"/g, '""')}"`,
             '"Member"',  
             `"${GROUPS.find(g => g.value === member.group)?.label || member.group || 'N/A'}"`
         ].join(',')));  

         const csvContent = [header.join(','), ...csvData].join('\n');

         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
         const link = document.createElement('a');
         if (link.download !== undefined) {  
             const url = URL.createObjectURL(blob);
             link.setAttribute('href', url);
             link.setAttribute('download', 'MemberList.csv');
             link.style.visibility = 'hidden';
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
             message.success('CSV file download initiated.');
         } else {
            message.error('CSV download not supported by your browser.');
         }

     } catch(error) {
        console.error("CSV Export error:", error);
        message.error('Failed to generate CSV data.');
     }
     
  };


  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',  
      key: 'role',
      render: () => 'Member',
    },
    {
      title: 'Nhóm',
      dataIndex: 'group',
      key: 'group',
      filters: GROUPS.map(g => ({ text: g.label, value: g.value })),
      render: (group: 'design' | 'dev' | 'media', record: Member) => (
        <Select
          value={group}
          style={{ width: 150 }}
          onChange={(value) => handleGroupChange(record.id, value)}
          bordered={false}  
        >
          {GROUPS.map(g => (
            <Option key={g.value} value={g.value}>{g.label}</Option>
          ))}
        </Select>
      ),
    },
   
  ];

  return (
    <PageContainer title="Quản lý thành viên">
        <Card bordered={false}>
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={handleExport}>
                    Export to XLSX / CSV
                </Button>
                
            </Space>
            <Table
                columns={columns}
                dataSource={list}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
            />
        </Card>
    </PageContainer>
  );
};

export default connect(({ members }: { members: MembersModelState }) => ({
  members,
}))(MemberList);