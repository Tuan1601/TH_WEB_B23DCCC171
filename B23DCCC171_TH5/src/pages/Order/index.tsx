import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input, // <<< Đảm bảo Input được import
  Select, // <<< Vẫn cần Select cho Sản phẩm và Trạng thái
  Space,
  Tag,
  Popconfirm,
  message,
  Typography,
  Spin,
} from 'antd';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table/interface';
import moment from 'moment'; // <<< QUAN TRỌNG: npm install moment
// <<< Bỏ Customer khỏi import nếu không dùng type riêng nữa
import type { Order, OrderStatus, Product } from '@/types/order';

const { Text } = Typography;
const { Option } = Select;

// --- Mock Data (Chỉ còn lại Sản phẩm) ---
// const MOCK_CUSTOMERS: Customer[] = [ ... ]; // <<< XÓA DÒNG NÀY HOẶC COMMENT LẠI

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Bàn phím cơ AKKO', price: 1850000 },
  { id: 'p2', name: 'Màn hình LG 27"', price: 5500000 },
  { id: 'p3', name: 'Chuột Logitech G502', price: 1100000 },
  { id: 'p4', name: 'Tai nghe Sony WH-1000XM4', price: 6200000 },
  { id: 'p5', name: 'Ổ cứng SSD Samsung 1TB', price: 2150000 },
];
// --- ---

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Chờ xác nhận', color: 'orange' },
  { value: 'shipping', label: 'Đang giao', color: 'blue' },
  { value: 'completed', label: 'Hoàn thành', color: 'green' },
  { value: 'cancelled', label: 'Đã hủy', color: 'red' },
];

const formatCurrency = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return formatCurrency(0);
    }
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

