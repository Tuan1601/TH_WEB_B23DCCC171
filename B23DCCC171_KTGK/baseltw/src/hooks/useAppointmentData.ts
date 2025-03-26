import moment from 'moment';
import { useMemo } from 'react';
import { useModel } from 'umi';

export const useAppointmentData = (filterType: 'ngay' | 'thang', selectedDate: moment.Moment | null) => {
    const { data: lichHenData } = useModel('datlich.lichhen');
    const { data: dichVuData } = useModel('datlich.dichvu');
    const { data: nhanVienData } = useModel('datlich.nhanvien');

    const filteredAppointments = useMemo(() => {
        if (!selectedDate) return [];
        return lichHenData.filter((item: any) => {
            const itemDate = moment(item.ngayHen);
            if (filterType === 'ngay') {
                return itemDate.isSame(selectedDate, 'day');
            } else {
                return itemDate.isSame(selectedDate, 'month');
            }
        });
    }, [lichHenData, selectedDate, filterType]);

    const revenueByService = useMemo(() => {
        const result: Record<string, number> = {};
        filteredAppointments.forEach((appointment: any) => {
            const service = dichVuData.find((dichVu: any) => dichVu._id === appointment.idDichVu);
            if (service) {
                result[service.tenDichVu] = (result[service.tenDichVu] || 0) + service.giaTien;
            }
        });
        return result;
    }, [filteredAppointments, dichVuData]);

    const revenueByEmployee = useMemo(() => {
        const result: Record<string, number> = {};
        filteredAppointments.forEach((appointment: any) => {
            const employee = nhanVienData.find((nhanVien: any) => nhanVien._id === appointment.idNhanVien);
            if (employee) {
                const service = dichVuData.find((dichVu: any) => dichVu._id === appointment.idDichVu);
                if (service) {
                    result[employee.hoTen] = (result[employee.hoTen] || 0) + service.giaTien;
                }
            }
        });
        return result;
    }, [filteredAppointments, nhanVienData, dichVuData]);

    return {
        filteredAppointments,
        revenueByService,
        revenueByEmployee,
        dichVuData,
        nhanVienData
    };
};  