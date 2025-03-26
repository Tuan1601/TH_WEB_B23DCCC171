export enum ETrangThaiPhong {
    SU_DUNG = 'SU_DUNG',
    BAO_TRI = 'BAO_TRI',
    KHONG_SU_DUNG = 'KHONG_SU_DUNG'
  }
  
  export const trangThaiPhongText = {
    [ETrangThaiPhong.SU_DUNG]: 'Sử dụng',
    [ETrangThaiPhong.BAO_TRI]: 'Bảo trì',
    [ETrangThaiPhong.KHONG_SU_DUNG]: 'Không sử dụng'
  };
  
  export const trangThaiPhongColor = {
    [ETrangThaiPhong.SU_DUNG]: 'green',
    [ETrangThaiPhong.BAO_TRI]: 'orange',
    [ETrangThaiPhong.KHONG_SU_DUNG]: 'red'
  };
  
  export enum ELoaiPhong {
    LY_THUYET = 'LY_THUYET',
    THUC_HANH = 'THUC_HANH',
    HOI_TRUONG = 'HOI_TRUONG'
  }
  
  export const loaiPhongText = {
    [ELoaiPhong.LY_THUYET]: 'Lý thuyết',
    [ELoaiPhong.THUC_HANH]: 'Thực hành',
    [ELoaiPhong.HOI_TRUONG]: 'Hội trường'
  };
  export interface INguoiPhuTrach {
    email: any;
    id: string;
    name: string;
  }
  
  export const danhSachNguoiPhuTrach: INguoiPhuTrach[] = [
    { id: 'NV001', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com' },
    { id: 'NV002', name: 'Trần Thị B', email: 'tranthib@example.com' },
    { id: 'NV003', name: 'Lê Hoàng C', email: 'lehoangc@example.com' }
  ];
  
  export const nguoiPhuTrachText = (id: string) => {
    const nguoi = danhSachNguoiPhuTrach.find((n) => n.id === id);
    return nguoi ? nguoi.name : 'Không xác định';
  };