import { Card, Tag, Space, Button, Avatar } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import { useTasks } from '../../contexts/TaskContext';
import './TaskItem.css';



// Định nghĩa các màu sắc cho trạng thái và ưu tiên
const priorityColors = {
  'Thấp': 'blue',
  'Trung bình': 'orange',
  'Cao': 'red'
};

const statusColors = {
  'Chưa làm': 'gray',
  'Đang làm': 'orange',
  'Đã xong': 'green'
};

const statusIcons = {
  'Chưa làm': <ClockCircleOutlined />,
  'Đang làm': <ExclamationCircleOutlined />,
  'Đã xong': <CheckCircleOutlined />
};

function TaskItem({ task, isCurrentUserTask, onEdit }) {
  const { deleteTask } = useTasks();

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <Card 
      className={`task-item ${isCurrentUserTask ? 'current-user-task' : ''}`}
      size="small"
    >
      <div className="task-item-content">
        <div className="task-item-info">
          <div className="task-item-title">{task.name}</div>
          <div className="task-item-assignee">
            <Space>
              <Avatar size="small" icon={<UserOutlined />} />
              {task.assignee}
            </Space>
          </div>
        </div>
        <div className="task-item-actions">
          <Space>
            <Tag color={priorityColors[task.priority]}>
              {task.priority}
            </Tag>
            <Tag color={statusColors[task.status]} icon={statusIcons[task.status]}>
              {task.status}
            </Tag>
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={onEdit} 
            />
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={handleDelete} 
            />
          </Space>
        </div>
      </div>
    </Card>
  );
}

export default TaskItem;