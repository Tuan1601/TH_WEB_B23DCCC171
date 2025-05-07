// src/pages/Admin/Destinations/index.tsx (Admin - Quản lý Điểm đến)
import React, { useEffect, useState } from 'react';
import type { Dispatch } from 'umi'; // Giữ nguyên import từ umi
import { connect } from 'umi';      // Giữ nguyên import từ umi
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input, Select, InputNumber, Rate, Upload } from 'antd'; // Giữ nguyên import từ antd
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'; // Giữ nguyên import icon
import type { DestinationModelState } from '@/models/destination'; // Giữ nguyên import type
import type { Destination } from '@/types';                        // Giữ nguyên import type

const { Option } = Select;

// Interface giữ nguyên tên tiếng Anh vì nó là định nghĩa code
interface DestinationsAdminProps {
  dispatch: Dispatch;
  destination: DestinationModelState;
}

// Tên component giữ nguyên
const DestinationsAdmin: React.FC<DestinationsAdminProps> = ({ dispatch, destination }) => {
  // Tên biến giữ nguyên
  const { list, loading, adminLoading } = destination;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Destination | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Comment có thể dịch
    // Lấy danh sách điểm đến nếu chưa có (hoặc nếu cần load lại riêng cho admin)
    if (list.length === 0) {
      dispatch({ type: 'destination/fetch' }); // Type của dispatch giữ nguyên
    }
  }, [dispatch, list.length]); // Dependency array giữ nguyên

  // Tên hàm giữ nguyên
  const showModal = (record: Destination | null = null) => {
    setEditingRecord(record);
    form.resetFields();
    if (record) {
        // Comment có thể dịch
        // Cần xử lý trạng thái upload ảnh riêng nếu đang sửa
        form.setFieldsValue({
            ...record,
            // image: record.imageUrl ? [{ uid: '-1', name: 'image.png', status: 'done', url: record.imageUrl }] : [] // Comment giữ nguyên hoặc dịch
        });
    } else {
         // Giá trị mặc định khi thêm mới
         form.setFieldsValue({ rating: 3, priceRange: 3 });
    }
    setIsModalVisible(true);
  };

  // Tên hàm giữ nguyên
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  // Tên hàm giữ nguyên
  const handleOk = () => {
    form.validateFields().then((values) => {
        // Comment có thể dịch
        // Xử lý kết quả upload ảnh nếu cần
        // Hiện tại, giả sử imageUrl được xử lý thủ công hoặc truyền trực tiếp
        const imageUrl = values.imageUrl || (editingRecord ? editingRecord.imageUrl : 'https://source.unsplash.com/random/400x300?travel'); // Placeholder URL giữ nguyên

        const dataToSend = { ...values, imageUrl };
         // Xóa trường upload nếu có trong values, vì nó thường không phải là thuộc tính của Destination
         delete dataToSend.upload;


        const actionType = editingRecord ? 'destination/update' : 'destination/add'; // Type của dispatch giữ nguyên
        const payload = editingRecord
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            ? { id: editingRecord.id, values: dataToSend, onSuccess: closeModalAndNotify, onError: handleError } // Tên hàm callback giữ nguyên
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            : { values: dataToSend, onSuccess: closeModalAndNotify, onError: handleError }; // Tên hàm callback giữ nguyên

        dispatch({ type: actionType, payload });

    }).catch(info => {
      // Log lỗi có thể dịch
      console.log('Xác thực thất bại:', info);
    });
  };

   // Tên hàm giữ nguyên
   const closeModalAndNotify = () => {
        setIsModalVisible(false);
        setEditingRecord(null);
        // Tin nhắn thông báo dịch sang tiếng Việt
        message.success(`Điểm đến đã được ${editingRecord ? 'cập nhật' : 'thêm'} thành công!`);
   };

   // Tên hàm giữ nguyên
    const handleError = (error: any) => {
        // Tin nhắn thông báo dịch sang tiếng Việt
        message.error(`Thao tác ${editingRecord ? 'cập nhật' : 'thêm'} điểm đến thất bại. ${error?.message || ''}`);
        // Comment có thể dịch
        // Giữ modal mở hoặc xử lý theo nhu cầu
   };

   // Tên hàm giữ nguyên
  const handleDelete = (id: string) => {
     dispatch({
         type: 'destination/remove', // Type của dispatch giữ nguyên
         payload: {
             id,
             // Tin nhắn thông báo dịch sang tiếng Việt
             onSuccess: () => message.success('Xóa điểm đến thành công!'),
             onError: (e: any) => message.error(`Xóa điểm đến thất bại. ${e?.message || ''}`)
         }
     });
  };

   // --- Xử lý Upload (Ví dụ cơ bản) ---
   const handleUploadChange = (info: any) => {
        if (info.file.status === 'done') {
            // Tin nhắn thông báo dịch sang tiếng Việt
            message.success(`Tải lên tệp ${info.file.name} thành công`);
            // QUAN TRỌNG: Trong ứng dụng thực tế, phản hồi từ server phải chứa URL
            // Với mock, chúng ta đặt URL tạm hoặc lấy từ phản hồi nếu có
            const uploadedUrl = info.file.response?.url || `https://source.unsplash.com/random/400x300?${form.getFieldValue('name') || 'place'}`; // URL giữ nguyên hoặc dịch comment
            form.setFieldsValue({ imageUrl: uploadedUrl });
        } else if (info.file.status === 'error') {
             // Tin nhắn thông báo dịch sang tiếng Việt
            message.error(`Tải lên tệp ${info.file.name} thất bại.`);
        }
        // Giới hạn chỉ hiển thị 1 tệp trong danh sách
        return info.fileList.slice(-1);
    };

   // Tên hàm giữ nguyên
   const normFile = (e: any) => {
        // Log có thể dịch
        console.log('Sự kiện Upload:', e);
        if (Array.isArray(e)) {
            return e;
        }
        // Trả về danh sách tệp, giới hạn 1
        return e && e.fileList.slice(-1);
    };
  // --- Kết thúc Xử lý Upload ---


  // Định nghĩa cột cho bảng
  const columns = [
    // Tiêu đề cột dịch sang tiếng Việt
    { title: 'Tên', dataIndex: 'name', key: 'name', sorter: (a: Destination, b: Destination) => a.name.localeCompare(b.name) },
    { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
    {
        title: 'Loại hình',
        dataIndex: 'type',
        key: 'type',
        // Bộ lọc dịch sang tiếng Việt
        filters: [ { text: 'Biển', value: 'beach'}, { text: 'Núi', value: 'mountain'}, { text: 'Thành phố', value: 'city'} ],
        onFilter: (value: any, record: Destination) => record.type === value
    },
    { title: 'Đánh giá', dataIndex: 'rating', key: 'rating', sorter: (a: Destination, b: Destination) => a.rating - b.rating, render: (rating: number) => <Rate disabled allowHalf value={rating} style={{ fontSize: 14 }} /> },
    { title: 'Khoảng giá', dataIndex: 'priceRange', key: 'priceRange', sorter: (a: Destination, b: Destination) => a.priceRange - b.priceRange },
    {
      title: 'Hành động', // Tiêu đề cột dịch
      key: 'action',
      render: (_: any, record: Destination) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} size="small" />
          {/* Popconfirm dịch sang tiếng Việt */}
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
            loading={adminLoading && !isModalVisible} // Comment có thể dịch: Chỉ hiển thị loading trên nút khi không thêm/sửa qua modal
        >
            Thêm điểm đến {/* Text nút dịch */}
        </Button>
      <Table
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading && list.length === 0} // Comment có thể dịch: Chỉ hiển thị loading bảng khi load lần đầu
        size="small"
      />
      <Modal
        // Tiêu đề Modal dịch
        title={editingRecord ? 'Sửa điểm đến' : 'Thêm điểm đến mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={adminLoading}
        destroyOnClose // Comment có thể dịch: Reset trạng thái form khi đóng modal
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
          {/* Comment có thể dịch */}
          {/* Nhập URL Hình ảnh (Đơn giản) - Thay bằng Upload cho ứng dụng thực tế */}
          <Form.Item name="imageUrl" label="URL Hình ảnh">
             {/* Placeholder dịch */}
            <Input placeholder="https://vidu.com/hinhanh.jpg" />
          </Form.Item>

          {/* Thành phần Upload thực tế (Ví dụ - yêu cầu endpoint backend) */}
           {/* <Form.Item
              name="upload"
              label="Tải lên Hình ảnh" // Label dịch
              valuePropName="fileList"
              getValueFromEvent={normFile} // Xử lý danh sách tệp
              extra="Tải lên ảnh mới cho điểm đến" // Extra text dịch
            >
              <Upload
                name="file" // Tên này phải khớp với backend API
                action="/api/upload/image" // Thay bằng endpoint upload ảnh thực tế của bạn
                listType="picture"
                onChange={handleUploadChange}
                 // Thêm headers, withCredentials,... nếu cần xác thực
                // headers={{ authorization: 'authorization-text' }}
              >
                <Button icon={<UploadOutlined />}>Nhấn để tải lên</Button> // Text nút dịch
              </Upload>
           </Form.Item> */}

        </Form>
      </Modal>
    </div>
  );
};

// Phần connect giữ nguyên cấu trúc
export default connect(({ destination }: { destination: DestinationModelState }) => ({
  destination,
}))(DestinationsAdmin);