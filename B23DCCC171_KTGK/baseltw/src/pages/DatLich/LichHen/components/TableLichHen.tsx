import { ETrangThaiLichHen, trangThaiLichHenColor, trangThaiLichHenText } from "@/services/DatLich/LichHen/constants"
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, StarOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Rate, Space, Table, Tag, Tooltip, message } from "antd"
import moment from "moment"
import type React from "react"
import { useState } from "react"
import { useModel } from "umi"
import RatingForm from "./RatingForm"
import "./TableLichHen.css"

interface ILichHenRecord {
  _id: string
  hoTenKhach: string
  soDienThoai: string
  email?: string
  idDichVu: string
  dichVu?: { _id: string; tenDichVu: string; giaTien: number }
  idNhanVien: string
  nhanVien?: { _id: string; hoTen: string }
  ngayHen: string
  gioHen: string
  trangThai: ETrangThaiLichHen
  ghiChu?: string
  createdAt: string
  updatedAt: string
  feedback?: string
  rateScore?: number
}

interface TableLichHenProps {
  onEdit: (record: any) => void
}

const TableLichHen: React.FC<TableLichHenProps> = ({ onEdit }) => {
  const { data, loading, deleteModel, getModels, capNhatTrangThaiLichHen, trangThaiFilter, putModel } =
    useModel("datlich.lichhen")
  const { data: nhanVienData, putModel: updateNhanVien } = useModel("datlich.nhanvien")
  const { data: dichVuData } = useModel("datlich.dichvu")

  const [isRatingFormVisible, setIsRatingFormVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<ILichHenRecord | null>(null)

  const getDichVuInfo = (idDichVu: string) => {
    const dichVu = dichVuData?.find((item: any) => item._id === idDichVu)
    return dichVu?.tenDichVu || "N/A"
  }

  const getNhanVienInfo = (idNhanVien: string) => {
    const nhanVien = nhanVienData?.find((item: any) => item._id === idNhanVien)
    return nhanVien?.hoTen || "N/A"
  }

  const handleXacNhan = async (record: ILichHenRecord) => {
    await capNhatTrangThaiLichHen(record._id, ETrangThaiLichHen.XAC_NHAN)
  }

  const handleHuy = async (record: ILichHenRecord) => {
    await capNhatTrangThaiLichHen(record._id, ETrangThaiLichHen.HUY)
  }

  const handleHoanThanh = async (record: ILichHenRecord) => {
    await capNhatTrangThaiLichHen(record._id, ETrangThaiLichHen.HOAN_THANH)
  }

  const handleDelete = async (id: string) => {
    await deleteModel(id)
  }
  
  const showRatingForm = (record: ILichHenRecord) => {
    setCurrentRecord(record)
    setIsRatingFormVisible(true)
  }

  const handleSaveRating = async (feedback: string, rateScore: number) => {
    if (!currentRecord) return

    try {
      await putModel(currentRecord._id, {
        ...currentRecord,
        feedback,
        rateScore,
      })

      const nhanVien = nhanVienData?.find((item: any) => item._id === currentRecord.idNhanVien)
      if (nhanVien) {
        const updatedFeedbacks = [...(nhanVien.feedbacks || []), feedback]

        const currentRatings = nhanVien.feedbacks?.length || 0
        const currentTotalScore = (nhanVien.averageRate || 0) * currentRatings
        const newAverageRate = (currentTotalScore + rateScore) / (currentRatings + 1)

        await updateNhanVien(nhanVien._id, {
          ...nhanVien,
          feedbacks: updatedFeedbacks,
          averageRate: newAverageRate,
        })
      }

      message.success("Đánh giá đã được lưu thành công!")
      getModels()
    } catch (error) {
      throw error
    }
  }

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "hoTenKhach",
      key: "hoTenKhach",
      render: (text: string, record: ILichHenRecord) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>{record.soDienThoai}</div>
        </div>
      ),
    },
    {
      title: "Dịch vụ",
      dataIndex: "idDichVu",
      key: "idDichVu",
      render: (idDichVu: string) => getDichVuInfo(idDichVu),
    },
    {
      title: "Nhân viên",
      dataIndex: "idNhanVien",
      key: "idNhanVien",
      render: (idNhanVien: string) => getNhanVienInfo(idNhanVien),
    },
    {
      title: "Thời gian",
      key: "thoiGian",
      render: (_: any, record: ILichHenRecord) => (
        <div>
          <div>{moment(record.ngayHen).format("DD/MM/YYYY")}</div>
          <div>{record.gioHen}</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (trangThai: ETrangThaiLichHen, record: ILichHenRecord) => (
        <div>
          <Tag color={trangThaiLichHenColor[trangThai]}>{trangThaiLichHenText[trangThai]}</Tag>
          {trangThai === ETrangThaiLichHen.HOAN_THANH && record.rateScore ? (
            <div style={{ marginTop: 4 }}>
              <Rate disabled defaultValue={record.rateScore} style={{ fontSize: 12 }} />
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: ILichHenRecord) => (
        <Space size="small">
          {record.trangThai === ETrangThaiLichHen.CHO_DUYET && (
            <>
              <Tooltip title="Xác nhận">
                <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleXacNhan(record)} />
              </Tooltip>
              <Tooltip title="Hủy">
                <Button danger size="small" icon={<CloseOutlined />} onClick={() => handleHuy(record)} />
              </Tooltip>
            </>
          )}
          {record.trangThai === ETrangThaiLichHen.XAC_NHAN && (
            <Tooltip title="Hoàn thành">
              <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleHoanThanh(record)} />
            </Tooltip>
          )}
          {record.trangThai === ETrangThaiLichHen.HOAN_THANH && (
            <Tooltip title="Đánh giá">
              <Button
                type="default"
                size="small"
                icon={<StarOutlined />}
                onClick={() => showRatingForm(record)}
                style={{ backgroundColor: "#faad14", borderColor: "#faad14", color: "white" }}
              />
            </Tooltip>
          )}
          <Tooltip title="Sửa">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa lịch hẹn này?"
              onConfirm={() => handleDelete(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const filteredData = trangThaiFilter ? data.filter((item: any) => item.trangThai === trangThaiFilter) : data

  return (
    <>
      <Table columns={columns} dataSource={filteredData} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
      {currentRecord && (
        <RatingForm
          visible={isRatingFormVisible}
          onClose={() => setIsRatingFormVisible(false)}
          onSave={handleSaveRating}
          initialFeedback={currentRecord.feedback || ""}
          initialRateScore={currentRecord.rateScore || 0}
          staffName={getNhanVienInfo(currentRecord.idNhanVien)}
          serviceName={getDichVuInfo(currentRecord.idDichVu)}
        />
      )}
    </>
  )
}

export default TableLichHen;

