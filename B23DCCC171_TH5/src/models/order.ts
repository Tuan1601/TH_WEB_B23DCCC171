import { useState, useCallback, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/order'; 
import * as orderService from '@/services/order'; 
import { message } from 'antd'; 

export default function useOrderModel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true); 


  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.fetchOrders();

      data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      setOrders(data);
    } catch (error) {
      message.error('Lỗi tải danh sách đơn hàng!');
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);


  useEffect(() => {
    loadOrders();
  }, [loadOrders]); 


 
  const addOrder = useCallback(async (orderData: Omit<Order, 'id' | 'orderDate'>) => {
    setLoading(true);
    try {
      const newOrder = await orderService.addOrder(orderData);
  
      setOrders(prevOrders =>
        [...prevOrders, newOrder].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      );
      message.success('Thêm đơn hàng thành công!');
      return true; 
    } catch (error) {
      message.error('Thêm đơn hàng thất bại!');
      console.error("Error adding order:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []); 

  const updateOrder = useCallback(async (updatedOrder: Order) => {
    setLoading(true);
    try {
      const result = await orderService.updateOrder(updatedOrder);
      if (result) {
        setOrders(prevOrders =>
          prevOrders.map(o => o.id === result.id ? result : o)
                 .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        );
        message.success('Cập nhật đơn hàng thành công!');
        return true;
      } else {
        message.error('Không tìm thấy đơn hàng để cập nhật!');
        return false;
      }
    } catch (error) {
      message.error('Cập nhật đơn hàng thất bại!');
      console.error("Error updating order:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);


  const cancelOrder = useCallback(async (id: string) => {
 
     const orderToCancel = orders.find(o => o.id === id);
     if (orderToCancel && orderToCancel.status !== 'pending') {
         message.warning('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận".');
         return false;
     }

    setLoading(true);
    try {
      const success = await orderService.cancelOrder(id);
      if (success) {
      
        setOrders(prevOrders =>
          prevOrders.map(o => o.id === id ? { ...o, status: 'cancelled' } : o)
                 .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        );
        message.success('Hủy đơn hàng thành công!');
        return true;
      } else {
      
        message.error('Hủy đơn hàng thất bại (có thể do trạng thái không hợp lệ hoặc không tìm thấy).');
        return false;
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi hủy đơn hàng!');
      console.error("Error cancelling order:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [orders]); 

  return {
    orders,
    loading: loading || initialLoading,
    loadOrders,
    addOrder,
    updateOrder,
    cancelOrder,
  };
}