import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Input, Select, message, Table, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const QuanLyMonHoc = () => {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  
  
  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
    const storedExams = JSON.parse(localStorage.getItem('exams')) || [];
    
    setSubjects(storedSubjects);
    setQuestions(storedQuestions);
    setExams(storedExams);
  }, []);

  
  const saveToLocalStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addSubject = (values: any) => {
    const newSubjects = [...subjects, { id: Date.now(), ...values }];
    setSubjects(newSubjects);
    saveToLocalStorage('subjects', newSubjects);
    message.success('Môn học đã được thêm thành công');
    setVisible(false);
  };

  const columns = [
    { title: 'Mã Môn', dataIndex: 'id', key: 'id' },
    { title: 'Tên Môn', dataIndex: 'name', key: 'name' },
    { title: 'Số Tín Chỉ', dataIndex: 'credits', key: 'credits' },
    {
      title: 'Thao Tác',
      key: 'action',
      render: (text: any, record: { id: any; }) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => deleteSubject(record.id)}>Xóa</Button>
      ),
    },
  ];

  const deleteSubject = (id: any) => {
    const newSubjects = subjects.filter(subject => subject.id !== id);
    const newQuestions = questions.filter(question => question.subjectId !== id);

    setSubjects(newSubjects);
    setQuestions(newQuestions);
    saveToLocalStorage('subjects', newSubjects);
    saveToLocalStorage('questions', newQuestions);
    
    message.success('Môn học và các câu hỏi liên quan đã được xóa');
  };

  return (
    <div style={{ width: '80%', margin: '0 auto', paddingTop: '20px' }}>
      <h1 style={{ fontSize: '32px', textAlign: 'center' }}>Quản Lý Ngân Hàng Câu Hỏi</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
        Thêm Môn Học
      </Button>
      <Table columns={columns} dataSource={subjects} rowKey="id" style={{ marginTop: 20 }} />
      
      <Modal
        title="Thêm Môn Học"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={addSubject}>
          <Form.Item name="name" label="Tên Môn" rules={[{ required: true, message: 'Vui lòng nhập tên môn!' }]}>
            <Input placeholder="Nhập tên môn học..." />
          </Form.Item>
          <Form.Item name="credits" label="Số Tín Chỉ" rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}>
            <Input type="number" placeholder="Nhập số tín chỉ..." />
          </Form.Item>
          <Button type="primary" htmlType="submit">Thêm</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyMonHoc;
