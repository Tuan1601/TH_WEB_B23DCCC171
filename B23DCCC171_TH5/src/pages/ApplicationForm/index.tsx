import React from 'react';
import { connect, Dispatch, history } from 'umi';  
import { Form, Input, Select, Button, Card, message } from 'antd';
import { ASPIRATIONS } from '@/services/application';  
import { PageContainer } from '@ant-design/pro-layout';  

const { Option } = Select;
const { TextArea } = Input;

interface ApplicationFormProps {
    dispatch: Dispatch;
    submitting?: boolean;  
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ dispatch }) => {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        console.log('Form values:', values);
        const success: boolean = await dispatch({
            type: 'applications/add',
            payload: values,
        });
         if (success) {
            form.resetFields();
            
        }
        
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        message.error('Vui lòng kiểm tra lại thông tin đã nhập!');
    };

    return (
        <PageContainer title="Đăng ký ứng tuyển">
            <Card bordered={false}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    style={{ maxWidth: 600, margin: '0 auto' }}  
                >
                    <Form.Item
                        label="Họ tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input placeholder="Nhập họ và tên của bạn" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không đúng định dạng!' }
                        ]}
                    >
                        <Input placeholder="Nhập địa chỉ email" />
                    </Form.Item>

                    <Form.Item
                        label="Nguyện vọng"
                        name="aspiration"
                        rules={[{ required: true, message: 'Vui lòng chọn nguyện vọng!' }]}
                    >
                        <Select placeholder="Chọn nguyện vọng của bạn">
                            {ASPIRATIONS.map(asp => (
                                <Option key={asp.value} value={asp.value}>{asp.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Lý do đăng ký"
                        name="reason"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký!' }]}
                    >
                        <TextArea rows={4} placeholder="Tại sao bạn muốn tham gia?" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={false}>
                            Gửi đơn đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </PageContainer>
    );
};

 

export default connect()(ApplicationForm); 