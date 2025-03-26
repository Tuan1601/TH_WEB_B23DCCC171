import { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { ELoaiPhong } from '@/services/QuanLyPhongHoc/contants';

export const danhSachNguoiPhuTrach = [
  { id: 'NV001', name: 'Nguyễn Văn A' },
  { id: 'NV002', name: 'Trần Thị B' },
  { id: 'NV003', name: 'Lê Hoàng C' }
];

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loaiPhongFilter, setLoaiPhongFilter] = useState<ELoaiPhong | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const storedData = localStorage.getItem('phong-hoc');
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      taoDanhSachPhongMau();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('phong-hoc', JSON.stringify(data));
  }, [data]);

  const taoDanhSachPhongMau = () => {
    const danhSachPhong = [
      { _id: 'P001', maPhong: '101', tenPhong: 'Phòng A1', soChoNgoi: 50, loaiPhong: ELoaiPhong.LY_THUYET, nguoiPhuTrach: 'NV001' },
      { _id: 'P002', maPhong: '102', tenPhong: 'Phòng B1', soChoNgoi: 30, loaiPhong: ELoaiPhong.THUC_HANH, nguoiPhuTrach: 'NV002' },
      { _id: 'P003', maPhong: '103', tenPhong: 'Phòng Hội trường C', soChoNgoi: 100, loaiPhong: ELoaiPhong.HOI_TRUONG, nguoiPhuTrach: 'NV003' }
    ];
    setData(danhSachPhong);
  };

  const suaPhong = (room: any) => {
    if (!room.maPhong || !room.tenPhong || !room.soChoNgoi || !room.loaiPhong || !room.nguoiPhuTrach) {
      return message.error('Vui lòng điền đầy đủ thông tin.');
    }
  
    const updatedRooms = data.map((r) => (r._id === room._id ? { ...r, ...room } : r));
    setData(updatedRooms);
    message.success('Cập nhật phòng thành công.');
  };
  
  const themPhong = (room: any) => {
    if (!room.maPhong || !room.tenPhong || !room.soChoNgoi || !room.loaiPhong || !room.nguoiPhuTrach) {
      return message.error('Vui lòng điền đầy đủ thông tin.');
    }
  
    if (data.some((r) => r.maPhong === room.maPhong)) {
      return message.error('Mã phòng đã tồn tại!');
    }
    if (data.some((r) => r.tenPhong === room.tenPhong)) {
      return message.error('Tên phòng đã tồn tại!');
    }
  
    const newRoom = { ...room, _id: `P${Date.now()}` };
    setData([...data, newRoom]);
    message.success('Thêm phòng thành công.');
  };
  

  const xoaPhong = (roomId: string) => {
    const room = data.find((r) => r._id === roomId);
    if (!room) return;

    Modal.confirm({
      title: 'Xác nhận xóa phòng',
      content: `Bạn có chắc chắn muốn xóa phòng "${room.tenPhong}" không?`,
      onOk: () => {
        setData(data.filter((r) => r._id !== roomId));
        message.success('Xóa phòng thành công.');
      }
    });
  };

  return { 
    data, 
    searchTerm, setSearchTerm, 
    loaiPhongFilter, setLoaiPhongFilter, 
    sortOrder, setSortOrder, 
    themPhong,suaPhong, xoaPhong 
  };
};
