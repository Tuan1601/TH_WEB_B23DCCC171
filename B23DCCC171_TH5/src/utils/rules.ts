import { Rule } from 'antd/lib/form';

const rules = {
  required: [{ required: true, message: 'Trường này không được để trống' }],
  
  phone: [
    {
      pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
      message: 'Số điện thoại không đúng định dạng'
    }
  ],
  
  email: [
    {
      type: 'email',
      message: 'Email không đúng định dạng'
    }
  ],
  
  // Thêm các rules khác nếu cần
  number: [{ type: 'number', message: 'Vui lòng nhập số' }],
  
  minLength: (min: number) => [
    { min, message: `Độ dài tối thiểu là ${min} ký tự` }
  ],
  
  maxLength: (max: number) => [
    { max, message: `Độ dài tối đa là ${max} ký tự` }
  ]
};

export default rules; 