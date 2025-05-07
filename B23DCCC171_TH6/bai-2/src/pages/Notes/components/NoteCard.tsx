import React from 'react';
import { Card, Tag, Typography, Dropdown, Menu, Space, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PushpinOutlined,
  PushpinFilled,
  StarOutlined,
  StarFilled,
  EllipsisOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { GhiChu } from '@/types/note';

const { Paragraph } = Typography;

interface NoteCardProps {
  ghiChuItem: GhiChu;
  onEdit: (ghiChu: GhiChu) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleImportant: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  ghiChuItem,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleImportant,
}) => {
  const menu = (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => onEdit(ghiChuItem)}>
        Sửa
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => onDelete(ghiChuItem.id)}>
        Xóa
      </Menu.Item>
    </Menu>
  );

  return (
    <Card
      title={ghiChuItem.tieuDe}
      style={{ marginBottom: 16, borderColor: ghiChuItem.quanTrong ? '#ff4d4f' : undefined }}
      extra={
        <Space>
          <Tooltip title={ghiChuItem.daGhim ? 'Bỏ ghim' : 'Ghim lên đầu'}>
            {ghiChuItem.daGhim ? (
              <PushpinFilled style={{color: '#1890ff', cursor: 'pointer'}} onClick={() => onTogglePin(ghiChuItem.id)} />
            ) : (
              <PushpinOutlined style={{cursor: 'pointer'}} onClick={() => onTogglePin(ghiChuItem.id)} />
            )}
          </Tooltip>
          <Tooltip title={ghiChuItem.quanTrong ? 'Bỏ đánh dấu quan trọng' : 'Đánh dấu quan trọng'}>
            {ghiChuItem.quanTrong ? (
              <StarFilled style={{ color: '#faad14', cursor: 'pointer' }} onClick={() => onToggleImportant(ghiChuItem.id)} />
            ) : (
              <StarOutlined style={{cursor: 'pointer'}} onClick={() => onToggleImportant(ghiChuItem.id)} />
            )}
          </Tooltip>
          <Dropdown overlay={menu} trigger={['click']}>
            <EllipsisOutlined style={{ cursor: 'pointer', fontSize: '20px' }} />
          </Dropdown>
        </Space>
      }
    >
      <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'xem thêm' }}>
        {ghiChuItem.noiDung}
      </Paragraph>
      <div style={{ marginTop: 8 }}>
        {ghiChuItem.the && Array.isArray(ghiChuItem.the) && ghiChuItem.the.length > 0 ? (
            ghiChuItem.the.map((tag) => (
              <Tag key={`${ghiChuItem.id}-${tag}`} color="blue" style={{marginBottom: 4}}>{tag}</Tag>
            ))
          ) : (
            <Typography.Text type="secondary" style={{fontSize: '12px'}}>Không có thẻ</Typography.Text>
        )}
      </div>
      <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: '12px' }}>
        Tạo lúc: {moment(ghiChuItem.ngayTao).format('YYYY-MM-DD HH:mm')}
      </Typography.Text>
    </Card>
  );
};

export default NoteCard;