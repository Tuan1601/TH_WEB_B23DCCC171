export enum ETrangThaiNhanVien {
	HOAT_DONG = 'HOAT_DONG',
	NGHI_PHEP = 'NGHI_PHEP',
	NGHI_VIEC = 'NGHI_VIEC',
}

export const trangThaiNhanVienText = {
	[ETrangThaiNhanVien.HOAT_DONG]: 'Hoạt động',
	[ETrangThaiNhanVien.NGHI_PHEP]: 'Nghỉ phép',
	[ETrangThaiNhanVien.NGHI_VIEC]: 'Nghỉ việc',
};

export const trangThaiNhanVienColor = {
	[ETrangThaiNhanVien.HOAT_DONG]: 'green',
	[ETrangThaiNhanVien.NGHI_PHEP]: 'orange',
	[ETrangThaiNhanVien.NGHI_VIEC]: 'red',
};

export enum EGioiTinh {
	NAM = 'Nam',
	NU = 'Nữ',
	KHAC = 'Khác',
}

export const thuTrongTuan = [
	{ value: 0, label: 'Chủ nhật' },
	{ value: 1, label: 'Thứ 2' },
	{ value: 2, label: 'Thứ 3' },
	{ value: 3, label: 'Thứ 4' },
	{ value: 4, label: 'Thứ 5' },
	{ value: 5, label: 'Thứ 6' },
	{ value: 6, label: 'Thứ 7' },
];

