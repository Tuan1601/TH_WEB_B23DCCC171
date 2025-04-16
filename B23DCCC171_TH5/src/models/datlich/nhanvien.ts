import useInitModel from '@/hooks/useInitModel';
import { useState, useEffect } from 'react';

export default () => {
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const objInit = useInitModel<any>('nhan-vien');

  useEffect(() => {
    if (!objInit.data || objInit.data.length === 0) {
      const nhanVienMau = [
        {
          _id: '1',
          maNhanVien: 'NV001',
          hoTen: 'Trần Văn Tuấn',
          soDienThoai: '0901234567',
          email: 'trantuan@gmail.com',
          gioiTinh: 'Nam',
          ngaySinh: '1990-05-15',
          diaChi: 'Hà Nội',
          chuyenMon: ['1', '3'],
          soKhachToiDa: 10,
          lichLamViec: [
            { thu: 1, gioLam: '08:00', gioNghi: '17:00' },
            { thu: 2, gioLam: '08:00', gioNghi: '17:00' },
            { thu: 3, gioLam: '08:00', gioNghi: '17:00' },
          ],
          trangThai: true,
        },
        {
          _id: '2',
          maNhanVien: 'NV002',
          hoTen: 'Nguyễn Thị Hương',
          soDienThoai: '0908765432',
          email: 'huong@gmail.com',
          gioiTinh: 'Nữ',
          ngaySinh: '1992-08-20',
          diaChi: 'TP. Hồ Chí Minh',
          chuyenMon: ['2', '4'],
          soKhachToiDa: 8,
          lichLamViec: [
            { thu: 2, gioLam: '08:00', gioNghi: '17:00' },
            { thu: 3, gioLam: '08:00', gioNghi: '17:00' },
            { thu: 5, gioLam: '08:00', gioNghi: '17:00' },
          ],
          trangThai: true,
        },
        {
          _id: '3',
          maNhanVien: 'NV003',
          hoTen: 'Lê Minh Quân',
          soDienThoai: '0977123456',
          email: 'lequan@gmail.com',
          gioiTinh: 'Nam',
          ngaySinh: '1988-12-10',
          diaChi: 'Đà Nẵng',
          chuyenMon: ['1', '4'],
          soKhachToiDa: 12,
          lichLamViec: [
            { thu: 1, gioLam: '08:00', gioNghi: '17:00' },
            { thu: 4, gioLam: '08:00', gioNghi: '17:00' },
          ],
          trangThai: true,
        },
        {
          _id: '4',
          maNhanVien: 'NV004',
          hoTen: 'Phạm Thị Lan',
          soDienThoai: '0966543210',
          email: 'lan@gmail.com',
          gioiTinh: 'Nữ',
          ngaySinh: '1995-03-25',
          diaChi: 'Hải Phòng',
          chuyenMon: ['2', '3'],
          soKhachToiDa: 9,
          lichLamViec: [
            { thu: 1, gioLam: '13:00', gioNghi: '21:00' },
            { thu: 5, gioLam: '13:00', gioNghi: '21:00' },
          ],
          trangThai: true,
        },
        ...Array.from({ length: 10 }, (_, i) => ({
          _id: (5 + i).toString(),
          maNhanVien: `NV00${5 + i}`,
          hoTen: `Nhân Viên ${i + 1}`,
          soDienThoai: `090${Math.floor(1000000 + Math.random() * 9000000)}`,
          email: `nhanvien${i + 1}@gmail.com`,
          gioiTinh: i % 2 === 0 ? 'Nam' : 'Nữ',
          ngaySinh: `199${Math.floor(Math.random() * 10)}-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1}`,
          diaChi: ['Hà Nội', 'Hải Phòng', 'Đà Nẵng', 'TP. Hồ Chí Minh'][Math.floor(Math.random() * 4)],
          chuyenMon: [`${Math.floor(Math.random() * 4) + 1}`, `${Math.floor(Math.random() * 4) + 1}`],
          soKhachToiDa: Math.floor(Math.random() * 5) + 5,
          lichLamViec: [
            { thu: Math.floor(Math.random() * 7), gioLam: '08:00', gioNghi: '17:00' },
            { thu: Math.floor(Math.random() * 7), gioLam: '08:00', gioNghi: '17:00' },
          ],
          trangThai: true,
        })),
      ];

      objInit.setData(nhanVienMau);
    }
  }, []);

  const kiemTraNhanVienCoTheLam = async (idNhanVien: string, ngayHen: string, gioHen: string): Promise<boolean> => {
    try {
      const nhanVien = objInit.data.find((nv: any) => nv._id === idNhanVien);
      if (!nhanVien) return false;

      const ngay = new Date(ngayHen);
      const thu = ngay.getDay();

      const lichLamViec = nhanVien.lichLamViec.find((lich: any) => lich.thu === thu);
      if (!lichLamViec) return false;

      return gioHen >= lichLamViec.gioLam && gioHen <= lichLamViec.gioNghi;
    } catch (error) {
      console.log('Lỗi kiểm tra lịch nhân viên:', error);
      return false;
    }
  };

  return {
    ...objInit,
    visibleForm,
    setVisibleForm,
    kiemTraNhanVienCoTheLam,
  };
};
