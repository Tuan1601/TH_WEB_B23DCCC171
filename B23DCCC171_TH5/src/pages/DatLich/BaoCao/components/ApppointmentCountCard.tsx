import React from 'react';

interface AppointmentCountCardProps {
  count: number;
}

const AppointmentCountCard: React.FC<AppointmentCountCardProps> = ({ count }) => {
  return (
    <>
      <h3>Số lượng lịch hẹn</h3>
      <p>{count}</p>
    </>
  );
};

export default AppointmentCountCard;