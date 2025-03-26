import { useState, useEffect } from 'react';
import { message } from 'antd';
import { request } from 'umi';

export type TFilter<T> = {
  key: keyof T;
  value: any;
  operation: 'EQUAL' | 'NOT_EQUAL' | 'CONTAIN' | 'LESS_THAN' | 'GREATER_THAN' | 'LESS_OR_EQUAL' | 'GREATER_OR_EQUAL' | 'IS_EMPTY' | 'IS_NOT_EMPTY' | 'IN';
};

export default function useInitModel<T = any>(url: string) {
  // Đảm bảo khởi tạo data là mảng rỗng
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [record, setRecord] = useState<T>();
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
  const [sort, setSort] = useState<Record<string, 1 | -1>>();
  const [initFilter, setInitFilter] = useState<TFilter<T>[]>();

  const getModels = async (filter?: TFilter<T>[]) => {
    setLoading(true);
    try {
      // Gia lập request API, có thể thay thế bằng API thật sau
      // Nếu ở môi trường phát triển, trả về dữ liệu mẫu
      setLoading(false);
      return data;
    } catch (error) {
      console.log('error', error);
      setLoading(false);
      return data;
    }
  };

  const postModel = async (model: any) => {
    setFormSubmiting(true);
    try {
      // Gia lập thêm dữ liệu
      const newId = `${Date.now()}`;
      const newItem = { 
        ...model, 
        _id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as T;
      
      const newData = [...data, newItem];
      setData(newData);
      message.success('Thêm mới thành công!');
      setFormSubmiting(false);
      return newItem;
    } catch (error) {
      message.error('Thêm mới thất bại!');
      console.log('error', error);
      setFormSubmiting(false);
      throw error;
    }
  };

  const putModel = async (id: string, model: any) => {
    setFormSubmiting(true);
    try {
      // Gia lập cập nhật dữ liệu
      const updatedData = data.map(item => {
        if ((item as any)._id === id) {
          return { 
            ...item, 
            ...model, 
            updatedAt: new Date().toISOString() 
          };
        }
        return item;
      });
      
      setData(updatedData);
      message.success('Cập nhật thành công!');
      setFormSubmiting(false);
      return model;
    } catch (error) {
      message.error('Cập nhật thất bại!');
      console.log('error', error);
      setFormSubmiting(false);
      throw error;
    }
  };

  const deleteModel = async (id: string) => {
    try {
      // Gia lập xóa dữ liệu
      const newData = data.filter(item => (item as any)._id !== id);
      setData(newData);
      message.success('Xóa thành công!');
      return { success: true };
    } catch (error) {
      message.error('Xóa thất bại!');
      console.log('error', error);
      throw error;
    }
  };

  return {
    data,
    setData,
    loading,
    record,
    setRecord,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    formSubmiting,
    getModels,
    postModel,
    putModel,
    deleteModel,
    sort,
    setSort,
    initFilter,
    setInitFilter,
  };
} 