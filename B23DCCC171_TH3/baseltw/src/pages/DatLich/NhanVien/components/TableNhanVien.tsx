import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Rate, Space, Table, Tag, Tooltip } from "antd"
import type React from "react"
import { useModel } from "umi"

interface TableNhanVienProps {
  onEdit: (record: any) => void
  onViewSchedule: (record: any) => void
}

interface INhanVienRecord {
  _id: string
  maNhanVien: string
  hoTen: string
  soDienThoai: string
  email: string
  gioiTinh: string
  ngaySinh: string
  diaChi: string
  chuyenMon: string[]
  soKhachToiDa: number
  lichLamViec: Array<{ thu: number; gioLam: string; gioNghi: string }>
  trangThai: boolean
  createdAt: string
  updatedAt: string
  feedbacks?: string[]
  averageRate?: number
}

const TableNhanVien: React.FC<TableNhanVienProps> = ({ onEdit, onViewSchedule }) => {
  const { data, loading, deleteModel } = useModel("datlich.nhanvien")
  const { data: dichVuData } = useModel("datlich.dichvu")

  const handleDelete = async (id: string) => {
    await deleteModel(id)
  }

  const getTenDichVu = (idDichVu: string) => {
    const dichVu = dichVuData?.find((dv: any) => dv._id === idDichVu)
    return dichVu?.tenDichVu || "N/A"
  }

  const columns = [
    {
      title: "Mã NV",
      dataIndex: "maNhanVien",
      key: "maNhanVien",
      width: 100,
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      key: "hoTen",
      sorter: (a: INhanVienRecord, b: INhanVienRecord) => a.hoTen.localeCompare(b.hoTen),
    },
    {
      title: "Số điện thoại",
      dataIndex: "soDienThoai",
      key: "soDienThoai",
    },
    {
      title: "Chuyên môn",
      dataIndex: "chuyenMon",
      key: "chuyenMon",
      render: (chuyenMon: string[]) => (
        <>
          {chuyenMon.map((id) => (
            <Tag key={id} color="blue">
              {getTenDichVu(id)}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "SL khách tối đa/ngày",
      dataIndex: "soKhachToiDa",
      key: "soKhachToiDa",
      width: 150,
      render: (soKhach: number) => soKhach,
      sorter: (a: INhanVienRecord, b: INhanVienRecord) => a.soKhachToiDa - b.soKhachToiDa,
    },
    // Giang
    {
      title: "Đánh giá",
      dataIndex: "averageRate",
      key: "averageRate",
      width: 180,
      render: (averageRate: number, record: INhanVienRecord) => (
        <div>
          <Rate disabled allowHalf defaultValue={averageRate || 0} style={{ fontSize: 16 }} />
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            {averageRate ? (
              <>
                <span style={{ fontWeight: "bold" }}>{averageRate.toFixed(1)}</span>
                <span> ({record.feedbacks?.length || 0} đánh giá)</span>
              </>
            ) : (
              "Chưa có đánh giá nào"
            )}
          </div>
        </div>
      ),
      sorter: (a: INhanVienRecord, b: INhanVienRecord) => (a.averageRate || 0) - (b.averageRate || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (trangThai: boolean) => (
        <Tag color={trangThai ? "green" : "red"}>{trangThai ? "Hoạt động" : "Nghỉ việc"}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: INhanVienRecord) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(record)} size="small" />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa nhân viên này?"
              onConfirm={() => handleDelete(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return <Table columns={columns} dataSource={data} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
}

export default TableNhanVien

