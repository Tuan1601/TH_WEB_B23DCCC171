import { createContext, useState, useEffect, useContext } from 'react';

// Tạo context
const TaskContext = createContext();

// Hook sử dụng context
export const useTasks = () => useContext(TaskContext);

// Provider component
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // Load tasks và teamMembers từ localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const savedTeamMembers = localStorage.getItem('teamMembers');
    if (savedTeamMembers) {
      setTeamMembers(JSON.parse(savedTeamMembers));
    }
  }, []);

  // Lưu tasks và teamMembers vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Thêm task mới
  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  // Cập nhật task
  const updateTask = (taskId, updatedTask) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
  };

  // Xóa task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Sắp xếp lại các task
  const reorderTasks = (reorderedTasks) => {
    setTasks(reorderedTasks);
  };

  // Thêm thành viên mới
  const addTeamMember = (memberName) => {
    if (!teamMembers.includes(memberName)) {
      setTeamMembers([...teamMembers, memberName]);
    }
  };

  // Tính toán thống kê
  const getStatistics = () => {
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'Đã xong').length,
      inProgress: tasks.filter(task => task.status === 'Đang làm').length,
      notStarted: tasks.filter(task => task.status === 'Chưa làm').length
    };
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      teamMembers,
      addTask,
      updateTask,
      deleteTask,
      reorderTasks,
      addTeamMember,
      getStatistics
    }}>
      {children}
    </TaskContext.Provider>
  );
};
