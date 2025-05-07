// src/pages/HomePage/index.tsx (Khám phá Điểm đến)
import React, { useEffect } from 'react'; // Bỏ useState vì không dùng tới
import { connect, Dispatch } from 'umi'; // Giữ nguyên import từ umi
import { Card, Row, Col, Rate, Spin, Form, Slider, Button, Checkbox, Radio, Tag } from 'antd'; // Bỏ Select, InputNumber, Space vì không dùng tới
import type { Destination, AppFilters } from '@/types'; // Giữ nguyên import type
import type { DestinationModelState } from '@/models/destination'; // Giữ nguyên import type
import styles from './index.less'; // Giữ nguyên import CSS Module (nếu dùng)

const { Meta } = Card; // Giữ nguyên

// Interface giữ nguyên tên tiếng Anh
interface HomePageProps {
  dispatch: Dispatch;
  destination: DestinationModelState;
}

// Tên component giữ nguyên
const HomePage: React.FC<HomePageProps> = ({ dispatch, destination }) => {
  // Tên biến giữ nguyên
  const { list: destinations, loading, filters } = destination;
  const [form] = Form.useForm(); // Giữ nguyên form hook

  useEffect(() => {
    // Comment có thể dịch: Lấy dữ liệu ban đầu khi mount
    dispatch({ type: 'destination/fetch' }); // Type của dispatch giữ nguyên
  }, [dispatch]); // Dependency array giữ nguyên

  // Tên hàm giữ nguyên
  const handleFilterChange = (changedValues: any, allValues: any) => {
    // Comment có thể dịch: Chuẩn bị payload bộ lọc cho model
    const payload: AppFilters = {
        type: allValues.type,
        priceRange: allValues.priceRange,
        minRating: allValues.minRating,
        sortBy: allValues.sortBy,
    };
    // Comment có thể dịch: Xóa các giá trị undefined/null nếu cần trước khi dispatch
    Object.keys(payload).forEach((key: keyof AppFilters) => (payload[key] === undefined || payload[key] === null) && delete payload[key]);


     dispatch({
        type: 'destination/applyFilters', // Type của dispatch giữ nguyên
        payload: payload,
      });
  };

   // Tên hàm giữ nguyên
   const handleAddToItinerary = (dest: Destination) => {
      // Comment có thể dịch:
      // Bạn sẽ cần cách để chọn ngày, có thể là modal hoặc mặc định là ngày 1
      const dayToAdd = 1; // Ví dụ: Thêm vào Ngày 1
      // Log có thể dịch
       console.log(`Đang thêm ${dest.name} vào lịch trình Ngày ${dayToAdd}`);
       dispatch({
           type: 'itinerary/add', // Type của dispatch giữ nguyên
           payload: { day: dayToAdd, destination: dest }
       })
       // Comment có thể dịch: Tùy chọn hiển thị thông báo thành công (có thể dùng message.success)
  }

  return (
    // Nếu không dùng CSS Module thì bỏ className
    <div className={styles.homePage}>
      <Row gutter={[16, 16]}>
        {/* Comment có thể dịch: Khu vực Bộ lọc */}
        <Col xs={24} md={6}>
           {/* Tiêu đề Card dịch */}
          <Card title="Lọc & Sắp xếp" bordered={false}>
            <Form
              layout="vertical"
              form={form}
              onValuesChange={handleFilterChange} // Comment có thể dịch: Tự động áp dụng bộ lọc khi thay đổi
              initialValues={filters} // Comment có thể dịch: Đặt giá trị form ban đầu từ state model
            >
                {/* Label dịch */}
               <Form.Item name="type" label="Loại hình">
                    <Checkbox.Group>
                        <Row>
                             {/* Text Checkbox dịch */}
                            <Col span={12}><Checkbox value="beach">Biển</Checkbox></Col>
                            <Col span={12}><Checkbox value="mountain">Núi</Checkbox></Col>
                            <Col span={12}><Checkbox value="city">Thành phố</Checkbox></Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                {/* Label dịch */}
              <Form.Item name="priceRange" label="Khoảng giá (1.000.000đ-5.000.000đ)">
                 <Slider range min={1} max={5} marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }} />
              </Form.Item>
                {/* Label dịch */}
               <Form.Item name="minRating" label="Đánh giá tối thiểu">
                 <Rate allowHalf defaultValue={0} />
              </Form.Item>
                {/* Label dịch */}
              <Form.Item name="sortBy" label="Sắp xếp theo">
                 <Radio.Group>
                     {/* Text Radio dịch */}
                    <Radio value="rating_desc">Đánh giá (Cao-Thấp)</Radio>
                    <Radio value="price_asc">Giá (Thấp-Cao)</Radio>
                    <Radio value="price_desc">Giá (Cao-Thấp)</Radio>
                 </Radio.Group>
              </Form.Item>

              {/* Comment có thể dịch: <Button type="primary" htmlType="submit" block>Áp dụng</Button> */}
            </Form>
          </Card>
        </Col>

        {/* Comment có thể dịch: Khu vực Danh sách Điểm đến */}
        <Col xs={24} md={18}>
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {destinations.length > 0 ? (
                destinations.map((dest) => (
                  <Col key={dest.id} xs={24} sm={12} lg={8} xl={6}>
                    <Card
                      hoverable
                      cover={<img alt={dest.name} src={dest.imageUrl} style={{ height: 200, objectFit: 'cover' }} />}
                      actions={[
                          // Text nút dịch
                          <Button type="link" onClick={() => handleAddToItinerary(dest)}>Thêm vào Lịch trình</Button>
                          // Comment có thể dịch: Thêm các hành động khác như 'Xem Chi tiết' sau
                      ]}
                    >
                      <Meta
                        title={dest.name}
                        description={
                            <>
                                <div>{dest.location}</div>
                                <Rate disabled allowHalf value={dest.rating} style={{ fontSize: 14 }}/> ({dest.rating})
                                {/* Text Tag và giá dịch, giữ $ hoặc đổi sang 'đ' */}
                                <div><Tag color="blue">{dest.type === 'beach' ? 'Biển' : dest.type === 'mountain' ? 'Núi' : 'Thành phố'}</Tag> Giá: {dest.priceRange + ".000.000đ"}</div>                            </>
                        }
                      />
                    </Card>
                  </Col>
                ))
              ) : (
                // Text thông báo dịch
                <Col span={24} style={{ textAlign: 'center', padding: '50px 0' }}>
                    Không tìm thấy điểm đến nào phù hợp với tiêu chí của bạn.
                </Col>
              )}
            </Row>
            {/* Comment có thể dịch: Thêm component Pagination ở đây nếu cần, kết nối với model/effect fetch */}
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

// Phần connect giữ nguyên cấu trúc
export default connect(({ destination }: { destination: DestinationModelState }) => ({
  destination,
}))(HomePage);