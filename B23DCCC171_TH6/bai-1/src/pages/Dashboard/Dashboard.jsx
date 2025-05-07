import { useState, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import { useTasks } from '../../contexts/TaskContext';
import Header from '../../components/Header/Header';
import TaskStatistics from '../../components/TaskStatistics/TaskStatistics';
import TaskFilters from '../../components/TaskFilters/TaskFilters';
import TaskList from '../../components/TaskList/TaskList';
import TaskForm from '../../components/TaskForm/TaskForm';
import './Dashboard.css';

const { Content, Footer } = Layout;

function Dashboard({ currentUser, onLogout }) {
  const { tasks, getStatistics } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [assigneeFilter, setAssigneeFilter] = useState('Tất cả');
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Lọc tasks dựa vào các bộ lọc
  useEffect(() => {
    let filtered = [...tasks];

    // Lọc theo từ khóa
    if (searchKeyword) {
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (statusFilter !== 'Tất cả') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Lọc theo người được giao
    if (assigneeFilter !== 'Tất cả') {
      filtered = filtered.filter(task => task.assignee === assigneeFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchKeyword, statusFilter, assigneeFilter]);

  // Xử lý mở form chỉnh sửa task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskModalVisible(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setTaskModalVisible(false);
    setEditingTask(null);
  };

  return (
    <Layout className="dashboard-layout">
      <Header 
        currentUser={currentUser} 
        onLogout={onLogout} 
      />
      
      <Content className="dashboard-content">
        <Row gutter={[16, 16]}>
          {/* Phần thống kê */}
          <Col span={24}>
            <TaskStatistics statistics={getStatistics()} />
          </Col>
          
          {/* Phần bộ lọc và tìm kiếm */}
          <Col span={24}>
            <TaskFilters
              searchKeyword={searchKeyword}
              statusFilter={statusFilter}
              assigneeFilter={assigneeFilter}
              onSearchChange={setSearchKeyword}
              onStatusChange={setStatusFilter}
              onAssigneeChange={setAssigneeFilter}
              onAddTask={() => setTaskModalVisible(true)}
            />
          </Col>
          
          {/* Danh sách công việc */}
          <Col span={24}>
            <TaskList 
              tasks={filteredTasks}
              currentUser={currentUser}
              onEditTask={handleEditTask}
            />
          </Col>
        </Row>
      </Content>
      
      {/* Form thêm/sửa công việc */}
      <TaskForm
        visible={taskModalVisible}
        task={editingTask}
        currentUser={currentUser}
        onClose={handleCloseModal}
      />
      
      <Footer className="dashboard-footer">
        Ứng dụng Quản lý Công việc Nhóm © {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

export default Dashboard;