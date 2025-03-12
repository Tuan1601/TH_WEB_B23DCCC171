import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const QuanLyDeThi = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedExams = JSON.parse(localStorage.getItem('exams')) || [];
    const storedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
    setExams(storedExams);
    setSubjects(storedSubjects);
    setQuestions(storedQuestions);
  }, []);

  const saveToLocalStorage = (key: string, data: { id: number; subject: any; questions: any[]; }[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const createExam = (values: { subject: any; easy: any; medium: any; hard: any; veryHard: any; }) => {
    const { subject, easy, medium, hard, veryHard } = values;
    const selectedQuestions: never[] = [];

    const filteredQuestions = questions.filter(q => q.subject === subject);
    
    const pickQuestions = (level: string, count: number | undefined) => {
      return filteredQuestions.filter(q => q.level === level).slice(0, count);
    };
    
    selectedQuestions.push(...pickQuestions('Dễ', easy));
    selectedQuestions.push(...pickQuestions('Trung bình', medium));
    selectedQuestions.push(...pickQuestions('Khó', hard));
    selectedQuestions.push(...pickQuestions('Rất khó', veryHard));

    if (selectedQuestions.length < easy + medium + hard + veryHard) {
      message.error('Không đủ câu hỏi để tạo đề thi!');
      return;
    }

    const newExam = { id: Date.now(), subject, questions: selectedQuestions };
    const newExams = [...exams, newExam];
    setExams(newExams);
    saveToLocalStorage('exams', newExams);
    message.success('Đề thi đã được tạo thành công');
    setVisible(false);
    form.resetFields();
  };

  const deleteExam = (id: any) => {
    const newExams = exams.filter(exam => exam.id !== id);
    setExams(newExams);
    saveToLocalStorage('exams', newExams);
    message.success('Đề thi đã được xóa');
  };

  const columns = [
    { title: 'Mã Đề', dataIndex: 'id', key: 'id' },
    { title: 'Môn Học', dataIndex: 'subject', key: 'subject' },
    { 
      title: 'Số Câu Hỏi', 
      dataIndex: 'questions', 
      key: 'questions',
      render: (questions: string | any[]) => questions.length
    },
    {
      title: 'Thao Tác',
      key: 'action',
      render: (text: any, record: { id: any; }) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => deleteExam(record.id)}>Xóa</Button>
      ),
    },
  ];

  return (
    <div style={{ width: '80%', margin: '0 auto', paddingTop: '20px' }}>
      <h1 style={{ fontSize: '32px', textAlign: 'center' }}>Quản Lý Đề Thi</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>Tạo Đề Thi</Button>
      <Table columns={columns} dataSource={exams} rowKey="id" style={{ marginTop: 20 }} />
      
      <Modal title="Tạo Đề Thi" visible={visible} onCancel={() => setVisible(false)} footer={null}>
        <Form form={form} onFinish={createExam}>
          <Form.Item name="subject" label="Môn Học" rules={[{ required: true }]}>  
            <Select placeholder="Chọn môn học">
              {subjects.map(s => <Option key={s.id} value={s.name}>{s.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="easy" label="Số câu Dễ" rules={[{ required: true }]}>  
            <Input type="number" placeholder="Số câu dễ" />
          </Form.Item>
          <Form.Item name="medium" label="Số câu Trung Bình" rules={[{ required: true }]}>  
            <Input type="number" placeholder="Số câu trung bình" />
          </Form.Item>
          <Form.Item name="hard" label="Số câu Khó" rules={[{ required: true }]}>  
            <Input type="number" placeholder="Số câu khó" />
          </Form.Item>
          <Form.Item name="veryHard" label="Số câu Rất Khó" rules={[{ required: true }]}>  
            <Input type="number" placeholder="Số câu rất khó" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Tạo</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyDeThi;
