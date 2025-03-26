import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { useEffect } from 'react';
import { loaiPhongText, danhSachNguoiPhuTrach } from '@/services/QuanLyPhongHoc/contants';

const { Option } = Select;

const ModalPhongHoc = ({ visible, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues || {});
  }, [initialValues, form]);

  return (
    <Modal 
      visible={visible} 
      title={initialValues ? "Chỉnh sửa phòng" : "Thêm phòng"}
      onCancel={onClose}
      onOk={() => {
        form.validateFields().then(values => {
          onSubmit(values);
          form.resetFields();  // ✅ Reset form sau khi submit
        }).catch(info => console.log("Validation Failed:", info));
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Mã phòng" name="maPhong" rules={[{ required: true, message: "Không được để trống!" }, { max: 10, message: "Tối đa 10 ký tự!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Tên phòng" name="tenPhong" rules={[{ required: true, message: "Không được để trống!" }, { max: 50, message: "Tối đa 50 ký tự!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Số chỗ ngồi" name="soChoNgoi" rules={[{ required: true, message: "Không được để trống!" }]}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Loại phòng" name="loaiPhong" rules={[{ required: true, message: "Chọn loại phòng!" }]}>
          <Select>
            {Object.entries(loaiPhongText).map(([key, value]) => (
              <Option key={key} value={key}>{value}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Người phụ trách" name="nguoiPhuTrach" rules={[{ required: true, message: "Chọn người phụ trách!" }]}>
          <Select>
            {danhSachNguoiPhuTrach.map((nguoi) => (
              <Option key={nguoi.id} value={nguoi.id}>{nguoi.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalPhongHoc;
