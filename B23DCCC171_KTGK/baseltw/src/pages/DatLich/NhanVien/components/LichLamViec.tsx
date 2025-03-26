import React, { useState, useEffect } from 'react';
import { Table, TimePicker, Button, Checkbox, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { thuTrongTuan } from '@/services/DatLich/NhanVien/constants';

interface LichLamViecProps {
  lichLamViec: any[];
  onChange: (lichLamViec: any[]) => void;
}

const LichLamViec: React.FC<LichLamViecProps> = ({ lichLamViec = [], onChange }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    if (lichLamViec && lichLamViec.length > 0) {
      setDataSource(
        lichLamViec.map((lich) => ({
          ...lich,
          key: lich.thu,
          gioLamMoment: moment(lich.gioLam, 'HH:mm'),
          gioNghiMoment: moment(lich.gioNghi, 'HH:mm')
        }))
      );
    } else {
      setDataSource([]);
    }
  }, [lichLamViec]);

  const handleAdd = () => {
    const newData = {
      key: Date.now(),
      thu: null,
      gioLam: '08:00',
      gioNghi: '17:00',
      gioLamMoment: moment('08:00', 'HH:mm'),
      gioNghiMoment: moment('17:00', 'HH:mm')
    };
    setDataSource([...dataSource, newData]);
    updateLichLamViec([...dataSource, newData]);
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    updateLichLamViec(newData);
  };

  const handleThuChange = (value: number, key: React.Key) => {
    const newData = dataSource.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          thu: value
        };
      }
      return item;
    });
    setDataSource(newData);
    updateLichLamViec(newData);
  };

  const handleGioLamChange = (time: moment.Moment | null, key: React.Key) => {
    if (!time) return;
    const newData = dataSource.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          gioLamMoment: time,
          gioLam: time.format('HH:mm')
        };
      }
      return item;
    });
    setDataSource(newData);
    updateLichLamViec(newData);
  };

  const handleGioNghiChange = (time: moment.Moment | null, key: React.Key) => {
    if (!time) return;
    const newData = dataSource.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          gioNghiMoment: time,
          gioNghi: time.format('HH:mm')
        };
      }
      return item;
    });
    setDataSource(newData);
    updateLichLamViec(newData);
  };

  const updateLichLamViec = (data: any[]) => {
    const lichMoi = data.map(({ key, gioLamMoment, gioNghiMoment, ...rest }) => rest);
    onChange(lichMoi.filter(lich => lich.thu !== null));
  };

  const columns = [
    {
      title: 'Thứ',
      dataIndex: 'thu',
      key: 'thu',
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          {thuTrongTuan.map((thu) => (
            <Checkbox
              key={thu.value}
              checked={record.thu === thu.value}
              onChange={(e) => {
                if (e.target.checked) {
                  handleThuChange(thu.value, record.key);
                } else if (record.thu === thu.value) {
                  handleThuChange(null, record.key);
                }
              }}
            >
              {thu.label}
            </Checkbox>
          ))}
        </Space>
      )
    },
    {
      title: 'Giờ làm',
      dataIndex: 'gioLamMoment',
      key: 'gioLamMoment',
      width: 150,
      render: (gioLamMoment: moment.Moment, record: any) => (
        <TimePicker
          value={gioLamMoment}
          format="HH:mm"
          minuteStep={30}
          onChange={(time) => handleGioLamChange(time, record.key)}
        />
      )
    },
    {
      title: 'Giờ nghỉ',
      dataIndex: 'gioNghiMoment',
      key: 'gioNghiMoment',
      width: 150,
      render: (gioNghiMoment: moment.Moment, record: any) => (
        <TimePicker
          value={gioNghiMoment}
          format="HH:mm"
          minuteStep={30}
          onChange={(time) => handleGioNghiChange(time, record.key)}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
          size="small"
        />
      )
    }
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Thêm lịch làm việc
      </Button>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
      />
    </div>
  );
};

export default LichLamViec;