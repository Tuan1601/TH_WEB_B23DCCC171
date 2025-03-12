declare module DichVu {
  export interface IRecord {
    _id: string;
    maDichVu: string;
    tenDichVu: string;
    moTa?: string;
    giaTien: number;
    thoiGianThucHien: number; 
    trangThai: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
} 