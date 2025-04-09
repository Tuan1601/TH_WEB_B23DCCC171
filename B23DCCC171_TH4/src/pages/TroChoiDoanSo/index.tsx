import React, { useState } from "react";
import { Button, Input } from "antd";

const TroChoiDoanSo: React.FC = () => {
    const [soNgauNhien, setSoNgauNhien] = useState<number>(() => Math.floor(Math.random() * 100) + 1);
    const [duDoan, setDuDoan] = useState<string>("");
    const [thongBao, setThongBao] = useState<string>("");
    const [luotConLai, setLuotConLai] = useState<number>(10);
    const [ketThuc, setKetThuc] = useState<boolean>(false);

    const xuLyDoan = () => {
        if (ketThuc) return;
        const soNguoiChoiDoan = parseInt(duDoan, 10);
        if (isNaN(soNguoiChoiDoan) || soNguoiChoiDoan < 1 || soNguoiChoiDoan > 100) {
            setThongBao("Vui lòng nhập một số từ 1 đến 100.");
            return;
        }

        if (soNguoiChoiDoan === soNgauNhien) {
            setThongBao("Chúc mừng! Bạn đã đoán đúng!");
            setKetThuc(true);
        } else {
            setThongBao(soNguoiChoiDoan < soNgauNhien ? "Bạn đoán quá thấp!" : "Bạn đoán quá cao!");
            setLuotConLai((prev) => {
                if (prev - 1 === 0) {
                    setThongBao(`Bạn đã hết lượt! Số đúng là ${soNgauNhien}.`);
                    setKetThuc(true);
                }
                return prev - 1;
            });
        }
    };

    const choiLai = () => {
        setSoNgauNhien(Math.floor(Math.random() * 100) + 1);
        setDuDoan("");
        setThongBao("");
        setLuotConLai(10);
        setKetThuc(false);
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-xl text-center text-white">
            <h1 className="text-2xl font-extrabold mb-2">🔢 Trò Chơi Đoán Số</h1>
            <p className="text-lg">Hãy đoán một số từ <b>1 đến 100</b></p>
            <p className="text-md font-semibold">Bạn còn <span className="text-yellow-300">{luotConLai}</span> lượt đoán</p>
            <Input
                type="number"
                value={duDoan}
                onChange={(e) => setDuDoan(e.target.value)}
                disabled={ketThuc}
                className="mt-4 p-2 border-2 border-white rounded w-full text-center text-black"
            />
            <Button 
                onClick={xuLyDoan} 
                disabled={ketThuc} 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-all duration-300"
            >
                🎯 Đoán
            </Button>
            <p className="mt-4 text-lg font-medium">{thongBao}</p>
            {ketThuc && (
                <Button 
                    onClick={choiLai} 
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-all duration-300"
                >
                    🔄 Chơi lại
                </Button>
            )}
        </div>
    );
};

export default TroChoiDoanSo;
