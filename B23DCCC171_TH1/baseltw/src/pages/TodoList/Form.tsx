import { Form, Input, Select, Button } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormTodoList = () => {
	const { row, isEdit, setVisible, addTask, updateTask } = useModel('todolist');
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({
			name: row?.name || '',
			description: row?.description || '',
			color: row?.color || '',
			status: row?.status ? 'done' : 'todo',
		});
	}, [row, form]);

	const handleSubmit = (values: any) => {
		const taskData = {
			id: row?.id || Date.now(),
			name: values.name,
			description: values.description,
			color: values.color,
			status: values.status === 'done',
		};

		if (isEdit) {
			updateTask(taskData);
		} else {
			addTask(taskData);
		}
		setVisible(false);
	};

	return (
		<Form form={form} onFinish={handleSubmit}>
			<Form.Item name='name' label='Task name' rules={[{ required: true, message: 'Please input your task name!' }]}>
				<Input type='text' placeholder='Enter task name ...' />
			</Form.Item>
			<Form.Item
				name='description'
				label='Description'
				rules={[{ required: true, message: 'Please input your description!' }]}
			>
				<Input.TextArea placeholder='Enter description ...' />
			</Form.Item>
			<Form.Item
				name='color'
				label='Color'
				rules={[{ required: true, message: 'Please select your color!' }]}
				initialValue='red'
			>
				<Input type='color'></Input>
			</Form.Item>
			<Form.Item
				name='status'
				label='Status'
				rules={[{ required: true, message: 'Please select your status!' }]}
				initialValue='todo'
			>
				<Select>
					<Select.Option value='todo'>Todo</Select.Option>
					<Select.Option value='done'>Done</Select.Option>
				</Select>
			</Form.Item>
			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{isEdit ? 'Save' : 'Insert'}
				</Button>
				<Button onClick={() => setVisible(false)}>Cancel</Button>
			</div>
		</Form>
	);
};

export default FormTodoList;