import React, { useEffect, useState } from 'react';
import type { Dispatch } from 'umi'; 
import { connect } from 'umi';      
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input, Select, InputNumber, Rate, Upload } from 'antd'; 
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'; 
import type { DestinationModelState } from '@/models/destination'; 
import type { Destination } from '@/types';                        

const { Option } = Select;

interface DestinationsAdminProps {
  dispatch: Dispatch;
  destination: DestinationModelState;
}

const DestinationsAdmin: React.FC<DestinationsAdminProps> = ({ dispatch, destination }) => {
  const { list, loading, adminLoading } = destination;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Destination | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (list.length === 0) {
      dispatch({ type: 'destination/fetch' });
    }
  }, [dispatch, list.length]); 

  const showModal = (record: Destination | null = null) => {
    setEditingRecord(record);
    form.resetFields();
    if (record) {
        form.setFieldsValue({
            ...record,
        });
    } else {
         form.setFieldsValue({ rating: 3, priceRange: 3 });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
        const imageUrl = values.imageUrl || (editingRecord ? editingRecord.imageUrl : 'https://source.unsplash.com/random/400x300?travel'); 

        const dataToSend = { ...values, imageUrl };
         delete dataToSend.upload;


        const actionType = editingRecord ? 'destination/update' : 'destination/add'; 
        const payload = editingRecord
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            ? { id: editingRecord.id, values: dataToSend, onSuccess: closeModalAndNotify, onError: handleError } 
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            : { values: dataToSend, onSuccess: closeModalAndNotify, onError: handleError };
        dispatch({ type: actionType, payload });

    }).catch(info => {
      console.log('Xác thực thất bại:', info);
    });
  };

   const closeModalAndNotify = () => {
        setIsModalVisible(false);
        setEditingRecord(null);
        message.success(`Điểm đến đã được ${editingRecord ? 'cập nhật' : 'thêm'} thành công!`);
   };

    const handleError = (error: any) => {
        message.error(`Thao tác ${editingRecord ? 'cập nhật' : 'thêm'} điểm đến thất bại. ${error?.message || ''}`);
   };

  const handleDelete = (id: string) => {
     dispatch({
         type: 'destination/remove', 
         payload: {
             id,
             onSuccess: () => message.success('Xóa điểm đến thành công!'),
             onError: (e: any) => message.error(`Xóa điểm đến thất bại. ${e?.message || ''}`)
         }
     });
  };

   const handleUploadChange = (info: any) => {
        if (info.file.status === 'done') {
            message.success(`Tải lên tệp ${info.file.name} thành công`);
            const uploadedUrl = info.file.response?.url || `https://source.unsplash.com/random/400x300?${form.getFieldValue('name') || 'place'}`; // URL giữ nguyên hoặc dịch comment
            form.setFieldsValue({ imageUrl: uploadedUrl });
        } else if (info.file.status === 'error') {
            message.error(`Tải lên tệp ${info.file.name} thất bại.`);
        }
        return info.fileList.slice(-1);
    };

   const normFile = (e: any) => {
        console.log('Sự kiện Upload:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList.slice(-1);
    };


  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name', sorter: (a: Destination, b: Destination) => a.name.localeCompare(b.name) },
    { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
    {
        title: 'Loại hình',
        dataIndex: 'type',
        key: 'type',
        filters: [ { text: 'Biển', value: 'beach'}, { text: 'Núi', value: 'mountain'}, { text: 'Thành phố', value: 'city'} ],
        onFilter: (value: any, record: Destination) => record.type === value
    },
    { title: 'Đánh giá', dataIndex: 'rating', key: 'rating', sorter: (a: Destination, b: Destination) => a.rating - b.rating, render: (rating: number) => <Rate disabled allowHalf value={rating} style={{ fontSize: 14 }} /> },
    { title: 'Khoảng giá', dataIndex: 'priceRange', key: 'priceRange', sorter: (a: Destination, b: Destination) => a.priceRange - b.priceRange },
    {
      title: 'Hành động', 
      key: 'action',
      render: (_: any, record: Destination) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} size="small" />
          <Popconfirm title="Bạn chắc chắn muốn xóa điểm đến này?" onConfirm={() => handleDelete(record.id)} okText="Có" cancelText="Không">
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
       <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            style={{ marginBottom: 16 }}
            loading={adminLoading && !isModalVisible} 
        >
            Thêm điểm đến {/* Text nút dịch */}
        </Button>
      <Table
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading && list.length === 0} 
        size="small"
      />
      <Modal
        title={editingRecord ? 'Sửa điểm đến' : 'Thêm điểm đến mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={adminLoading}
        destroyOnClose 
      >
        {/* Form giữ nguyên */}
        <Form form={form} layout="vertical" name="destination_form">
          {/* Label và message dịch */}
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Địa điểm" rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại hình" rules={[{ required: true, message: 'Vui lòng chọn loại hình!' }]}>
            {/* Placeholder dịch */}
            <Select placeholder="Chọn loại hình">
              {/* Option dịch */}
              <Option value="beach">Biển</Option>
              <Option value="mountain">Núi</Option>
              <Option value="city">Thành phố</Option>
            </Select>
          </Form.Item>
          <Form.Item name="priceRange" label="Khoảng giá (1-5 triệu)" rules={[{ required: true, message: 'Vui lòng nhập khoảng giá!'}]}>
             <InputNumber min={1} max={5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="rating" label="Đánh giá" rules={[{ required: true, message: 'Vui lòng cung cấp đánh giá!'}]}>
              <Rate allowHalf />
          </Form.Item>
           <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="imageUrl" label="URL Hình ảnh">
            <Input placeholder="https://vidu.com/hinhanh.jpg" />
          </Form.Item>


        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ destination }: { destination: DestinationModelState }) => ({
  destination,
}))(DestinationsAdmin);