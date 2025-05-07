import { Order } from '@/types/order'; 

const LOCAL_STORAGE_KEY = 'orders_data';

 
const getOrdersFromStorage = (): Order[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading orders from local storage:", error);
    return [];
  }
};

const saveOrdersToStorage = (orders: Order[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving orders to local storage:", error);
  }
};

 
export const fetchOrders = async (): Promise<Order[]> => {
   
  return Promise.resolve(getOrdersFromStorage());
};

export const addOrder = async (orderData: Omit<Order, 'id' | 'orderDate'>): Promise<Order> => {
    const orders = getOrdersFromStorage();
    const newOrder: Order = {
        ...orderData,
        id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,  
        orderDate: new Date().toISOString(),  
    };
    const updatedOrders = [...orders, newOrder];
    saveOrdersToStorage(updatedOrders);
    return Promise.resolve(newOrder);
};

export const updateOrder = async (updatedOrder: Order): Promise<Order | null> => {
    const orders = getOrdersFromStorage();
    const index = orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
        const updatedOrders = [...orders];
        updatedOrders[index] = updatedOrder;
        saveOrdersToStorage(updatedOrders);
        return Promise.resolve(updatedOrder);
    }
    return Promise.resolve(null);  
};

export const cancelOrder = async (id: string): Promise<boolean> => {
    const orders = getOrdersFromStorage();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
        
        if (orders[index].status === 'pending') {
            const updatedOrders = [...orders];
            updatedOrders[index] = { ...updatedOrders[index], status: 'cancelled' };
            saveOrdersToStorage(updatedOrders);
            return Promise.resolve(true);  
        } else {
             console.warn(`Order ${id} cannot be cancelled as its status is not 'pending'.`);
             return Promise.resolve(false);  
        }
    }
     console.warn(`Order ${id} not found for cancellation.`);
    return Promise.resolve(false);  
};
