import React, { useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { Table, Tag, Button, Space, Input, Modal, Form, Select, Card, Tooltip, Popover } from 'antd';
import { Application, ASPIRATIONS } from '@/services/application';  
import { ApplicationsModelState } from '@/models/applications';  
import { PageContainer } from '@ant-design/pro-layout';  

const { TextArea } = Input;
const { Option } = Select;

interface ApplicationListProps {
  dispatch: Dispatch;
  applications: ApplicationsModelState;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ dispatch, applications }) => {
  const { list, pagination, loading, filterParams } = applications;
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<Application | null>(null);
  const [rejectForm] = Form.useForm();

  
  useEffect(() => {
    dispatch({
      type: 'applications/fetch',
      payload: { current: 1, pageSize: 10 }, 
    });
  }, [dispatch]);

  const handleTableChange = (
      paginationParams: any,
      filters: any,
      sorter: any
    ) => {
     
      let sortParam = undefined;
      if (sorter.field && sorter.order) {
          sortParam = `${sorter.field}_${sorter.order}`; 
      }

    dispatch({
        type: 'applications/setFilterParams',  
        payload: { ...filterParams, aspiration: filters.aspiration?.join(','), sorter: sortParam }
    });

    dispatch({
      type: 'applications/fetch',
      payload: {
        current: paginationParams.current,
        pageSize: paginationParams.pageSize,
         
         aspiration: filters.aspiration?.join(','),  
         sorter: sortParam,
          
         name: filterParams?.name,
         email: filterParams?.email,
      },
    });
  };

  const handleApprove = (record: Application) => {
    Modal.confirm({
      title: 'Confirm Approval',
      content: `Are you sure you want to approve ${record.name}?`,
      onOk: () => {
        dispatch({
          type: 'applications/updateStatus',
          payload: { id: record.id, status: 'approved', notes: '' }, 
        });
      },
    });
  };

  const showRejectModal = (record: Application) => {
    setCurrentItem(record);
    rejectForm.resetFields();
    setRejectModalVisible(true);
  };

  const handleRejectOk = () => {
    rejectForm.validateFields().then(values => {
      if (currentItem) {
        dispatch({
          type: 'applications/updateStatus',
          payload: { id: currentItem.id, status: 'rejected', notes: values.notes },
        });
      }
      setRejectModalVisible(false);
      setCurrentItem(null);
    }).catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleRejectCancel = () => {
    setRejectModalVisible(false);
    setCurrentItem(null);
  };

  const handleSearch = (type: 'name' | 'email', value: string) => {
    const newFilterParams = { ...filterParams, [type]: value, current: 1 }; 
     dispatch({ type: 'applications/setFilterParams', payload: newFilterParams });
     dispatch({ type: 'applications/fetch', payload: newFilterParams });
  };


  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      sorter: true,  
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
       sorter: true,
    },
    {
      title: 'Nguyện vọng',
      dataIndex: 'aspiration',
      key: 'aspiration',
      filters: ASPIRATIONS.map(a => ({ text: a.label, value: a.value })),
       
      render: (aspiration: string) => {
        const asp = ASPIRATIONS.find(a => a.value === aspiration);
        let color = 'default';
        if (aspiration === 'dev') color = 'geekblue';
        if (aspiration === 'design') color = 'volcano';
        if (aspiration === 'media') color = 'green';
        return <Tag color={color}>{asp ? asp.label : aspiration}</Tag>;
      },
    },
    {
        title: 'Lý do đăng ký',
        dataIndex: 'reason',
        key: 'reason',
        ellipsis: true,  
        render: (text: string) => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        filters: [
            { text: 'Pending', value: 'pending' },
            { text: 'Approved', value: 'approved' },
            { text: 'Rejected', value: 'rejected' },
        ],
        render: (status: string) => {
            let color = 'processing';
            if (status === 'approved') color = 'success';
            if (status === 'rejected') color = 'error';
            return <Tag color={color}>{status.toUpperCase()}</Tag>;
        },
    },
     {
        title: 'Logs',
        dataIndex: 'logs',
        key: 'logs',
        render: (logs: string[] = []) => (
          <Popover
             content={<div style={{ maxHeight: '200px', overflowY: 'auto' }}>{logs.map((log, index) => <p key={index}>{log}</p>)}</div>}
             title="Action Logs"
             trigger="click"
          >
            <Button type="link" size="small">View Logs ({logs.length})</Button>
          </Popover>
        ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: Application) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Button type="primary" size="small" onClick={() => handleApprove(record)}>
                Duyệt
              </Button>
              <Button danger size="small" onClick={() => showRejectModal(record)}>
                Từ chối
              </Button>
            </>
          )}
          {(record.status === 'approved' || record.status === 'rejected') && (
            <span>-</span>  
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý đơn đăng ký"> 
        <Card bordered={false}>
            <Space style={{ marginBottom: 16 }}>
                 <Input.Search
                    placeholder="Tìm theo tên"
                    allowClear
                    onSearch={(value) => handleSearch('name', value)}
                    style={{ width: 200 }}
                    />
                 <Input.Search
                    placeholder="Tìm theo email"
                    allowClear
                    onSearch={(value) => handleSearch('email', value)}
                    style={{ width: 200 }}
                 />
                
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

              
            <Modal
                title={`Từ chối ứng viên: ${currentItem?.name}`}
                visible={rejectModalVisible}
                onOk={handleRejectOk}
                onCancel={handleRejectCancel}
                confirmLoading={loading}  
                okText="Confirm Reject"
                cancelText="Cancel"
            >
                <Form form={rejectForm} layout="vertical">
                <Form.Item
                    name="notes"
                    label="Lý do từ chối (Ghi chú)"
                    rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối!' }]}
                >
                    <TextArea rows={4} placeholder="Nhập lý do..." />
                </Form.Item>
                </Form>
            </Modal>
        </Card>
    </PageContainer>
  );
};

export default connect(({ applications }: { applications: ApplicationsModelState }) => ({
  applications,
}))(ApplicationList);