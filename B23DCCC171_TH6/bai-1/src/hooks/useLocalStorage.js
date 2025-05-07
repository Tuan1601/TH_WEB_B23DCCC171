import { useState, useEffect } from 'react';

/**
 * Custom hook to persist data in localStorage
 * @param {string} key - The key under which the value is stored in localStorage
 * @param {any} initialValue - The initial value to use if no value is found in localStorage
 * @returns {[any, function]} - A stateful value and a function to update it
 */
const useLocalStorage = (key, initialValue) => {
  // Hàm để lấy giá trị từ localStorage
  const getStoredValue = () => {
    try {
      // Lấy giá trị từ localStorage bằng key
      const item = localStorage.getItem(key);
      // Trả về giá trị đã parse hoặc initialValue nếu item không tồn tại
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State để lưu trữ giá trị hiện tại
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Hàm để cập nhật giá trị trong state và localStorage
  const setValue = (value) => {
    try {
      // Cho phép value là một function như trong useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Lưu vào state
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Theo dõi thay đổi key để cập nhật state
  useEffect(() => {
    setStoredValue(getStoredValue());
  }, [key]);

  // Lắng nghe sự kiện storage để đồng bộ giữa các tab
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    // Thêm event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;