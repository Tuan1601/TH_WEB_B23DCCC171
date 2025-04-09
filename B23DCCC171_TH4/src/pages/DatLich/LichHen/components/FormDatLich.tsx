import React, { useEffect } from 'react';
import { Form, Input, DatePicker, TimePicker, Select, Button, Modal } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ETrangThaiLichHen, trangThaiLichHenText } from '@/services/DatLich/LichHen/constants';

interface FormDatLichProps {
  visible: boolean;
  onCancel: () => void;
  edit?: boolean;
}

const FormDatLich: React.FC<FormDatLichProps> = ({ visible, onCancel, edit = false }) => {
  const [form] = Form.useForm();
  const { record, formSubmiting, postModel, putModel, kiemTraLichTrung } = useModel('datlich.lichhen');
  const { data: nhanVienList } = useModel('datlich.nhanvien');
  const { data: dichVuList } = useModel('datlich.dichvu');
  
  useEffect(() => {
    if (!visible) resetFieldsForm(form);
    else if (record?._id) {
      form.setFieldsValue({
        ...record,
        ngayHen: moment(record.ngayHen),
        gioHen: moment(record.gioHen, 'HH:mm')
      });
    }
  }, [record?._id, visible]);

  const onFinish = async (values: any) => {
    const lichHenData = {
      ...values,
      ngayHen: values.ngayHen.format('YYYY-MM-DD'),
      gioHen: values.gioHen.format('HH:mm'),
      trangThai: edit ? values.trangThai : ETrangThaiLichHen.CHO_DUYET
    };

    const coTheDatLich = await kiemTraLichTrung(lichHenData, nhanVienList);
    if (!coTheDatLich) {
      return;
    }

    if (edit) {
      putModel(record?._id ?? '', lichHenData)
        .then(() => {
          onCancel();
        })
        .catch((err) => console.log(err));
    } else {
      postModel(lichHenData)
        .then(() => {
          onCancel();
          form.resetFields();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Modal
      title={edit ? 'Cập nhật lịch hẹn' : 'Đặt lịch hẹn mới'}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          trangThai: ETrangThaiLichHen.CHO_DUYET,
          ngayHen: moment(),
          gioHen: moment()
        }}
      >
        <Form.Item
          name="hoTenKhach"
          label="Họ tên khách hàng"
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
          rules={[{ type: 'email', message: 'Email không đúng định dạng' }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="idDichVu"
          label="Dịch vụ"
          rules={[...rules.required]}
        >
          <Select placeholder="Chọn dịch vụ">
            {dichVuList.map((dichVu) => (
              <Select.Option key={dichVu._id} value={dichVu._id}>
                {dichVu.tenDichVu}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="idNhanVien"
          label="Nhân viên phục vụ"
          rules={[...rules.required]}
        >
          <Select placeholder="Chọn nhân viên">
            {nhanVienList.map((nhanVien) => (
              <Select.Option key={nhanVien._id} value={nhanVien._id}>
                {nhanVien.hoTen}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="ngayHen"
          label="Ngày hẹn"
          rules={[...rules.required]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="gioHen"
          label="Giờ hẹn"
          rules={[...rules.required]}
        >
          <TimePicker format="HH:mm" minuteStep={15} style={{ width: '100%' }} />
        </Form.Item>

        {edit && (
          <Form.Item
            name="trangThai"
            label="Trạng thái"
            rules={[...rules.required]}
          >
            <Select placeholder="Chọn trạng thái">
              {Object.entries(trangThaiLichHenText).map(([key, text]) => (
                <Select.Option key={key} value={key}>
                  {text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="ghiChu"
          label="Ghi chú"
        >
          <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
        </Form.Item>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {edit ? 'Cập nhật' : 'Đặt lịch'}
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FormDatLich; 