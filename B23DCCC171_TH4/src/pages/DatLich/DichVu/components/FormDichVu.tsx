import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Switch, Button, Modal } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ETrangThaiDichVu } from '@/services/DatLich/DichVu/constants';

interface FormDichVuProps {
  visible: boolean;
  onCancel: () => void;
}

const FormDichVu: React.FC<FormDichVuProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const { record, edit, formSubmiting, postModel, putModel } = useModel('datlich.dichvu');

  useEffect(() => {
    if (!visible) resetFieldsForm(form);
    else if (record?._id) {
      form.setFieldsValue(record);
    }
  }, [record?._id, visible]);

  const onFinish = async (values: any) => {
    if (edit) {
      putModel(record?._id ?? '', values)
        .then(() => {
          onCancel();
        })
        .catch((err) => console.log(err));
    } else {
      postModel(values)
        .then(() => {
          onCancel();
          form.resetFields();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Modal
      title={edit ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
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
          trangThai: true,
          giaTien: 0,
          thoiGianThucHien: 30
        }}
      >
        <Form.Item
          name="maDichVu"
          label="Mã dịch vụ"
          rules={[...rules.required]}
        >
          <Input placeholder="Nhập mã dịch vụ" />
        </Form.Item>

        <Form.Item
          name="tenDichVu"
          label="Tên dịch vụ"
          rules={[...rules.required]}
        >
          <Input placeholder="Nhập tên dịch vụ" />
        </Form.Item>

        <Form.Item
          name="moTa"
          label="Mô tả"
        >
          <Input.TextArea rows={3} placeholder="Nhập mô tả dịch vụ" />
        </Form.Item>

        <Form.Item
          name="giaTien"
          label="Giá tiền (VNĐ)"
          rules={[...rules.required]}
        >
          <InputNumber 
            min={0} 
            style={{ width: '100%' }} 
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="thoiGianThucHien"
          label="Thời gian thực hiện (phút)"
          rules={[...rules.required]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="trangThai"
          label="Trạng thái"
          valuePropName="checked"
        >
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm ngưng" />
        </Form.Item>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {edit ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FormDichVu;