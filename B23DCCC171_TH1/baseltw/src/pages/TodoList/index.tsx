import { Button, Modal, message, Card, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './component/style.less';
import FormTodoList from './Form';
import { useModel } from 'umi';

const TodoList = () => {
	const { data, setVisible, isEdit, setRow, setIsEdit, visible, deleteTask, toggleStatus } = useModel('todolist');

	const [messageApi, contextHolder] = message.useMessage();
	const success = () => {
		messageApi.open({
			type: 'success',
			content: 'Task has been deleted',
			duration: 2,
		});
	};

	return (
		<>
			{contextHolder}
			<div style={{ width: '60%', margin: '0 auto' }}>
				<h1 style={{ fontSize: '40px' }}>TodoList</h1>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
					<Button
						type='primary'
						onClick={(e) => {
							setVisible(true);
							setIsEdit(false);
						}}
					>
						Create task
					</Button>
				</div>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
					{data.map((task) => (
						<Card
							title={task.name}
							style={{ marginBottom: '10px', opacity: task.status ? 0.5 : 1, borderTop: `5px solid ${task.color}` }}
							onClick={() => toggleStatus(task.id)}
							hoverable
						>
							<p>{task.description}</p>
							<Tag color={task.status ? 'green' : 'red'} style={{ marginBottom: '10px' }}>
								{task.status ? 'Done' : 'Todo'}
							</Tag>
							<div>
								<Button
									type='primary'
									onClick={(e) => {
										e.stopPropagation();
										setVisible(true);
										setRow(task);
										setIsEdit(true);
									}}
									icon={<EditOutlined />}
								/>
								<Button
									danger
									style={{ marginLeft: 10 }}
									icon={<DeleteOutlined />}
									onClick={(e) => {
										e.stopPropagation();
										success();
										deleteTask(task.id);
									}}
								/>
							</div>
						</Card>
					))}
				</div>
				<Modal
					destroyOnClose
					footer={false}
					visible={visible}
					onOk={() => {}}
					onCancel={() => {
						setVisible(false);
					}}
					title={isEdit ? 'Edit task' : 'Add task'}
				>
					<FormTodoList />
				</Modal>
			</div>
		</>
	);
};

export default TodoList;