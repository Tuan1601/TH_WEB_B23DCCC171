import { EGioiTinh } from '@/services/DatLich/NhanVien/constants';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Switch, Tabs } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import LichLamViec from './LichLamViec';

const { TabPane } = Tabs;

interface FormNhanVienProps {
  visible: boolean;
  onCancel: () => void;
}

const FormNhanVien: React.FC<FormNhanVienProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const { record, edit, formSubmiting, postModel, putModel } = useModel('datlich.nhanvien');
  const { data: dichVuData } = useModel('datlich.dichvu');
  const [lichLamViec, setLichLamViec] = useState<any[]>([]);

  useEffect(() => {
    if (!visible) resetFieldsForm(form);
    else if (record?._id) {
      form.setFieldsValue({
        ...record,
        ngaySinh: record.ngaySinh ? moment(record.ngaySinh) : undefined
      });
      setLichLamViec(record.lichLamViec || []);
    } else {
      setLichLamViec([]);
    }
  }, [record?._id, visible]);

  const onFinish = async (values: any) => {
    const nhanVienData = {
      ...values,
      ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
      lichLamViec: lichLamViec
    };

    if (edit) {
      putModel(record?._id ?? '', nhanVienData)
        .then(() => {
          onCancel();
        })
        .catch((err) => console.log(err));
    } else {
      postModel(nhanVienData)
        .then(() => {
          onCancel();
          form.resetFields();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleUpdateLichLamViec = (lichMoi: any[]) => {
    setLichLamViec(lichMoi);
  };

  return (
    <Modal
      title={edit ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={700}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Thông tin cơ bản" key="1">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              trangThai: true,
              soKhachToiDa: 10,
              gioiTinh: EGioiTinh.NAM
            }}
          >
            <Form.Item
              name="maNhanVien"
              label="Mã nhân viên"
              rules={[...rules.required]}
            >
              <Input placeholder="Nhập mã nhân viên" />
            </Form.Item>

            <Form.Item
              name="hoTen"
              label="Họ tên"
              rules={[...rules.required]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>

            <Form.Item
              name="soDienThoai"
              label="Số điện thoại"
              rules={[...rules.required, {
                pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                message: 'Số điện thoại không đúng định dạng'
              }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Email không hợp lệ' }, { required: true, message: 'Vui lòng nhập email' }]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="gioiTinh"
              label="Giới tính"
            >
              <Select>
                <Select.Option value={EGioiTinh.NAM}>Nam</Select.Option>
                <Select.Option value={EGioiTinh.NU}>Nữ</Select.Option>
                <Select.Option value={EGioiTinh.KHAC}>Khác</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="ngaySinh"
              label="Ngày sinh"
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="diaChi"
              label="Địa chỉ"
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Form.Item
              name="chuyenMon"
              label="Chuyên môn"
              rules={[...rules.required]}
            >
              <Select mode="multiple" placeholder="Chọn chuyên môn">
                {dichVuData?.map((dv: any) => (
                  <Select.Option key={dv._id} value={dv._id}>
                    {dv.tenDichVu}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="soKhachToiDa"
              label="Số khách tối đa/ngày"
              rules={[...rules.required]}
            >
              <InputNumber min={1} max={30} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="trangThai"
              label="Trạng thái"
              valuePropName="checked"
            >
              <Switch checkedChildren="Hoạt động" unCheckedChildren="Nghỉ việc" />
            </Form.Item>

            <div className="form-footer">
              <Button loading={formSubmiting} htmlType="submit" type="primary">
                {edit ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={onCancel}>Hủy</Button>
            </div>
          </Form>
        </TabPane>
        <TabPane tab="Lịch làm việc" key="2">
          <LichLamViec
            lichLamViec={lichLamViec}
            onChange={handleUpdateLichLamViec}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default FormNhanVien;