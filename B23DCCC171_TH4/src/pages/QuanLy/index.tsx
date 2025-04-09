import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, DatePicker, InputNumber, Checkbox } from 'antd';
import moment from 'moment';

const { Column } = Table;

interface MonHoc {
  key: string;
  ten: string;
  lichHoc: LichHoc[];
}

interface LichHoc {
  id: string;
  ngay: string;
  thoiluong: number;
  noidung: string;
  hoanthanh: boolean;
}

const QuanLy: React.FC = () => {
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [selectedMonHoc, setSelectedMonHoc] = useState<MonHoc | null>(null);
  const [isModalMonHocOpen, setIsModalMonHocOpen] = useState(false);
  const [isModalLichHocOpen, setIsModalLichHocOpen] = useState(false);
  const [tenMonHoc, setTenMonHoc] = useState('');
  const [formLichHoc] = Form.useForm();

  const [editingMonHoc, setEditingMonHoc] = useState<MonHoc | null>(null);
  const [editingLichHoc, setEditingLichHoc] = useState<LichHoc | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('monHocList');
    if (storedData) {
      setMonHocList(JSON.parse(storedData));
    }
  }, []);

  const saveToLocalStorage = (data: MonHoc[]) => {
    setMonHocList(data);
    localStorage.setItem('monHocList', JSON.stringify(data));
  };

  const handleAddMonHoc = () => {
    setIsModalMonHocOpen(true);
  };

  const handleSaveMonHoc = () => {
    if (!tenMonHoc.trim()) return;
    const newMonHoc: MonHoc = { key: Date.now().toString(), ten: tenMonHoc, lichHoc: [] };
    saveToLocalStorage([...monHocList, newMonHoc]);
    setIsModalMonHocOpen(false);
    setTenMonHoc('');
  };

  const handleUpdateMonHoc = () => {
    if (editingMonHoc) {
      const updatedList = monHocList.map((mon) =>
        mon.key === editingMonHoc.key ? editingMonHoc : mon
      );
      saveToLocalStorage(updatedList);
      if (selectedMonHoc && selectedMonHoc.key === editingMonHoc.key) {
        setSelectedMonHoc(editingMonHoc);
      }
      setEditingMonHoc(null);
    }
  };

  const handleDeleteMonHoc = (key: string) => {
    const updatedList = monHocList.filter((mon) => mon.key !== key);
    saveToLocalStorage(updatedList);
    if (selectedMonHoc?.key === key) setSelectedMonHoc(null);
  };

  const handleAddLichHoc = () => {
    setIsModalLichHocOpen(true);
  };

  const handleSaveLichHoc = () => {
    if (!selectedMonHoc) return;
    formLichHoc
      .validateFields()
      .then((values) => {
        const newLich: LichHoc = {
          id: Date.now().toString(),
          ngay: values.ngay.format('YYYY-MM-DD'),
          thoiluong: values.thoiluong,
          noidung: values.noidung,
          hoanthanh: false, 
        };
        const updatedMonHocList = monHocList.map((mon) =>
          mon.key === selectedMonHoc.key ? { ...mon, lichHoc: [...mon.lichHoc, newLich] } : mon
        );
        saveToLocalStorage(updatedMonHocList);
        setSelectedMonHoc({ ...selectedMonHoc, lichHoc: [...selectedMonHoc.lichHoc, newLich] });
        setIsModalLichHocOpen(false);
        formLichHoc.resetFields();
      })
      .catch(() => {});
  };

  const handleUpdateLichHoc = () => {
    if (!selectedMonHoc || !editingLichHoc) return;
    const updatedLich = selectedMonHoc.lichHoc.map((l) =>
      l.id === editingLichHoc.id ? editingLichHoc : l
    );
    const updatedMonHocList = monHocList.map((mon) =>
      mon.key === selectedMonHoc.key ? { ...mon, lichHoc: updatedLich } : mon
    );
    saveToLocalStorage(updatedMonHocList);
    setSelectedMonHoc({ ...selectedMonHoc, lichHoc: updatedLich });
    setEditingLichHoc(null);
  };

  const handleDeleteLichHoc = (id: string) => {
    if (!selectedMonHoc) return;
    const updatedLich = selectedMonHoc.lichHoc.filter((l) => l.id !== id);
    const updatedMonHocList = monHocList.map((mon) =>
      mon.key === selectedMonHoc.key ? { ...mon, lichHoc: updatedLich } : mon
    );
    saveToLocalStorage(updatedMonHocList);
    setSelectedMonHoc({ ...selectedMonHoc, lichHoc: updatedLich });
  };

  const handleToggleHoanThanh = (id: string) => {
    if (!selectedMonHoc) return;
    const updatedLich = selectedMonHoc.lichHoc.map((l) =>
      l.id === id ? { ...l, hoanthanh: !l.hoanthanh } : l
    );
    const updatedMonHocList = monHocList.map((mon) =>
      mon.key === selectedMonHoc.key ? { ...mon, lichHoc: updatedLich } : mon
    );
    saveToLocalStorage(updatedMonHocList);
    setSelectedMonHoc({ ...selectedMonHoc, lichHoc: updatedLich });
  };

  return (
    <div>
      <h2>TRANG QUẢN LÝ HỌC TẬP SINH VIÊN</h2>
      <Button type="primary" onClick={handleAddMonHoc}>
        Thêm Môn Học
      </Button>

      <Table dataSource={monHocList} rowKey="key">
        <Column title="Môn Học" dataIndex="ten" key="ten" />
        <Column
          title="Thao tác"
          key="action"
          render={(_, record: MonHoc) => (
            <Space size="middle">
              <Button type="link" onClick={() => setSelectedMonHoc(record)}>
                Chi Tiết
              </Button>
              <Button type="link" onClick={() => setEditingMonHoc(record)}>
                Sửa
              </Button>
              <Button type="link" danger onClick={() => handleDeleteMonHoc(record.key)}>
                Xóa
              </Button>
            </Space>
          )}
        />
      </Table>

      {selectedMonHoc && (
        <div>
          <h3>Chi Tiết Môn Học: {selectedMonHoc.ten}</h3>
          <Button type="primary" onClick={handleAddLichHoc}>
            Thêm Lịch Học
          </Button>

          <Table dataSource={selectedMonHoc.lichHoc} rowKey="id">
            <Column title="Ngày học" dataIndex="ngay" key="ngay" />
            <Column title="Thời lượng (giờ)" dataIndex="thoiluong" key="thoiluong" />
            <Column title="Nội dung" dataIndex="noidung" key="noidung" />
            <Column
              title="Tiến độ"
              key="hoanthanh"
              render={(_, record: LichHoc) => (
                <Checkbox checked={record.hoanthanh} onChange={() => handleToggleHoanThanh(record.id)}>
                  {record.hoanthanh ? 'Hoàn thành' : 'Chưa hoàn thành'}
                </Checkbox>
              )}
            />
            <Column
              title="Thao tác"
              key="action"
              render={(_, record: LichHoc) => (
                <Space size="middle">
                  <Button type="link" onClick={() => setEditingLichHoc(record)}>
                    Sửa
                  </Button>
                  <Button type="link" danger onClick={() => handleDeleteLichHoc(record.id)}>
                    Xóa
                  </Button>
                </Space>
              )}
            />
          </Table>

          <Button onClick={() => setSelectedMonHoc(null)}>Quay lại danh sách</Button>
        </div>
      )}

      <Modal
        title="Thêm Môn Học"
        visible={isModalMonHocOpen}
        onOk={handleSaveMonHoc}
        onCancel={() => setIsModalMonHocOpen(false)}
      >
        <Input
          placeholder="Nhập tên môn học"
          value={tenMonHoc}
          onChange={(e) => setTenMonHoc(e.target.value)}
        />
      </Modal>

      <Modal
        title="Sửa Môn Học"
        visible={!!editingMonHoc}
        onOk={handleUpdateMonHoc}
        onCancel={() => setEditingMonHoc(null)}
      >
        <Input
          value={editingMonHoc?.ten || ''}
          onChange={(e) =>
            setEditingMonHoc(editingMonHoc ? { ...editingMonHoc, ten: e.target.value } : null)
          }
        />
      </Modal>

      <Modal
        title="Thêm Lịch Học"
        visible={isModalLichHocOpen}
        onOk={handleSaveLichHoc}
        onCancel={() => {
          setIsModalLichHocOpen(false);
          formLichHoc.resetFields();
        }}
      >
        <Form form={formLichHoc} layout="vertical">
          <Form.Item label="Ngày học" name="ngay" rules={[{ required: true }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Thời lượng (giờ)" name="thoiluong" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="Nội dung" name="noidung" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Sửa Lịch Học"
        visible={!!editingLichHoc}
        onOk={handleUpdateLichHoc}
        onCancel={() => setEditingLichHoc(null)}
      >
        {editingLichHoc && (
          <Form layout="vertical">
            <Form.Item label="Ngày học">
              <DatePicker
                value={moment(editingLichHoc.ngay, 'YYYY-MM-DD')}
                format="YYYY-MM-DD"
                onChange={(date) =>
                  setEditingLichHoc({ ...editingLichHoc, ngay: date ? date.format('YYYY-MM-DD') : '' })
                }
              />
            </Form.Item>
            <Form.Item label="Thời lượng (giờ)">
              <InputNumber
                min={1}
                value={editingLichHoc.thoiluong}
                onChange={(value) =>
                  setEditingLichHoc({ ...editingLichHoc, thoiluong: value || 0 })
                }
              />
            </Form.Item>
            <Form.Item label="Nội dung">
              <Input.TextArea
                value={editingLichHoc.noidung}
                onChange={(e) =>
                  setEditingLichHoc({ ...editingLichHoc, noidung: e.target.value })
                }
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default QuanLy;
