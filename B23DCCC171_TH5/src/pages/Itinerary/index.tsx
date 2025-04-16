// src/pages/Itinerary/index.tsx
import React, { useState } from 'react';
import { connect, Dispatch } from 'umi';
import { List, Button, Card, Typography, Input, Divider, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { ItineraryModelState } from '@/models/itinerary';
import type { DestinationModelState } from '@/models/destination';
import type { ItineraryItem } from '@/types';
import styles from './index.less';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ItineraryPageProps {
  dispatch: Dispatch;
  itinerary: ItineraryModelState;
  destination: DestinationModelState;
}

const ItineraryPage: React.FC<ItineraryPageProps> = ({ dispatch, itinerary, destination }) => {
  const { items } = itinerary;
  const { list: allDestinations } = destination;

  const [editingItem, setEditingItem] = useState<{ day: number; destinationId: string; notes?: string } | null>(null);

  const getDestinationDetails = (id: string) => {
    return allDestinations.find(d => d.id === id);
  };

  const itemsByDay: { [key: number]: ItineraryItem[] } = items.reduce((acc, item) => {
    (acc[item.day] = acc[item.day] || []).push(item);
    return acc;
  }, {} as { [key: number]: ItineraryItem[] });

  const handleRemoveItem = (item: ItineraryItem) => {
    dispatch({
      type: 'itinerary/remove',
      payload: { day: item.day, destinationId: item.destinationId },
    });
    message.success('Đã xóa mục khỏi lịch trình');
  };

  const handleStartEdit = (item: ItineraryItem) => {
    setEditingItem({ day: item.day, destinationId: item.destinationId, notes: item.notes || '' });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      dispatch({
        type: 'itinerary/update',
        payload: {
          day: editingItem.day,
          destinationId: editingItem.destinationId,
          values: { notes: editingItem.notes }
        }
      });
      message.success('Ghi chú đã được cập nhật');
      setEditingItem(null);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, notes: e.target.value });
    }
  };

  return (
    <div className={styles.itineraryPage}>
      <Title level={2}>Lịch trình du lịch của tôi</Title>
      {Object.keys(itemsByDay).sort((a, b) => parseInt(a) - parseInt(b)).map((day) => (
        <Card key={day} title={`Ngày ${day}`} style={{ marginBottom: 16 }}>
          <List
            itemLayout="horizontal"
            dataSource={itemsByDay[parseInt(day)]}
            renderItem={(item) => {
              const destDetails = getDestinationDetails(item.destinationId);
              const isEditing = editingItem?.day === item.day && editingItem?.destinationId === item.destinationId;
              return (
                <List.Item
                  actions={[
                    isEditing ? (
                      <>
                        <Button icon={<SaveOutlined />} onClick={handleSaveEdit} type="primary" size="small" />
                        <Button icon={<CloseOutlined />} onClick={handleCancelEdit} size="small" />
                      </>
                    ) : (
                      <Button icon={<EditOutlined />} onClick={() => handleStartEdit(item)} size="small" />
                    ),
                    <Popconfirm
                      title="Bạn chắc chắn muốn xóa điểm đến này khỏi lịch trình?"
                      onConfirm={() => handleRemoveItem(item)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<img src={destDetails?.imageUrl} alt={destDetails?.name} width={60} height={40} style={{ objectFit: 'cover' }} />}
                    title={<a href="#">{destDetails?.name || 'Điểm đến không xác định'}</a>}
                    description={
                      isEditing ? (
                        <TextArea
                          rows={2}
                          value={editingItem.notes}
                          onChange={handleNotesChange}
                          placeholder="Thêm ghi chú..."
                        />
                      ) : (
                        item.notes || <Text type="secondary">Chưa có ghi chú.</Text>
                      )
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      ))}
      {items.length === 0 && <Text>Lịch trình của bạn đang trống. Hãy đến trang chủ để thêm điểm đến!</Text>}
      <Divider />
      <Title level={4}>Tóm tắt (Tạm thời)</Title>
      <Text>Tổng số ngày: {Object.keys(itemsByDay).length}</Text><br />
      <Text>Tổng số điểm đến: {items.length}</Text><br />
    </div>
  );
};

export default connect(
  ({ itinerary, destination }: { itinerary: ItineraryModelState; destination: DestinationModelState }) => ({
    itinerary,
    destination,
  }),
)(ItineraryPage);
