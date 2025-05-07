export enum OrderStatus {
  PENDING = 'pending',      
  SHIPPING = 'shipping',     
  COMPLETED = 'completed',   
  CANCELLED = 'cancelled',   
}


export interface Product {
  id: string;      
  name: string;    
  price: number;   
}


export interface Order {
  id: string;      
  customer: string;      
  orderDate: string;       
  products: Product[];    
  totalAmount: number;     
  status: OrderStatus;   
}

export const OrderStatusMap: Record<OrderStatus, { label: string; color: string }> = {
  [OrderStatus.PENDING]: { label: 'Chờ xác nhận', color: 'orange' },
  [OrderStatus.SHIPPING]: { label: 'Đang giao', color: 'blue' },
  [OrderStatus.COMPLETED]: { label: 'Hoàn thành', color: 'green' },
  [OrderStatus.CANCELLED]: { label: 'Đã hủy', color: 'red' },
};