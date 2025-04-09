declare module LichHen {
	export enum ETrangThaiLichHen {
		CHO_DUYET = 'CHO_DUYET',
		XAC_NHAN = 'XAC_NHAN',
		HOAN_THANH = 'HOAN_THANH',
		HUY = 'HUY',
	}

	export interface IRecord {
		_id: string;
		hoTenKhach: string;
		soDienThoai: string;
		email?: string;
		idDichVu: string;
		dichVu?: DichVu.IRecord;
		idNhanVien: string;
		nhanVien?: NhanVien.IRecord;
		ngayHen: string; 
		gioHen: string;
		trangThai: ETrangThaiLichHen;
		ghiChu?: string;
		createdAt?: string;
		updatedAt?: string;
		feedback?: string;
		rateScore?: number;
	}
}
