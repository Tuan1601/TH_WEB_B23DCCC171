// src/pages/Budget/index.tsx (Quản lý Ngân sách)
import React, { useState } from 'react';
import { connect, Dispatch } from 'umi'; // Giữ nguyên import từ umi
import { Card, Row, Col, Progress, Typography, Statistic, InputNumber, Button, Table, Form, message, Input, Select } from 'antd'; // Giữ nguyên import từ antd
import { EditOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons'; // Giữ nguyên import icon
import type { BudgetModelState } from '@/models/budget'; // Giữ nguyên import type
import styles from './index.less'; // Giữ nguyên import CSS Module (nếu dùng)

const { Title, Text } = Typography; // Giữ nguyên
const { Option } = Select; // Giữ nguyên Option

// --- Hàm định dạng và phân tích tiền tệ Việt Nam ---
const formatVND = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return '0 đ';
    // Thêm dấu phẩy ngăn cách hàng nghìn và thêm " đ"
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
};

const parseVND = (value: string | undefined): string => {
    if (!value) return '';
    // Loại bỏ " đ" và dấu phẩy
    return value.replace(/\s?đ|(,*)/g, '');
};
// --- Kết thúc hàm trợ giúp ---


// Interface giữ nguyên tên tiếng Anh
interface BudgetPageProps {
  dispatch: Dispatch;
  budget: BudgetModelState;
}

