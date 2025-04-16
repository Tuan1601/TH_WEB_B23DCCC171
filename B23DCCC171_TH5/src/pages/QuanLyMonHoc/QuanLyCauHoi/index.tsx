import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const QuanLyCauHoi = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ subject: '', level: '', knowledgeBlock: '' });

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
    const storedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    setQuestions(storedQuestions);
    setSubjects(storedSubjects);
  }, []);

  const saveToLocalStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addQuestion = (values: any) => {
    const newQuestions = [...questions, { id: Date.now(), ...values }];
    setQuestions(newQuestions);
    saveToLocalStorage('questions', newQuestions);
    message.success('Câu hỏi đã được thêm thành công');
    setVisible(false);
    form.resetFields();
  };

  const deleteQuestion = (id: any) => {
    const newQuestions = questions.filter(q => q.id !== id);
    setQuestions(newQuestions);
    saveToLocalStorage('questions', newQuestions);
    message.success('Câu hỏi đã được xóa');
  };

  const filteredQuestions = questions.filter(q => 
    (!filters.subject || q.subject === filters.subject) &&
    (!filters.level || q.level === filters.level) &&
    (!filters.knowledgeBlock || q.knowledgeBlock.includes(filters.knowledgeBlock))
  );

  const columns = [
    { title: 'Mã Câu Hỏi', dataIndex: 'id', key: 'id' },
    { title: 'Môn Học', dataIndex: 'subject', key: 'subject' },
    { title: 'Nội Dung', dataIndex: 'content', key: 'content' },
    { title: 'Mức Độ', dataIndex: 'level', key: 'level' },
    { title: 'Khối Kiến Thức', dataIndex: 'knowledgeBlock', key: 'knowledgeBlock' },
    {
      title: 'Thao Tác',
      key: 'action',
      render: (text: any, record: { id: any; }) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => deleteQuestion(record.id)}>Xóa</Button>
      ),
    },
  ];

  return (
    <div style={{ width: '80%', margin: '0 auto', paddingTop: '20px' }}>
      <h1 style={{ fontSize: '32px', textAlign: 'center' }}>Quản Lý Câu Hỏi</h1>
      <div style={{ marginBottom: 20 }}>
        <Select placeholder="Chọn môn học" onChange={value => setFilters({ ...filters, subject: value })} allowClear>
          {subjects.map(s => <Option key={s.id} value={s.name}>{s.name}</Option>)}
        </Select>
        <Select placeholder="Chọn mức độ" onChange={value => setFilters({ ...filters, level: value })} allowClear style={{ marginLeft: 10 }}>
          <Option value="Dễ">Dễ</Option>
          <Option value="Trung bình">Trung bình</Option>
          <Option value="Khó">Khó</Option>
          <Option value="Rất khó">Rất khó</Option>
        </Select>
        <Input placeholder="Tìm theo khối kiến thức" style={{ marginLeft: 10, width: 200 }}
          onChange={e => setFilters({ ...filters, knowledgeBlock: e.target.value })} />
      </div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>Thêm Câu Hỏi</Button>
      <Table columns={columns} dataSource={filteredQuestions} rowKey="id" style={{ marginTop: 20 }} />
      
      <Modal title="Thêm Câu Hỏi" visible={visible} onCancel={() => setVisible(false)} footer={null}>
        <Form form={form} onFinish={addQuestion}>
          <Form.Item name="subject" label="Môn Học" rules={[{ required: true }]}>  
            <Select placeholder="Chọn môn học">
              {subjects.map(s => <Option key={s.id} value={s.name}>{s.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="content" label="Nội Dung" rules={[{ required: true }]}>  
            <Input.TextArea placeholder="Nhập nội dung câu hỏi" />
          </Form.Item>
          <Form.Item name="level" label="Mức Độ" rules={[{ required: true }]}>  
            <Select>
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
              <Option value="Rất khó">Rất khó</Option>
            </Select>
          </Form.Item>
          <Form.Item name="knowledgeBlock" label="Khối Kiến Thức" rules={[{ required: true }]}>  
            <Input placeholder="Nhập khối kiến thức" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Thêm</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyCauHoi;