const OrderPage: React.FC = () => {
  const modelResult = useModel('order');
  if (!modelResult) {
      return <Spin tip="Đang tải dữ liệu model..." style={{ margin: '50px auto', display: 'block' }} />;
  }
  const { orders, loading, addOrder, updateOrder, cancelOrder } = modelResult;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | null>(null);
  const [form] = Form.useForm();

  const selectedProductIds = Form.useWatch('productIds', form);

  const calculatedTotal = useMemo(() => {
    // ... (giữ nguyên logic tính tổng tiền)
    if (!Array.isArray(selectedProductIds)) {
      return 0;
    }
    return selectedProductIds.reduce((total: number, pId: string) => {
      const product = MOCK_PRODUCTS.find(p => p.id === pId);
      return total + (product ? product.price : 0);
    }, 0);
  }, [selectedProductIds]);


  const filteredAndSortedOrders = useMemo(() => {
    // ... (giữ nguyên logic lọc và sắp xếp)
    let filtered = [...orders];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(lowerSearchTerm) ||
        order.customer.toLowerCase().includes(lowerSearchTerm) // Vẫn tìm kiếm theo customer được
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    return filtered;
  }, [orders, searchTerm, filterStatus]);


  const showAddModal = () => {
    // ... (giữ nguyên)
    setEditingOrder(null);
    form.resetFields();
    form.setFieldsValue({ status: 'pending', productIds: [] });
    setIsModalVisible(true);
  };

  const showEditModal = (order: Order) => {
    // ... (giữ nguyên, vì customer đã là string)
    setEditingOrder(order);
    const productIds = Array.isArray(order.products) ? order.products.map(p => p.id) : [];
    form.setFieldsValue({
        customer: order.customer, // <<< Dữ liệu customer là string, phù hợp với Input
        productIds: productIds,
        status: order.status,
    });
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
     // ... (giữ nguyên)
    setIsModalVisible(false);
    setEditingOrder(null);
  };

  const handleModalOk = async () => {
     // ... (giữ nguyên, vì values.customer đã là string từ Input)
    try {
      const values = await form.validateFields();

      const selectedProducts: Product[] = Array.isArray(values.productIds)
         ? values.productIds
             .map((pId: string) => MOCK_PRODUCTS.find(p => p.id === pId))
             .filter((p: Product | undefined): p is Product => p !== undefined)
         : [];

      const totalAmount = calculatedTotal;

      const orderPayload = {
        customer: values.customer, // <<< Lấy trực tiếp từ Input
        products: selectedProducts,
        totalAmount: totalAmount,
        status: values.status,
      };

      let success = false;
      if (editingOrder) {
        success = await updateOrder({
            ...editingOrder,
            ...orderPayload,
         });
      } else {
        success = await addOrder(orderPayload);
      }

      if (success) {
        handleModalCancel();
      }

    } catch (errorInfo) {
      console.log('Form validation failed:', errorInfo);
    }
  };


  const handleCancelOrder = async (id: string) => {
     // ... (giữ nguyên)
    await cancelOrder(id);
  };


  // --- Cấu hình Cột Cho Bảng ---
  const columns: ColumnsType<Order> = [
      // ... (giữ nguyên cấu hình các cột khác)
    {
      title: 'Mã ĐH',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a, b) => a.customer.localeCompare(b.customer),
      ellipsis: true,
    },
    {
        title: 'Sản phẩm',
        dataIndex: 'products',
        key: 'products',
        render: (products: Product[] | undefined) => (
            Array.isArray(products) ? (
                <Space direction="vertical" size={2}>
                    {products.map(p => (
                        <Tag key={p.id}>{p.name}</Tag>
                    ))}
                </Space>
            ) : null
        ),
        width: 200,
        ellipsis: true,
    },
    {
      title: 'Ngày Đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: string) => moment(date).isValid() ? moment(date).format('DD/MM/YYYY HH:mm') : 'N/A',
      sorter: (a, b) => moment(a.orderDate).valueOf() - moment(b.orderDate).valueOf(),
      defaultSortOrder: 'descend',
      width: 150,
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatCurrency(amount),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      align: 'right',
      width: 150,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => {
        const statusInfo = STATUS_OPTIONS.find(s => s.value === status);
        return statusInfo ? <Tag color={statusInfo.color}>{statusInfo.label}</Tag> : <Tag>Không xác định</Tag>;
      },
      width: 130,
      align: 'center',
    },
    {
      title: 'Hành Động',
      key: 'action',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => showEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận hủy đơn hàng?"
            description="Chỉ hủy được khi ở trạng thái 'Chờ xác nhận'."
            onConfirm={() => handleCancelOrder(record.id)}
            okText="Đồng ý"
            cancelText="Không"
            disabled={record.status !== 'pending'}
          >
            <Button type="link" danger size="small" disabled={record.status !== 'pending'}>
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --- Render Component ---
  return (
    <div style={{ padding: '16px' }}>
      <Typography.Title level={3} style={{ marginBottom: '16px' }}>Quản Lý Đơn Hàng</Typography.Title>

      {/* Thanh công cụ */}
       {/* ... (giữ nguyên) */}
       <Space style={{ marginBottom: 16 }} wrap>
        <Button type="primary" onClick={showAddModal}>
          Thêm Đơn Hàng
        </Button>
        <Input.Search
          placeholder="Tìm Mã ĐH, Khách hàng"
          allowClear
          enterButton
          onSearch={setSearchTerm}
          onChange={(e) => {if (e.target.value === '') setSearchTerm('')}}
          style={{ width: 280 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 180 }}
          onChange={(value) => setFilterStatus(value as OrderStatus | null)}
          value={filterStatus}
        >
          {STATUS_OPTIONS.map(option => (
            <Option key={option.value} value={option.value}>
               <Tag color={option.color} style={{ marginRight: 0 }}>{option.label}</Tag>
            </Option>
          ))}
        </Select>
      </Space>


      {/* Bảng Dữ Liệu */}
       {/* ... (giữ nguyên) */}
      <Table
        columns={columns}
        dataSource={filteredAndSortedOrders}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }}
        scroll={{ x: 1200 }}
        bordered
      />

      {/* Modal Thêm/Sửa */}
      <Modal
        title={editingOrder ? `Chỉnh Sửa Đơn Hàng (${editingOrder.id})` : 'Thêm Đơn Hàng Mới'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        destroyOnClose
        maskClosable={false}
        width={650}
      >
        <Form form={form} layout="vertical" name="orderForm">
          {/* --- Customer Input --- */}
          <Form.Item
            name="customer"
            label="Khách Hàng"
            rules={[
                { required: true, message: 'Vui lòng nhập tên khách hàng!' },
                { whitespace: true, message: 'Tên khách hàng không thể chỉ là khoảng trắng!'} // Thêm kiểm tra khoảng trắng
            ]}
          >
            {/* <<< THAY THẾ Select BẰNG Input */}
            <Input placeholder="Nhập tên khách hàng hoặc công ty" allowClear />
          </Form.Item>

          {/* --- Products Select --- */}
          {/* <<< Giữ nguyên phần chọn sản phẩm */}
          <Form.Item
            name="productIds"
            label="Sản phẩm"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một sản phẩm!', type: 'array' }]}
          >
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Chọn các sản phẩm trong đơn hàng"
              optionFilterProp="children"
              filterOption={(input, option) =>
                 (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
              }
            >
              {MOCK_PRODUCTS.map(product => (
                <Option key={product.id} value={product.id}>
                  {`${product.name} (${formatCurrency(product.price)})`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* --- Total Amount (Display Only) --- */}
          {/* <<< Giữ nguyên */}
           <Form.Item label="Tổng Tiền (tự động tính)">
               <Input
                   value={formatCurrency(calculatedTotal)}
                   disabled
                   style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}
               />
           </Form.Item>

          {/* --- Status Select --- */}
          {/* <<< Giữ nguyên */}
          <Form.Item
            name="status"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái đơn hàng">
              {STATUS_OPTIONS.map(option => (
                 option.value !== 'cancelled' && (
                    <Option key={option.value} value={option.value}>
                        {option.label}
                    </Option>
                 )
              ))}
            </Select>
          </Form.Item>

           {/* --- Order Date (Display Only on Edit) --- */}
           {/* <<< Giữ nguyên */}
           {editingOrder && (
               <Form.Item label="Ngày Đặt Hàng">
                   <Input
                      value={moment(editingOrder.orderDate).isValid() ? moment(editingOrder.orderDate).format('DD/MM/YYYY HH:mm') : 'N/A'}
                      disabled
                    />
               </Form.Item>
           )}
        </Form>
      </Modal>
    </div>
  );
};

export default OrderPage;