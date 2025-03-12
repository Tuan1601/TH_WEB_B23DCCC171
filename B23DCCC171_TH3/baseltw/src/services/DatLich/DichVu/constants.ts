export enum ETrangThaiDichVu {
    HOAT_DONG = 'HOAT_DONG',
    TAM_NGUNG = 'TAM_NGUNG',
    NGUNG_CUNG_CAP = 'NGUNG_CUNG_CAP'
  }
  
  export const trangThaiDichVuText = {
    [ETrangThaiDichVu.HOAT_DONG]: 'Hoạt động',
    [ETrangThaiDichVu.TAM_NGUNG]: 'Tạm ngưng',
    [ETrangThaiDichVu.NGUNG_CUNG_CAP]: 'Ngưng cung cấp'
  };
  
  export const trangThaiDichVuColor = {
    [ETrangThaiDichVu.HOAT_DONG]: 'green',
    [ETrangThaiDichVu.TAM_NGUNG]: 'orange',
    [ETrangThaiDichVu.NGUNG_CUNG_CAP]: 'red'
  };