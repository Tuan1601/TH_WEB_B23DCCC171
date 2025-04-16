import React, { useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { Card, Row, Col, Rate, Spin, Form, Slider, Button, Checkbox, Radio, Tag } from 'antd';
import type { Destination, AppFilters } from '@/types';
import type { DestinationModelState } from '@/models/destination';
import styles from './index.less';

const { Meta } = Card;

interface HomePageProps {
  dispatch: Dispatch;
  destination: DestinationModelState;
}

const HomePage: React.FC<HomePageProps> = ({ dispatch, destination }) => {
  const { list: destinations, loading, filters } = destination;
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({ type: 'destination/fetch' });
  }, [dispatch]);

  const handleFilterChange = (changedValues: any, allValues: any) => {
    const payload: AppFilters = {
      type: allValues.type,
      priceRange: allValues.priceRange,
      minRating: allValues.minRating,
      sortBy: allValues.sortBy,
    };
    Object.keys(payload).forEach((key: keyof AppFilters) => (payload[key] === undefined || payload[key] === null) && delete payload[key]);

    dispatch({
      type: 'destination/applyFilters',
      payload: payload,
    });
  };

  const handleAddToItinerary = (dest: Destination) => {
    const dayToAdd = 1;
    console.log(`Đang thêm ${dest.name} vào lịch trình Ngày ${dayToAdd}`);
    dispatch({
      type: 'itinerary/add',
      payload: { day: dayToAdd, destination: dest }
    });
  }

  return (
    <div className={styles.homePage}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card title="Lọc & Sắp xếp" bordered={false}>
            <Form
              layout="vertical"
              form={form}
              onValuesChange={handleFilterChange}
              initialValues={filters}
            >
              <Form.Item name="type" label="Loại hình">
                <Checkbox.Group>
                  <Row>
                    <Col span={12}><Checkbox value="beach">Biển</Checkbox></Col>
                    <Col span={12}><Checkbox value="mountain">Núi</Checkbox></Col>
                    <Col span={12}><Checkbox value="city">Thành phố</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item name="priceRange" label="Khoảng giá (1.000.000đ-5.000.000đ)">
                <Slider range min={1} max={5} marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }} />
              </Form.Item>

              <Form.Item name="minRating" label="Đánh giá tối thiểu">
                <Rate allowHalf defaultValue={0} />
              </Form.Item>

              <Form.Item name="sortBy" label="Sắp xếp theo">
                <Radio.Group>
                  <Radio value="rating_desc">Đánh giá (Cao-Thấp)</Radio>
                  <Radio value="price_asc">Giá (Thấp-Cao)</Radio>
                  <Radio value="price_desc">Giá (Cao-Thấp)</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Card>
        </Col>

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
                        <Button type="link" onClick={() => handleAddToItinerary(dest)}>Thêm vào Lịch trình</Button>
                      ]}
                    >
                      <Meta
                        title={dest.name}
                        description={
                          <>
                            <div>{dest.location}</div>
                            <Rate disabled allowHalf value={dest.rating} style={{ fontSize: 14 }} /> ({dest.rating})
                            <div><Tag color="blue">{dest.type === 'beach' ? 'Biển' : dest.type === 'mountain' ? 'Núi' : 'Thành phố'}</Tag> Giá: {dest.priceRange + ".000.000đ"}</div>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24} style={{ textAlign: 'center', padding: '50px 0' }}>
                  Không tìm thấy điểm đến nào phù hợp với tiêu chí của bạn.
                </Col>
              )}
            </Row>
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ destination }: { destination: DestinationModelState }) => ({
  destination,
}))(HomePage);
