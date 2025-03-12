import { useState, useEffect } from 'react';
import { Modal, Rate, Input, message } from 'antd';

interface RatingFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (feedback: string, rateScore: number) => Promise<void>;
  initialFeedback?: string;
  initialRateScore?: number;
  staffName: string;
  serviceName: string;
}

const RatingForm: React.FC<RatingFormProps> = ({
  visible,
  onClose,
  onSave,
  initialFeedback = '',
  initialRateScore = 0,
  staffName,
  serviceName,
}) => {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [rateScore, setRateScore] = useState(initialRateScore);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setFeedback(initialFeedback);
      setRateScore(initialRateScore);
    }
  }, [visible, initialFeedback, initialRateScore]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(feedback, rateScore);
      onClose();
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu đánh giá!');
      console.error('Error saving rating:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Đánh giá dịch vụ"
      visible={visible}
      onOk={handleSave}
      onCancel={onClose}
      okText="Lưu đánh giá"
      cancelText="Hủy"
      confirmLoading={saving}
    >
      <div style={{ marginBottom: 16 }}>
        <p>Nhân viên: {staffName}</p>
        <p>Dịch vụ: {serviceName}</p>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <p style={{ marginBottom: 8 }}>Đánh giá chất lượng dịch vụ:</p>
        <Rate 
          value={rateScore} 
          onChange={setRateScore} 
          style={{ fontSize: 36 }}
        />
      </div>
      
      <div>
        <p style={{ marginBottom: 8 }}>Nhận xét về nhân viên:</p>
        <Input.TextArea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Trải nghiệm sử dụng dịch vụ của tôi..."
          rows={4}
        />
      </div>
    </Modal>
  );
};

export default RatingForm;
