import React, { useState, useMemo, useEffect } from 'react';
import { connect, Dispatch, Loading } from 'umi';
import {
  Button,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Empty,
  Spin,
  Typography,
  Switch,
  Space,
  Table,
  Tag,
  Tooltip,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  AppstoreOutlined,
  BarsOutlined,
  EditOutlined,
  DeleteOutlined,
  PushpinOutlined,
  PushpinFilled,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import moment from 'moment';
import { GhiChu, DuLieuFormGhiChu } from '@/types/note';
import { TrangThaiModelGhiChu } from '@/models/note';
import NoteForm from './components/NoteForm';
import NoteCard from './components/NoteCard';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Title } = Typography;

interface TrangGhiChuProps {
  dispatch: Dispatch;
  trangThaiNotes: TrangThaiModelGhiChu;
  dangTaiGhiChu: boolean;
}

const NotesPage: React.FC<TrangGhiChuProps> = ({ dispatch, trangThaiNotes, dangTaiGhiChu }) => {
  const { danhSachGhiChu, tuKhoaTimKiem, locTheoThe, locTheoKhoangNgay, cheDoXem } = trangThaiNotes;

  const [hienThiModal, setHienThiModal] = useState(false);
  const [ghiChuDangSua, setGhiChuDangSua] = useState<GhiChu | undefined>(undefined);

  const xuLyThemGhiChu = () => {
    setGhiChuDangSua(undefined);
    setHienThiModal(true);
  };

  const xuLySuaGhiChu = (ghiChu: GhiChu) => {
    setGhiChuDangSua(ghiChu);
    setHienThiModal(true);
  };

  const xuLyXoaGhiChu = (id: string) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa ghi chú này không?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        dispatch({
          type: 'notes/deleteNote',
          payload: id,
        });
      },
    });
  };

  const xuLySubmitForm = (values: DuLieuFormGhiChu) => {
    if (ghiChuDangSua) {
      dispatch({
        type: 'notes/updateNote',
        payload: { ...ghiChuDangSua, ...values, the: values.the || [] },
      });
    } else {
      dispatch({
        type: 'notes/addNote',
        payload: {...values, the: values.the || []},
      });
    }
    setHienThiModal(false);
    setGhiChuDangSua(undefined);
  };

  const xuLyToggleGhim = (id: string) => {
    dispatch({ type: 'notes/togglePin', payload: id });
  };

  const xuLyToggleQuanTrong = (id: string) => {
    dispatch({ type: 'notes/toggleImportant', payload: id });
  };

  const tatCaTheHienCo = useMemo(() => {
    const tapHopThe = new Set<string>();
    danhSachGhiChu.forEach(note => {
      if (note.the && Array.isArray(note.the)) {
        note.the.forEach(tag => tapHopThe.add(tag));
      }
    });
    
    return Array.from(tapHopThe);
  }, [danhSachGhiChu]);

  const danhSachGhiChuDaLoc = useMemo(() => {
    return danhSachGhiChu
      .filter(note => {
        const khopTieuDe = note.tieuDe.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
        const khopNoiDung = note.noiDung.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
        const khopThe = locTheoThe.length === 0 || locTheoThe.every(tag => note.the && note.the.includes(tag));
        
        let khopNgay = true;
        if (locTheoKhoangNgay && locTheoKhoangNgay[0] && locTheoKhoangNgay[1]) {
          const ngayGhiChu = moment(note.ngayTao);
          const ngayBatDau = moment(locTheoKhoangNgay[0]);
          const ngayKetThuc = moment(locTheoKhoangNgay[1]);
          khopNgay = ngayGhiChu.isBetween(ngayBatDau, ngayKetThuc, 'day', '[]');
        }
        return (khopTieuDe || khopNoiDung) && khopThe && khopNgay;
      })
      .sort((a, b) => {
        if (a.daGhim && !b.daGhim) return -1;
        if (!a.daGhim && b.daGhim) return 1;
        if (a.quanTrong && !b.quanTrong) return -1;
        if (!a.quanTrong && b.quanTrong) return 1;
        return new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime();
      });
  }, [danhSachGhiChu, tuKhoaTimKiem, locTheoThe, locTheoKhoangNgay]);

  const cotBang = [
    {
      title: 'Ghim',
      dataIndex: 'daGhim',
      key: 'daGhim',
      width: 60,
      align: 'center' as const,
      render: (daGhim: boolean, record: GhiChu) => (
        <Tooltip title={daGhim ? 'Bỏ ghim' : 'Ghim'}>
          {daGhim ? 
            <PushpinFilled style={{color: '#1890ff', cursor: 'pointer', fontSize: '16px'}} onClick={() => xuLyToggleGhim(record.id)} /> : 
            <PushpinOutlined style={{cursor: 'pointer', fontSize: '16px'}} onClick={() => xuLyToggleGhim(record.id)} />
          }
        </Tooltip>
      ),
    },
    {
      title: 'QT',
      dataIndex: 'quanTrong',
      key: 'quanTrong',
      width: 60,
      align: 'center' as const,
      render: (quanTrong: boolean, record: GhiChu) => (
         <Tooltip title={quanTrong ? 'Bỏ quan trọng' : 'Quan trọng'}>
          {quanTrong ? 
            <StarFilled style={{ color: '#faad14', cursor: 'pointer', fontSize: '16px' }} onClick={() => xuLyToggleQuanTrong(record.id)} /> : 
            <StarOutlined style={{cursor: 'pointer', fontSize: '16px'}} onClick={() => xuLyToggleQuanTrong(record.id)} />
          }
        </Tooltip>
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
      render: (text: string, record: GhiChu) => <a onClick={() => xuLySuaGhiChu(record)}>{text}</a>,
    },
    {
      title: 'Nội dung (vắn tắt)',
      dataIndex: 'noiDung',
      key: 'noiDung',
      ellipsis: true,
      width: 300,
    },
    {
      title: 'Thẻ',
      dataIndex: 'the',
      key: 'the',
      width: 200,
      render: (theMang: string[] | undefined, record: GhiChu) => {
        if (theMang && Array.isArray(theMang) && theMang.length > 0) {
          return (
            <Space wrap size={[0, 8]}> 
              {theMang.map(tag => (
                <Tag color="blue" key={`${record.id}-${tag}`}>
                  {tag.toUpperCase()}
                </Tag>
              ))}
            </Space>
          );
        }
        return null;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      width: 150,
      render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: GhiChu, b: GhiChu) => moment(a.ngayTao).unix() - moment(b.ngayTao).unix(),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: GhiChu) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Button icon={<EditOutlined />} onClick={() => xuLySuaGhiChu(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button icon={<DeleteOutlined />} danger onClick={() => xuLyXoaGhiChu(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
        <Col flex="auto"><Title level={2}>Ghi chú của tôi</Title></Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={xuLyThemGhiChu}>
            Thêm Ghi chú
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="bottom">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Typography.Text style={{display: 'block', marginBottom: 8}}>Tìm kiếm:</Typography.Text>
          <Search
            placeholder="Tìm theo tiêu đề hoặc nội dung"
            allowClear
            onSearch={(value) => dispatch({ type: 'notes/setSearchTerm', payload: value })}
            onChange={(e) => {
                 
                if (e.target.value === '') {  
                    dispatch({ type: 'notes/setSearchTerm', payload: ''})
                }
            }}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Typography.Text style={{display: 'block', marginBottom: 8}}>Lọc theo thẻ:</Typography.Text>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Chọn thẻ để lọc"
            onChange={(values) => dispatch({ type: 'notes/setFilterTags', payload: values })}
            options={tatCaTheHienCo.map(tag => ({ label: tag, value: tag }))}
            value={locTheoThe}  
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Typography.Text style={{display: 'block', marginBottom: 8}}>Lọc theo ngày tạo:</Typography.Text>
          <RangePicker
            style={{ width: '100%' }}
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(dates, dateStrings) => {
              dispatch({ type: 'notes/setFilterDateRange', payload: (dates ? dateStrings : null) as [string, string] | null });
            }}
            value={locTheoKhoangNgay ? [moment(locTheoKhoangNgay[0]), moment(locTheoKhoangNgay[1])] : null}  
          />
        </Col>
        <Col xs={24} sm={12} md={24} lg={6} style={{textAlign: 'right'}}>
          <Space>
            <Typography.Text>Chế độ xem:</Typography.Text>
            <Switch
              checkedChildren={<AppstoreOutlined />}
              unCheckedChildren={<BarsOutlined />}
              checked={cheDoXem === 'luoi'}
              onChange={(checked) => dispatch({ type: 'notes/setViewMode', payload: checked ? 'luoi' : 'danhSach' })}
            />
          </Space>
        </Col>
      </Row>

      {dangTaiGhiChu && danhSachGhiChuDaLoc.length === 0 ? (  
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" tip="Đang tải..." /></div>
      ) : !dangTaiGhiChu && danhSachGhiChuDaLoc.length === 0 ? (  
        <Empty description="Không có ghi chú nào. Hãy tạo một ghi chú mới!" />
      ) : cheDoXem === 'luoi' ? (
        <Row gutter={[16, 16]}>
          {danhSachGhiChuDaLoc.map((note) => (
            <Col xs={24} sm={12} md={8} lg={6} key={note.id}>
              <NoteCard
                ghiChuItem={note}
                onEdit={xuLySuaGhiChu}
                onDelete={xuLyXoaGhiChu}
                onTogglePin={xuLyToggleGhim}
                onToggleImportant={xuLyToggleQuanTrong}
              />
            </Col>
          ))}
        </Row>
      ) : (
         <Table
            columns={cotBang}
            dataSource={danhSachGhiChuDaLoc}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'], showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} ghi chú` }}
            loading={dangTaiGhiChu}
            scroll={{ x: 1000 }}  
          />
      )}

      <NoteForm
        visible={hienThiModal}
        onCancel={() => {
          setHienThiModal(false);
          setGhiChuDangSua(undefined);
        }}
        onFinish={xuLySubmitForm}
        initialValues={ghiChuDangSua}
        tatCaThe={tatCaTheHienCo}
      />
    </div>
  );
};

export default connect(
  ({ notes, loading }: { notes: TrangThaiModelGhiChu; loading: Loading }) => ({
    trangThaiNotes: notes,
    dangTaiGhiChu: loading.effects['notes/fetchNotes'] || loading.effects['notes/addNote'] || loading.effects['notes/updateNote'] || loading.effects['notes/deleteNote'],
  })
)(NotesPage);