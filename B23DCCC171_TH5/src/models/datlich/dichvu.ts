import useInitModel from '@/hooks/useInitModel';
import { useEffect } from 'react';

export default () => {
  const objInit = useInitModel<any>('dich-vu');

  // Thêm dữ liệu mẫu khi khởi tạo
  useEffect(() => {
    if (!objInit.data || objInit.data.length === 0) {
      const dichVuMau = [
        {
          _id: '1',
          maDichVu: 'DV001',
          tenDichVu: 'Cắt tóc nam',
          moTa: 'Cắt tóc kiểu nam',
          giaTien: 100000,
          thoiGianThucHien: 30,
          trangThai: true,
          createdAt: '2025-12-03T00:00:00.000Z',
          updatedAt: '2025-12-03T00:00:00.000Z'
        },
        {
          _id: '2',
          maDichVu: 'DV002',
          tenDichVu: 'Làm móng',
          moTa: 'Làm móng tay và chân',
          giaTien: 150000,
          thoiGianThucHien: 60,
          trangThai: true,
          createdAt: '2025-12-03T00:00:00.000Z',
          updatedAt: '2025-12-03T00:00:00.000Z'
        },
        {
          _id: '3',
          maDichVu: 'DV003',
          tenDichVu: 'Massage',
          moTa: 'Massage toàn thân',
          giaTien: 300000,
          thoiGianThucHien: 90,
          trangThai: true,
          createdAt: '2025-12-03T00:00:00.000Z',
          updatedAt: '2025-12-03T00:00:00.000Z'
        },
        {
          _id: '4',
          maDichVu: 'DV004',
          tenDichVu: 'Làm tóc',
          moTa: 'Làm và nhuộm tóc',
          giaTien: 250000,
          thoiGianThucHien: 120,
          trangThai: true,
          createdAt: '2025-12-03T00:00:00.000Z',
          updatedAt: '2025-12-03T00:00:00.000Z'
        },
        {
          _id: '5',
          maDichVu: 'DV005',
          tenDichVu: 'Gội đầu',
          moTa: 'Gội đầu dưỡng sinh',
          giaTien: 80000,
          thoiGianThucHien: 40,
          trangThai: true,
          createdAt: '2025-12-03T00:00:00.000Z',
          updatedAt: '2025-12-03T00:00:00.000Z'
        },
        {
          _id: '6',
          maDichVu: 'DV006',
          tenDichVu: 'Trang điểm',
          moTa: 'Trang điểm chuyên nghiệp',
          giaTien: 500000,
          thoiGianThucHien: 90,
          trangThai: true,
          createdAt: '2025-12-03T00:00:00.000Z',
          updatedAt: '2025-12-03T00:00:00.000Z'
        },
        {
          _id: '7',
          maDichVu: 'DV007',
          tenDichVu: 'Triệt lông',
          moTa: 'Triệt lông toàn thân',
          giaTien: 700000,
          thoiGianThucHien: 120,
          trangThai: true,
          createdAt: '2025-12-03T00:00:00.000Z',
          updatedAt: '2025-12-03T00:00:00.000Z'
        },
        {
          _id: '8',
          maDichVu: 'DV008',
          tenDichVu: 'Tẩy tế bào chết',
          moTa: 'Dịch vụ tẩy tế bào chết toàn thân',
          giaTien: 200000,
          thoiGianThucHien: 45,
          trangThai: true,
          createdAt: '2025-12-03T00:00:00.000Z',
          updatedAt: '2025-12-03T00:00:00.000Z'
        },
        {
          _id: '9',
          maDichVu: 'DV009',
          tenDichVu: 'Nối mi',
          moTa: 'Dịch vụ nối mi chuyên nghiệp',
          giaTien: 300000,
          thoiGianThucHien: 75,
          trangThai: true,
          createdAt: '2025-12-03T00:00:00.000Z',
          updatedAt: '2025-12-03T00:00:00.000Z'
        },
        {
          _id: '10',
          maDichVu: 'DV010',
          tenDichVu: 'Phun xăm môi',
          moTa: 'Dịch vụ phun xăm môi chuyên nghiệp',
          giaTien: 2500000,
          thoiGianThucHien: 180,
          trangThai: true,
          createdAt: '2025-12-03T00:00:00.000Z',
          updatedAt: '2025-12-03T00:00:00.000Z'
        }
      ];
      
      objInit.setData(dichVuMau);
    }
  }, []);

  return {
    ...objInit
  };
};
