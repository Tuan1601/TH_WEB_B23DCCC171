import { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space } from 'antd';
import { useTasks } from '../../contexts/TaskContext';

const { Option } = Select;

function TaskForm({ visible, task, currentUser, onClose }) {
  const { teamMembers, addTask, updateTask } = useTasks();
  const [form] = Form.useForm();

  // Cập nhật giá trị form khi task thay đổi
  useEffect(() => {
    if (task) {
      form.setFieldsValue(task);
    } else {
      form.setFieldsValue({
        name: '',
        description: '',
        assignee: currentUser,
        priority: 'Trung bình',
        status: 'Chưa làm'
      });
    }
  }, [task, form, currentUser]);

  // Xử lý lưu task
  const handleSave = (values) => {
    if (task) {
      // Cập nhật task
      updateTask(task.id, values);
    } else {
      // Thêm task mới
      addTask({
        ...values,
        createdBy: currentUser
      });
    }

    onClose();
  };

  return (
    <Modal
      title={task ? 'Sửa công việc' : 'Thêm công việc mới'}
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      forceRender // ✅ Thêm để tránh cảnh báo useForm
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Form.Item
          name="name"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
        >
          <Input placeholder="Nhập tên công việc" />
        </Form.Item>

        <Form.Item
          name="assignee"
          label="Người được giao"
        >
          <Select placeholder="Chọn người được giao">
            {teamMembers.map(member => (
              <Option key={member} value={member}>{member}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
        >
          <Select>
            <Option value="Thấp">Thấp</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Cao">Cao</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
        >
          <Select>
            <Option value="Chưa làm">Chưa làm</Option>
            <Option value="Đang làm">Đang làm</Option>
            <Option value="Đã xong">Đã xong</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả công việc" />
        </Form.Item>

        <Form.Item>
          <Space className="form-buttons">
            <Button onClick={onClose}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {task ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TaskForm;
