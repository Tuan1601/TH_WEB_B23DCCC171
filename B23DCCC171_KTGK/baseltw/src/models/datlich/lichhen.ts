import useInitModel from '@/hooks/useInitModel';
import { useState, useEffect } from 'react';
import { message } from 'antd';
import { ETrangThaiLichHen } from '@/services/DatLich/LichHen/constants';

export default () => {
  const [visibleFormDatLich, setVisibleFormDatLich] = useState<boolean>(false);
  const [trangThaiFilter, setTrangThaiFilter] = useState<ETrangThaiLichHen | undefined>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  const objInit = useInitModel<any>('lich-hen');
  const objKhachHang = useInitModel<any>('khach-hang');

  useEffect(() => {
    if (!objInit.data || objInit.data.length === 0) {
      taoLichHenMau();
    }

    if (!objKhachHang.data || objKhachHang.data.length === 0) {
      taoDanhSachKhachHangMau();
    }
  }, []);

  const taoDanhSachKhachHangMau = () => {
    const danhSachKhachHang = [
      {
        _id: 'KH001',
        hoTen: 'Nguyễn Văn Anh',
        soDienThoai: '0901234567',
        email: 'nguyenvana@gmail.com',
        diaChi: 'Hà Nội',
        ngaySinh: '1990-05-15',
        gioiTinh: 'Nam',
        loaiKhachHang: 'VIP',
      },
      {
        _id: 'KH002',
        hoTen: 'Lê Thị Bình',
        soDienThoai: '0908765432',
        email: 'lethib@gmail.com',
        diaChi: 'TP. Hồ Chí Minh',
        ngaySinh: '1992-08-20',
        gioiTinh: 'Nữ',
        loaiKhachHang: 'Thường',
      },
      {
        _id: 'KH003',
        hoTen: 'Trần Minh Công',
        soDienThoai: '0977123456',
        email: 'tranminhc@gmail.com',
        diaChi: 'Đà Nẵng',
        ngaySinh: '1988-12-10',
        gioiTinh: 'Nam',
        loaiKhachHang: 'VIP',
      },
      {
        _id: 'KH004',
        hoTen: 'Phạm Thị Dương',
        soDienThoai: '0966543210',
        email: 'phamthid@gmail.com',
        diaChi: 'Hải Phòng',
        ngaySinh: '1995-03-25',
        gioiTinh: 'Nữ',
        loaiKhachHang: 'Thường',
      },
    ];

    objKhachHang.setData(danhSachKhachHang);
  };

  const taoLichHenMau = () => {
    const danhSachMau = [
      {
        _id: '1',
        hoTenKhach: 'Nguyễn Văn Anh',
        soDienThoai: '0901234567',
        email: 'nguyenvana@gmail.com',
        idDichVu: '1',
        dichVu: { _id: '1', tenDichVu: 'Cắt tóc nam', giaTien: 100000 },
        idNhanVien: '1',
        nhanVien: { _id: '1', hoTen: 'Trần Văn Tuấn' },
        ngayHen: '2025-12-01',
        gioHen: '09:00',
        trangThai: ETrangThaiLichHen.XAC_NHAN,
        ghiChu: '',
        createdAt: '2025-11-20T08:00:00.000Z',
        updatedAt: '2025-11-20T08:00:00.000Z',
      },
      {
        _id: '2',
        hoTenKhach: 'Lê Thị Bình',
        soDienThoai: '0908765432',
        email: 'lethib@gmail.com',
        idDichVu: '2',
        dichVu: { _id: '2', tenDichVu: 'Làm móng', giaTien: 150000 },
        idNhanVien: '2',
        nhanVien: { _id: '2', hoTen: 'Nguyễn Thị Hương' },
        ngayHen: '2025-12-02',
        gioHen: '14:00',
        trangThai: ETrangThaiLichHen.CHO_DUYET,
        ghiChu: 'Khách hàng VIP',
        createdAt: '2025-11-21T09:30:00.000Z',
        updatedAt: '2025-11-21T09:30:00.000Z',
      },
    ];

    objInit.setData(danhSachMau);
  };

  return {
    ...objInit,
    visibleFormDatLich,
    setVisibleFormDatLich,
    trangThaiFilter,
    setTrangThaiFilter,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    taoLichHenMau,
    taoDanhSachKhachHangMau,
    danhSachKhachHang: objKhachHang.data,
  };
};
