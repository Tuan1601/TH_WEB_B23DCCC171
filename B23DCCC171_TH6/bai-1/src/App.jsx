import { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import { TaskProvider } from './contexts/TaskContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';
import 'antd/dist/reset.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <ConfigProvider locale={viVN}>
      <TaskProvider>
        {currentUser ? (
          <Dashboard 
            currentUser={currentUser} 
            onLogout={() => {
              localStorage.removeItem('currentUser');
              setCurrentUser(null);
            }} 
          />
        ) : (
          <Login onLogin={(username) => {
            localStorage.setItem('currentUser', username);
            setCurrentUser(username);
          }} />
        )}
      </TaskProvider>
    </ConfigProvider>
  );
}

export default App;