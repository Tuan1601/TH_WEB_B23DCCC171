declare module NhanVien {
	export interface ILichLamViec {
		thu: number; 
		gioLam: string; 
		gioNghi: string;
	}

	export interface IRecord {
		_id: string;
		maNhanVien: string;
		hoTen: string;
		soDienThoai: string;
		email?: string;
		gioiTinh: 'Nam' | 'Nữ';
		anhDaiDien?: string;
		ngaySinh?: string;
		diaChi?: string;
		chuyenMon?: string[];
		soKhachToiDa: number;
		lichLamViec: ILichLamViec[];
		trangThai: boolean;
		createdAt?: string;
		updatedAt?: string;
    	feedbacks: string[];
		averageRate?: number;

	}
}
