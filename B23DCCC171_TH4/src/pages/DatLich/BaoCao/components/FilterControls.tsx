import { DatePicker, Radio } from 'antd';
import moment from 'moment';
import React from 'react';

interface FilterControlsProps {
  filterType: 'ngay' | 'thang';
  selectedDate: moment.Moment | null;
  onFilterChange: (e: any) => void;
  onDateChange: (date: moment.Moment | null) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filterType,
  selectedDate,
  onFilterChange,
  onDateChange,
}) => {
  return (
    <>
      <Radio.Group value={filterType} onChange={onFilterChange}>
        <Radio.Button value="ngay">Theo ngày</Radio.Button>
        <Radio.Button value="thang">Theo tháng</Radio.Button>
      </Radio.Group>
      <DatePicker
        picker={filterType === 'ngay' ? 'date' : 'month'}
        value={selectedDate}
        onChange={onDateChange}
      />
    </>
  );
};

export default FilterControls;