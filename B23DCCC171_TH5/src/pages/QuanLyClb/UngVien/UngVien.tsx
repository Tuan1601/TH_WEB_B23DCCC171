// src/pages/RegistrationForm.tsx
import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { storageService } from '../../../models/QuanLyClb/QuanLyClb';

const UngVien: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const registration = {
      ...values,
      id: Date.now().toString(),
      status: 'pending' as const,
    };
    storageService.saveRegistration(registration);
    message.success('Đăng ký thành công!');
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="fullName"
          label="Họ tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="aspiration"
          label="Nguyện vọng"
          rules={[{ required: true, message: 'Vui lòng chọn nguyện vọng' }]}
        >
          <Select>
            <Select.Option value="design">Design</Select.Option>
            <Select.Option value="dev">Development</Select.Option>
            <Select.Option value="media">Media</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="reason"
          label="Lý do đăng ký"
          rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
        >
          <Input.TextArea />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Gửi đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UngVien;