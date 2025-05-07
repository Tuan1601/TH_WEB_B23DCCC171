import { Card, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTasks } from '../../contexts/TaskContext';

const { Option } = Select;

function TaskFilters({
  searchKeyword,
  statusFilter,
  assigneeFilter,
  onSearchChange,
  onStatusChange,
  onAssigneeChange,
  onAddTask
}) {
  const { teamMembers } = useTasks();

  return (
    <Card className="filters-card">
      <Space wrap size="middle">
        <Input
          placeholder="Tìm kiếm công việc"
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />

        <Select
          placeholder="Lọc theo trạng thái"
          value={statusFilter}
          onChange={onStatusChange}
          style={{ width: 150 }}
        >
          <Option value="Tất cả">Tất cả trạng thái</Option>
          <Option value="Chưa làm">Chưa làm</Option>
          <Option value="Đang làm">Đang làm</Option>
          <Option value="Đã xong">Đã xong</Option>
        </Select>

        <Select
          placeholder="Lọc theo người được giao"
          value={assigneeFilter}
          onChange={onAssigneeChange}
          style={{ width: 200 }}
        >
          <Option value="Tất cả">Tất cả người dùng</Option>
          {teamMembers.map((member) => (
            <Option key={member} value={member}>{member}</Option>
          ))}
        </Select>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddTask}
        >
          Thêm công việc
        </Button>
      </Space>
    </Card>
  );
}

export default TaskFilters;