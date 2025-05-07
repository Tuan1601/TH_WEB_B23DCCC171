/**
 * Collection of helper functions for the task management app
 */

/**
 * Format date to a readable string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Handle invalid date
    if (isNaN(date.getTime())) return 'Invalid date';
    
    // Format options
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('vi-VN', options);
  };
  
  /**
   * Sort tasks by different criteria
   * @param {Array} tasks - Array of task objects
   * @param {string} sortBy - Sorting criteria ('date', 'status', 'priority')
   * @param {boolean} ascending - Sort direction
   * @returns {Array} - Sorted tasks array
   */
  export const sortTasks = (tasks, sortBy = 'date', ascending = true) => {
    const sortedTasks = [...tasks];
    
    switch (sortBy) {
      case 'date':
        sortedTasks.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return ascending ? dateA - dateB : dateB - dateA;
        });
        break;
      
      case 'status':
        sortedTasks.sort((a, b) => {
          if (ascending) {
            return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
          } else {
            return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
          }
        });
        break;
      
      case 'priority':
        // Assuming priority is a number (1 = high, 2 = medium, 3 = low)
        sortedTasks.sort((a, b) => {
          return ascending 
            ? a.priority - b.priority 
            : b.priority - a.priority;
        });
        break;
        
      default:
        // Default to date sorting
        sortedTasks.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return ascending ? dateA - dateB : dateB - dateA;
        });
    }
    
    return sortedTasks;
  };
  
  /**
   * Filter tasks by different criteria
   * @param {Array} tasks - Array of task objects
   * @param {Object} filters - Filter criteria
   * @returns {Array} - Filtered tasks array
   */
  export const filterTasks = (tasks, filters = {}) => {
    return tasks.filter(task => {
      // Filter by status
      if (filters.status !== undefined && task.completed !== filters.status) {
        return false;
      }
      
      // Filter by priority
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      
      // Filter by search text
      if (filters.searchText) {
        const searchText = filters.searchText.toLowerCase();
        const taskTitle = task.title.toLowerCase();
        const taskDescription = task.description ? task.description.toLowerCase() : '';
        
        if (!taskTitle.includes(searchText) && !taskDescription.includes(searchText)) {
          return false;
        }
      }
      
      // Filter by date range
      if (filters.startDate && filters.endDate) {
        const taskDate = new Date(task.createdAt).getTime();
        const startDate = new Date(filters.startDate).getTime();
        const endDate = new Date(filters.endDate).getTime();
        
        if (taskDate < startDate || taskDate > endDate) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  /**
   * Generate a unique ID
   * @returns {string} - Unique ID
   */
  export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  /**
   * Group tasks by different criteria
   * @param {Array} tasks - Array of task objects
   * @param {string} groupBy - Grouping criteria ('day', 'status', 'priority')
   * @returns {Object} - Grouped tasks object
   */
  export const groupTasks = (tasks, groupBy = 'day') => {
    const grouped = {};
    
    switch (groupBy) {
      case 'day': {
        tasks.forEach(task => {
          const date = new Date(task.createdAt);
          const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
          
          if (!grouped[dayKey]) {
            grouped[dayKey] = [];
          }
          
          grouped[dayKey].push(task);
        });
        break;
      }
      
      case 'status': {
        tasks.forEach(task => {
          const statusKey = task.completed ? 'completed' : 'active';
          
          if (!grouped[statusKey]) {
            grouped[statusKey] = [];
          }
          
          grouped[statusKey].push(task);
        });
        break;
      }
      
      case 'priority': {
        tasks.forEach(task => {
          const priorityKey = task.priority ? task.priority.toString() : 'none';
          
          if (!grouped[priorityKey]) {
            grouped[priorityKey] = [];
          }
          
          grouped[priorityKey].push(task);
        });
        break;
      }
      
      default:
        // Default to no grouping
        grouped['all'] = tasks;
    }
    
    return grouped;
  };
  
  /**
   * Calculate task statistics
   * @param {Array} tasks - Array of task objects
   * @returns {Object} - Task statistics object
   */
  export const calculateTaskStats = (tasks) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Group by priority
    const priorityGroups = {};
    tasks.forEach(task => {
      const priority = task.priority ? task.priority.toString() : 'none';
      
      if (!priorityGroups[priority]) {
        priorityGroups[priority] = 0;
      }
      
      priorityGroups[priority]++;
    });
    
    return {
      totalTasks,
      completedTasks,
      activeTasks,
      completionRate: Math.round(completionRate),
      priorityGroups
    };
  };