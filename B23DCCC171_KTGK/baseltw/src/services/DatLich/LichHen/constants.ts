export enum ETrangThaiLichHen {
  CHO_DUYET = 'CHO_DUYET',
  XAC_NHAN = 'XAC_NHAN',
  HOAN_THANH = 'HOAN_THANH',
  HUY = 'HUY'
}

export const trangThaiLichHenText = {
  [ETrangThaiLichHen.CHO_DUYET]: 'Chờ duyệt',
  [ETrangThaiLichHen.XAC_NHAN]: 'Đã xác nhận',
  [ETrangThaiLichHen.HOAN_THANH]: 'Hoàn thành',
  [ETrangThaiLichHen.HUY]: 'Hủy'
};

export const trangThaiLichHenColor = {
  [ETrangThaiLichHen.CHO_DUYET]: 'gold',
  [ETrangThaiLichHen.XAC_NHAN]: 'blue',
  [ETrangThaiLichHen.HOAN_THANH]: 'green',
  [ETrangThaiLichHen.HUY]: 'red'
}; 