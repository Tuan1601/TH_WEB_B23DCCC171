declare module Phong {
    export interface IRecord {
        _id: string;
        maPhong: string;
        tenPhong: string;
        soChoNgoi: number;
        loaiPhong: ELoaiPhong;
        nguoiPhuTrach: string;
        trangThai: ETrangThaiPhong;
        createdAt?: string;
        updatedAt?: string;
    }
}
