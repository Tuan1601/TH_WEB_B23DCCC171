import React from 'react';
import { Modal, Form, Input, Select, Switch, Button } from 'antd';
import { GhiChu, DuLieuFormGhiChu } from '@/types/note';

const { TextArea } = Input;
 
interface NoteFormProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: DuLieuFormGhiChu) => void;
  initialValues?: Partial<GhiChu>;
  tatCaThe: string[];
}

const NoteForm: React.FC<NoteFormProps> = ({ visible, onCancel, onFinish, initialValues, tatCaThe }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          the: initialValues.the || [],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ quanTrong: false, the: [] });
      }
    }
  }, [visible, initialValues, form]);

  const handleFinish = (values: any) => {
    
    const giaTriDaXuLy: DuLieuFormGhiChu = {
      tieuDe: values.tieuDe,
      noiDung: values.noiDung,
      the: Array.isArray(values.the) ? values.the : (values.the ? [values.the] : []),
      quanTrong: values.quanTrong || false,
    };
    
    onFinish(giaTriDaXuLy);
  };

  return (
    <Modal
      title={initialValues?.id ? 'Chỉnh sửa Ghi chú' : 'Thêm Ghi chú mới'}
      visible={visible}
      onCancel={onCancel}
      destroyOnClose  
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {initialValues?.id ? 'Lưu thay đổi' : 'Thêm Ghi chú'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{quanTrong: false, the: []}}>
        <Form.Item
          name="tieuDe"
          label="Tiêu đề"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="noiDung"
          label="Nội dung"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="the" label="Thẻ">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Thêm thẻ hoặc chọn từ danh sách"
            tokenSeparators={[',']}
            options={tatCaThe.map(tagValue => ({ label: tagValue, value: tagValue }))}
          />
        </Form.Item>
        <Form.Item name="quanTrong" label="Quan trọng" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NoteForm;