import { useState } from 'react';

export default () => {
	const [data, setData] = useState<TodoList.Record[]>([
		{ id: 1, name: 'Task 1', description: 'Descriptions 1', color: 'red', status: false },
		{ id: 2, name: 'Task 2', description: 'Descriptions 2', color: 'green', status: false },
		{ id: 3, name: 'Task 3', description: 'Descriptions 3', color: 'blue', status: false },
	]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<TodoList.Record>();

	const addTask = (task: TodoList.Record) => {
		setData([...data, { ...task, id: Date.now() }]);
	};

	const updateTask = (task: TodoList.Record) => {
		setData(data.map((item) => (item.id === task.id ? task : item)));
	};

	const deleteTask = (id: number) => {
		setData(data.filter((item) => item.id !== id));
	};

	const toggleStatus = (id: number) => {
		setData(data.map((item) => (item.id === id ? { ...item, status: !item.status } : item)));
	};

	return {
		data,
		visible,
		setVisible,
		row,
		setRow,
		isEdit,
		setIsEdit,
		setData,
		addTask,
		updateTask,
		deleteTask,
		toggleStatus,
	};
};