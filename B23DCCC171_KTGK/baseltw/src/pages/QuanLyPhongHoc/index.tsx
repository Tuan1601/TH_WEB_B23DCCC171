import { Button, Input, Select, Table, message } from 'antd';
import { SetStateAction, useState } from 'react';
import usePhongModel from '@/models/QuanLyPhongHoc';
import ModalPhongHoc from './components/ModalPhongHoc';
import { loaiPhongText, danhSachNguoiPhuTrach } from '@/services/QuanLyPhongHoc/contants';

const { Option } = Select;

const QuanLyPhongHoc = () => {
	const { data, themPhong, suaPhong, xoaPhong } = usePhongModel();
	const [searchTerm, setSearchTerm] = useState('');
	const [loaiPhongFilter, setLoaiPhongFilter] = useState('');
	const [visible, setVisible] = useState(false);
	const [editingRoom, setEditingRoom] = useState(null);

	const filteredData = data
		.filter(
			(room) => room.maPhong?.includes(searchTerm) || room.tenPhong?.toLowerCase().includes(searchTerm.toLowerCase()),
		)
		.filter((room) => !loaiPhongFilter || room.loaiPhong === loaiPhongFilter);

	const columns = [
		{ title: 'Mã phòng', dataIndex: 'maPhong', key: 'maPhong' },
		{ title: 'Tên phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
		{
			title: 'Số chỗ ngồi',
			dataIndex: 'soChoNgoi',
			key: 'soChoNgoi',
			sorter: (a: { soChoNgoi: number }, b: { soChoNgoi: number }) => a.soChoNgoi - b.soChoNgoi,
		},
		{
			title: 'Loại phòng',
			dataIndex: 'loaiPhong',
			key: 'loaiPhong',
			render: (loaiPhong: string | number) => loaiPhongText[loaiPhong],
		},
		{
			title: 'Người phụ trách',
			dataIndex: 'nguoiPhuTrach',
			key: 'nguoiPhuTrach',
			render: (id: string) => {
				const nguoiPhuTrach = danhSachNguoiPhuTrach.find((n) => n.id === id);
				return nguoiPhuTrach ? `${nguoiPhuTrach.name} (${nguoiPhuTrach.email})` : 'N/A';
			},
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (text: any, record: SetStateAction<null>) => (
				<>
					<Button
						onClick={() => {
							setEditingRoom(record);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Button
						danger
						onClick={() => {
							if (record.soChoNgoi < 30) {
								xoaPhong(record._id);
							} else {
								message.error('Chỉ được xóa phòng có dưới 30 chỗ ngồi!');
							}
						}}
					>
						Xóa
					</Button>
				</>
			),
		},
	];

	return (
		<div>
			<Input
				placeholder='Tìm theo mã hoặc tên phòng'
				onChange={(e) => setSearchTerm(e.target.value)}
				style={{ marginBottom: 10 }}
			/>
			<Select
				placeholder='Lọc theo loại phòng'
				onChange={setLoaiPhongFilter}
				allowClear
				style={{ marginBottom: 10, marginLeft: 10 }}
			>
				{Object.entries(loaiPhongText).map(([key, value]) => (
					<Option key={key} value={key}>
						{value}
					</Option>
				))}
			</Select>

			<Button type='primary' onClick={() => setVisible(true)} style={{ marginLeft: 10 }}>
				Thêm phòng
			</Button>

			<Table dataSource={filteredData} columns={columns} pagination={{ pageSize: 10 }} rowKey='_id' />

			<ModalPhongHoc
				visible={visible}
				onClose={() => {
					setVisible(false);
					setEditingRoom(null);
				}}
				onSubmit={(formData: {
					maPhong: string | any[];
					tenPhong: string | any[];
					soChoNgoi: any;
					loaiPhong: any;
					nguoiPhuTrach: any;
					_id: any;
				}) => {
					if (
						!formData.maPhong ||
						!formData.tenPhong ||
						!formData.soChoNgoi ||
						!formData.loaiPhong ||
						!formData.nguoiPhuTrach
					) {
						message.error('Không được để trống thông tin!');
						return;
					}
					if (formData.maPhong.length > 10) {
						message.error('Mã phòng không được quá 10 ký tự!');
						return;
					}
					if (formData.tenPhong.length > 50) {
						message.error('Tên phòng không được quá 50 ký tự!');
						return;
					}

					if (formData._id) {
						suaPhong(formData);
					} else {
						if (data.some((room) => room.tenPhong === formData.tenPhong)) {
							message.error('Tên phòng đã tồn tại!');
							return;
						}
						if (data.some((room) => room.maPhong === formData.maPhong)) {
							message.error('Mã phòng đã tồn tại!');
							return;
						}
						themPhong(formData);
					}

					setVisible(false);
				}}
				initialValues={editingRoom}
			/>
		</div>
	);
};

export default QuanLyPhongHoc;
