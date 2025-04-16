import { useAppointmentData } from '@/hooks/useAppointmentData';
import { Card } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import AppointmentCountCard from './components/ApppointmentCountCard';
import FilterControls from './components/FilterControls';
import RevenueTable from './components/RevenueTable';
import './BaoCaoPage.css';  
const BaoCaoPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'ngay' | 'thang'>('ngay');
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(moment());

  const {
    filteredAppointments,
    revenueByService,
    revenueByEmployee
  } = useAppointmentData(filterType, selectedDate);

  const handleFilterChange = (e: any) => {
    setFilterType(e.target.value);
  };

  const handleDateChange = (date: moment.Moment | null) => {
    setSelectedDate(date);
  };

  return (
    <div className="baoCaoPage">
      <Card className="card" title="Báo cáo thống kê" extra={
        <FilterControls
          filterType={filterType}
          selectedDate={selectedDate}
          onFilterChange={handleFilterChange}
          onDateChange={handleDateChange}
        />
      }>
        <div className="appointmentCount">
          <AppointmentCountCard count={filteredAppointments.length} />
        </div>

        <div className="revenueTables">
          <RevenueTable title="Dịch vụ" data={revenueByService} />
          <RevenueTable title="Nhân viên" data={revenueByEmployee} />
        </div>
      </Card>
    </div>
  );
};

export default BaoCaoPage;