// Tên component giữ nguyên
const BudgetPage: React.FC<BudgetPageProps> = ({ dispatch, budget }) => {
  // Tên biến giữ nguyên
  const { totalBudget, categories } = budget;
  const [editingTotalBudget, setEditingTotalBudget] = useState<boolean>(false);
  // Đảm bảo newTotalBudget khởi tạo đúng từ totalBudget
  const [newTotalBudget, setNewTotalBudget] = useState<number>(totalBudget);

  // Cập nhật newTotalBudget nếu totalBudget từ props thay đổi (tránh state cũ)
  React.useEffect(() => {
    setNewTotalBudget(totalBudget);
  }, [totalBudget]);

  // Comment có thể dịch: Tính toán tổng cộng
  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetProgress = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const budgetStatus = totalSpent > totalBudget ? 'exception' : (budgetProgress > 85 ? 'warning' : 'normal');

  // Tên hàm giữ nguyên
  const handleTotalBudgetChange = (value: number | string | null) => {
    // InputNumber trả về number hoặc null khi rỗng
    setNewTotalBudget(typeof value === 'number' ? value : 0);
  };

  // Tên hàm giữ nguyên
  const saveTotalBudget = () => {
    dispatch({
      type: 'budget/setTotalBudget', // Type của dispatch giữ nguyên
      payload: newTotalBudget,
    });
    setEditingTotalBudget(false);
    // Tin nhắn thông báo dịch
    message.success('Tổng ngân sách đã được cập nhật');
  };

  // Tên hàm giữ nguyên
  const handleCategoryUpdate = (id: string, field: 'allocated' | 'spent', value: string | null) => {
      // InputNumber trả về string đã parse, hoặc null
      const numericValue = parseInt(value || '0', 10); // Chuyển về số, mặc định là 0 nếu rỗng
      if (field === 'allocated') {
         dispatch({
             type: 'budget/updateCategory', // Type của dispatch giữ nguyên
             payload: { id, values: { allocated: numericValue } },
         });
     }
     // Việc sửa trực tiếp 'spent' không nên dùng formatter/parser vì nó là hiển thị
     // else if (field === 'spent') { // Bỏ phần này nếu chỉ dùng Add Expense
     //      dispatch({
     //         type: 'budget/updateCategory', // Type của dispatch giữ nguyên
     //         payload: { id, values: { spent: numericValue } },
     //     });
     // }
  };

   // Tên hàm giữ nguyên
   const handleAddExpense = (values: { categoryId: string; amount: number }) => {
       dispatch({
           type: 'budget/addExpense', // Type của dispatch giữ nguyên
           payload: { categoryId: values.categoryId, amount: values.amount },
       });
       // Tin nhắn thông báo dịch, thêm đơn vị tiền tệ
       message.success(`Đã thêm chi phí ${formatVND(values.amount)} vào danh mục`);
       // Comment có thể dịch: Cân nhắc reset form nếu nó nằm trong modal
   }


  // Định nghĩa cột cho bảng
  const columns = [
    {
      // Tiêu đề cột dịch
      title: 'Danh mục',
      dataIndex: 'name',
      key: 'name',
       // Logic render giữ nguyên để viết hoa chữ cái đầu
       render: (text: string) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      // Tiêu đề cột dịch
      title: 'Phân bổ',
      dataIndex: 'allocated',
      key: 'allocated',
      render: (text: number, record: any) => (
          <InputNumber
              // Value cần là số để InputNumber hoạt động đúng
              value={text}
              min={0}
              // Sử dụng hàm định dạng và phân tích VND
              formatter={value => formatVND(value)}
              parser={value => parseVND(value)}
              // onChange thay vì onBlur để cập nhật state ngay lập tức nếu cần, hoặc giữ onBlur
              // Lưu ý: onChange trả về string đã parse hoặc number tùy version Antd/InputNumber, nên handleCategoryUpdate nhận string
              onBlur={(e) => handleCategoryUpdate(record.id, 'allocated', e.target.value)}
              style={{ width: 150 }} // Tăng độ rộng có thể cần thiết
          />
      ),
    },
    {
      // Tiêu đề cột dịch
      title: 'Đã chi',
      dataIndex: 'spent',
      key: 'spent',
       render: (text: number) => ( // Bỏ record không dùng tới
            // Sử dụng hàm formatVND để hiển thị, bỏ prefix/suffix của Statistic
             <Statistic value={text} formatter={() => formatVND(text)} valueStyle={{ fontSize: 16 }} />
      ),
    },
     {
      // Tiêu đề cột dịch
      title: 'Còn lại',
      key: 'remaining',
       render: (_: any, record: any) => {
           const remaining = record.allocated - record.spent;
           // Sử dụng hàm formatVND để hiển thị, bỏ prefix/suffix của Statistic
           return <Statistic value={remaining} formatter={() => formatVND(remaining)} valueStyle={{ fontSize: 16, color: remaining < 0 ? '#cf1322' : undefined }} />;
       },
    },
  ];

  // --- Placeholder cho Biểu đồ ---
  // ... (giữ nguyên)

  return (
    // Nếu không dùng CSS Module thì bỏ className
    <div className={styles.budgetPage}>
      {/* Tiêu đề trang dịch */}
      <Title level={2}>Quản lý Ngân sách</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
           {/* Tiêu đề Card dịch */}
          <Card title="Ngân sách Tổng thể">
             {editingTotalBudget ? (
                 <Input.Group compact>
                    <InputNumber
                        style={{ width: 'calc(100% - 64px)' }}
                        min={0}
                        // InputNumber nhận value là number
                        value={newTotalBudget}
                        // onChange cập nhật state number
                        onChange={handleTotalBudgetChange}
                        // Dùng formatter/parser VND
                        formatter={value => formatVND(value)}
                        parser={value => parseVND(value)}
                    />
                    <Button icon={<CheckOutlined />} onClick={saveTotalBudget} type="primary" />
                </Input.Group>
             ) : (
                 // Tiêu đề Statistic dịch, dùng formatter VND
                <Statistic title="Tổng ngân sách" value={totalBudget} formatter={() => formatVND(totalBudget)} suffix={<Button type="link" icon={<EditOutlined />} onClick={() => setEditingTotalBudget(true)} />} />
             )}
             {/* Tiêu đề Statistic dịch, dùng formatter VND */}
            <Statistic title="Tổng phân bổ" value={totalAllocated} formatter={() => formatVND(totalAllocated)} valueStyle={{ fontSize: 14, color: totalAllocated > totalBudget ? '#cf1322' : undefined }} />
            {/* Tiêu đề Statistic dịch, dùng formatter VND */}
            <Statistic title="Tổng đã chi" value={totalSpent} formatter={() => formatVND(totalSpent)} />
            <Progress percent={parseFloat(budgetProgress.toFixed(1))} status={budgetStatus} />
          </Card>
        </Col>
         <Col xs={24} md={16}>
           {/* Tiêu đề Card dịch */}
           <Card title="Phân bổ & Chi tiêu Ngân sách">
                 {/* ... (Placeholder biểu đồ giữ nguyên) ... */}
                 {/* Tiêu đề dịch */}
                 <Title level={4} style={{ marginTop: 16 }}>Chi tiết theo Danh mục</Title>
                 <Table
                     columns={columns}
                     dataSource={categories}
                     rowKey="id"
                     pagination={false}
                     size="small"
                 />

                 {/* Form Thêm Chi phí Nhanh */}
                 {/* Tiêu đề Card dịch */}
                 <Card size="small" title="Thêm Chi phí Nhanh" style={{ marginTop: 16}}>
                     <Form layout="inline" onFinish={handleAddExpense}>
                          {/* Message dịch */}
                         <Form.Item name="categoryId" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                              {/* Placeholder dịch */}
                             <Select placeholder="Danh mục" style={{ width: 150 }}>
                                {/* Logic render Option giữ nguyên */}
                                {categories.map(cat => <Option key={cat.id} value={cat.id}>{cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</Option>)}
                             </Select>
                         </Form.Item>
                           {/* Message dịch */}
                          <Form.Item name="amount" rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}>
                               {/* Dùng formatter/parser VND */}
                             <InputNumber
                                placeholder="Số tiền"
                                min={0}
                                style={{ width: 150 }} // Thêm độ rộng
                                formatter={value => formatVND(value)}
                                parser={value => parseVND(value)}
                             />
                         </Form.Item>
                          <Form.Item>
                              {/* Text nút dịch */}
                             <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>Thêm</Button>
                         </Form.Item>
                     </Form>
                 </Card>
           </Card>
        </Col>
      </Row>
    </div>
  );
};

// Phần connect giữ nguyên cấu trúc
export default connect(({ budget }: { budget: BudgetModelState }) => ({
  budget,
}))(BudgetPage);