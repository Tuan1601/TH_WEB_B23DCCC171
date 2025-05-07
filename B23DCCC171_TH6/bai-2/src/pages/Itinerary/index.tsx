// src/pages/Itinerary/index.tsx (Xây dựng Lịch trình)
import React, { useState } from 'react';
import { connect, Dispatch } from 'umi'; // Giữ nguyên import từ umi
import { List, Button, Card, Row, Col, Typography, Input, Divider, Popconfirm, message } from 'antd'; // Bỏ InputNumber vì không dùng
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'; // Giữ nguyên import icon
import type { ItineraryModelState } from '@/models/itinerary';    // Giữ nguyên import type
import type { DestinationModelState } from '@/models/destination'; // Giữ nguyên import type
import type { ItineraryItem } from '@/types';                      // Giữ nguyên import type
import styles from './index.less'; // Giữ nguyên import CSS Module (nếu dùng)

const { Title, Text } = Typography; // Giữ nguyên
const { TextArea } = Input;         // Giữ nguyên

// Interface giữ nguyên tên tiếng Anh
interface ItineraryPageProps {
  dispatch: Dispatch;
  itinerary: ItineraryModelState;
  destination: DestinationModelState; // Comment có thể dịch: Để lấy chi tiết điểm đến
}

// Tên component giữ nguyên
const ItineraryPage: React.FC<ItineraryPageProps> = ({ dispatch, itinerary, destination }) => {
  // Tên biến giữ nguyên
  const { items } = itinerary;
  const { list: allDestinations } = destination; // Comment có thể dịch: Lấy tất cả điểm đến để tra cứu

  const [editingItem, setEditingItem] = useState<{ day: number; destinationId: string; notes?: string } | null>(null);

  // Comment có thể dịch: Hàm trợ giúp để lấy chi tiết điểm đến bằng ID
  const getDestinationDetails = (id: string) => {
    return allDestinations.find(d => d.id === id);
  };

  // Comment có thể dịch: Nhóm các mục theo ngày
  const itemsByDay: { [key: number]: ItineraryItem[] } = items.reduce((acc, item) => {
    (acc[item.day] = acc[item.day] || []).push(item);
    return acc;
  }, {} as { [key: number]: ItineraryItem[] });

  // Tên hàm giữ nguyên
  const handleRemoveItem = (item: ItineraryItem) => {
    dispatch({
      type: 'itinerary/remove', // Type của dispatch giữ nguyên
      // Comment có thể dịch: Giả sử sự kết hợp này đủ duy nhất cho bây giờ
      payload: { day: item.day, destinationId: item.destinationId },
    });
    // Tin nhắn thông báo dịch
    message.success('Đã xóa mục khỏi lịch trình');
  };

   // Tên hàm giữ nguyên
   const handleStartEdit = (item: ItineraryItem) => {
       setEditingItem({ day: item.day, destinationId: item.destinationId, notes: item.notes || '' });
   }

   // Tên hàm giữ nguyên
   const handleCancelEdit = () => {
       setEditingItem(null);
   }

   // Tên hàm giữ nguyên
   const handleSaveEdit = () => {
       if (editingItem) {
           dispatch({
               type: 'itinerary/update', // Type của dispatch giữ nguyên
               payload: {
                   day: editingItem.day,
                   destinationId: editingItem.destinationId,
                   values: { notes: editingItem.notes }
               }
           });
           // Tin nhắn thông báo dịch
           message.success('Ghi chú đã được cập nhật');
           setEditingItem(null);
       }
   }

    // Tên hàm giữ nguyên
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (editingItem) {
            setEditingItem({ ...editingItem, notes: e.target.value });
        }
    }

  // Comment có thể dịch:
  // Lưu ý: Kéo và thả để sắp xếp lại sẽ yêu cầu thư viện bên ngoài như 'react-beautiful-dnd'
  // điều này vi phạm ràng buộc. Chỉ có thêm/xóa đơn giản được triển khai.
  // Bạn có thể thêm các nút để di chuyển các mục lên/xuống trong một ngày hoặc thay đổi ngày nếu cần.

  return (
    // Nếu không dùng CSS Module thì bỏ className
    <div className={styles.itineraryPage}>
       {/* Tiêu đề trang dịch */}
      <Title level={2}>Lịch trình du lịch của tôi</Title>
      {Object.keys(itemsByDay).sort((a, b) => parseInt(a) - parseInt(b)).map((day) => (
        // Tiêu đề Card dịch
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
                            {/* Nút lưu và đóng giữ nguyên icon */}
                            <Button icon={<SaveOutlined />} onClick={handleSaveEdit} type="primary" size="small" />
                            <Button icon={<CloseOutlined />} onClick={handleCancelEdit} size="small" />
                         </>
                      ) : (
                         // Nút sửa giữ nguyên icon
                         <Button icon={<EditOutlined />} onClick={() => handleStartEdit(item)} size="small" />
                      ),
                      // Popconfirm dịch
                      <Popconfirm
                        title="Bạn chắc chắn muốn xóa điểm đến này khỏi lịch trình?"
                        onConfirm={() => handleRemoveItem(item)}
                        okText="Có"
                        cancelText="Không"
                       >
                        {/* Nút xóa giữ nguyên icon */}
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    // Giữ nguyên cấu trúc avatar và title
                    avatar={<img src={destDetails?.imageUrl} alt={destDetails?.name} width={60} height={40} style={{ objectFit: 'cover' }} />}
                    title={<a href="#">{destDetails?.name || 'Điểm đến không xác định'}</a>} // Dịch text mặc định
                    description={
                       isEditing ? (
                           <TextArea
                               rows={2}
                               value={editingItem.notes}
                               onChange={handleNotesChange}
                               placeholder="Thêm ghi chú..." // Placeholder dịch
                           />
                       ) : (
                           // Text mặc định dịch
                           item.notes || <Text type="secondary">Chưa có ghi chú.</Text>
                       )
                    }
                  />
                   {/* Comment có thể dịch: Thêm placeholder cho chi phí/thời gian sau */}
                </List.Item>
              );
            }}
          />
        </Card>
      ))}
      {/* Text thông báo khi rỗng dịch */}
      {items.length === 0 && <Text>Lịch trình của bạn đang trống. Hãy đến trang chủ để thêm điểm đến!</Text>}
       <Divider />
        {/* Tiêu đề và text phần tóm tắt dịch */}
        <Title level={4}>Tóm tắt (Tạm thời)</Title>
        <Text>Tổng số ngày: {Object.keys(itemsByDay).length}</Text><br/>
        <Text>Tổng số điểm đến: {items.length}</Text><br/>
        {/* Comment có thể dịch: Tính toán ngân sách ước tính/thời gian di chuyển ở đây dựa trên các mục */}
    </div>
  );
};

// Phần connect giữ nguyên cấu trúc
export default connect(
  ({ itinerary, destination }: { itinerary: ItineraryModelState; destination: DestinationModelState }) => ({
    itinerary,
    destination,
  }),
)(ItineraryPage);