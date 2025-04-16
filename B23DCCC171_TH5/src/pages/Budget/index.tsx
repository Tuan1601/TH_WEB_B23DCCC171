import React, { useState } from 'react';
import { connect, Dispatch } from 'umi';
import { Card, Row, Col, Progress, Typography, Statistic, InputNumber, Button, Table, Form, message, Input, Select } from 'antd'; 
import { EditOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons'; 
import type { BudgetModelState } from '@/models/budget'; 
import styles from './index.less'; 

const { Title, Text } = Typography; 
const { Option } = Select; 

const formatVND = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return '0 đ';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
};

const parseVND = (value: string | undefined): string => {
    if (!value) return '';
    return value.replace(/\s?đ|(,*)/g, '');
};

interface BudgetPageProps {
  dispatch: Dispatch;
  budget: BudgetModelState;
}

const BudgetPage: React.FC<BudgetPageProps> = ({ dispatch, budget }) => {
  const { totalBudget, categories } = budget;
  const [editingTotalBudget, setEditingTotalBudget] = useState<boolean>(false);
  const [newTotalBudget, setNewTotalBudget] = useState<number>(totalBudget);

  React.useEffect(() => {
    setNewTotalBudget(totalBudget);
  }, [totalBudget]);

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetProgress = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const budgetStatus = totalSpent > totalBudget ? 'exception' : (budgetProgress > 85 ? 'warning' : 'normal');

  const handleTotalBudgetChange = (value: number | string | null) => {
    setNewTotalBudget(typeof value === 'number' ? value : 0);
  };

  const saveTotalBudget = () => {
    dispatch({
      type: 'budget/setTotalBudget',
      payload: newTotalBudget,
    });
    setEditingTotalBudget(false);
    message.success('Tổng ngân sách đã được cập nhật');
  };

  const handleCategoryUpdate = (id: string, field: 'allocated' | 'spent', value: string | null) => {
    const numericValue = parseInt(value || '0', 10);
    if (field === 'allocated') {
      dispatch({
        type: 'budget/updateCategory',
        payload: { id, values: { allocated: numericValue } },
      });
    }
  };

  const handleAddExpense = (values: { categoryId: string; amount: number }) => {
    dispatch({
      type: 'budget/addExpense',
      payload: { categoryId: values.categoryId, amount: values.amount },
    });
    message.success(`Đã thêm chi phí ${formatVND(values.amount)} vào danh mục`);
  }

  const columns = [
    {
      title: 'Danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: 'Phân bổ',
      dataIndex: 'allocated',
      key: 'allocated',
      render: (text: number, record: any) => (
        <InputNumber
          value={text}
          min={0}
          formatter={value => formatVND(value)}
          parser={value => parseVND(value)}
          onBlur={(e) => handleCategoryUpdate(record.id, 'allocated', e.target.value)}
          style={{ width: 150 }}
        />
      ),
    },
    {
      title: 'Đã chi',
      dataIndex: 'spent',
      key: 'spent',
      render: (text: number) => (
        <Statistic value={text} formatter={() => formatVND(text)} valueStyle={{ fontSize: 16 }} />
      ),
    },
    {
      title: 'Còn lại',
      key: 'remaining',
      render: (_: any, record: any) => {
        const remaining = record.allocated - record.spent;
        return <Statistic value={remaining} formatter={() => formatVND(remaining)} valueStyle={{ fontSize: 16, color: remaining < 0 ? '#cf1322' : undefined }} />;
      },
    },
  ];

  return (
    <div className={styles.budgetPage}>
      <Title level={2}>Quản lý Ngân sách</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Ngân sách Tổng thể">
            {editingTotalBudget ? (
              <Input.Group compact>
                <InputNumber
                  style={{ width: 'calc(100% - 64px)' }}
                  min={0}
                  value={newTotalBudget}
                  onChange={handleTotalBudgetChange}
                  formatter={value => formatVND(value)}
                  parser={value => parseVND(value)}
                />
                <Button icon={<CheckOutlined />} onClick={saveTotalBudget} type="primary" />
              </Input.Group>
            ) : (
              <Statistic title="Tổng ngân sách" value={totalBudget} formatter={() => formatVND(totalBudget)} suffix={<Button type="link" icon={<EditOutlined />} onClick={() => setEditingTotalBudget(true)} />} />
            )}
            <Statistic title="Tổng phân bổ" value={totalAllocated} formatter={() => formatVND(totalAllocated)} valueStyle={{ fontSize: 14, color: totalAllocated > totalBudget ? '#cf1322' : undefined }} />
            <Statistic title="Tổng đã chi" value={totalSpent} formatter={() => formatVND(totalSpent)} />
            <Progress percent={parseFloat(budgetProgress.toFixed(1))} status={budgetStatus} />
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Phân bổ & Chi tiêu Ngân sách">
            <Title level={4} style={{ marginTop: 16 }}>Chi tiết theo Danh mục</Title>
            <Table
              columns={columns}
              dataSource={categories}
              rowKey="id"
              pagination={false}
              size="small"
            />
            <Card size="small" title="Thêm Chi phí Nhanh" style={{ marginTop: 16 }}>
              <Form layout="inline" onFinish={handleAddExpense}>
                <Form.Item name="categoryId" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                  <Select placeholder="Danh mục" style={{ width: 150 }}>
                    {categories.map(cat => <Option key={cat.id} value={cat.id}>{cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="amount" rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}>
                  <InputNumber
                    placeholder="Số tiền"
                    min={0}
                    style={{ width: 150 }}
                    formatter={value => formatVND(value)}
                    parser={value => parseVND(value)}
                  />
                </Form.Item>
                <Form.Item>
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

export default connect(({ budget }: { budget: BudgetModelState }) => ({
  budget,
}))(BudgetPage);
