import { GhiChu } from '@/types/note';

const LOCAL_STORAGE_KEY = 'ung_dung_ghi_chu_antd_v2';  

export async function layTatCaGhiChu(): Promise<GhiChu[]> {
  try {
    const ghiChuJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (ghiChuJson) {
      const danhSachGhiChu = JSON.parse(ghiChuJson) as GhiChu[];
      return danhSachGhiChu.sort((a, b) => {
        if (a.daGhim && !b.daGhim) return -1;
        if (!a.daGhim && b.daGhim) return 1;
        return new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime();
      });
    }
    return [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách ghi chú từ localStorage:', error);
    return [];
  }
}

export async function luuTatCaGhiChu(danhSachGhiChu: GhiChu[]): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(danhSachGhiChu));
  } catch (error) {
    console.error('Lỗi khi lưu danh sách ghi chú vào localStorage:', error);
  }
}

export async function themGhiChuMoi(duLieuGhiChu: Omit<GhiChu, 'id' | 'ngayTao' | 'daGhim'>): Promise<GhiChu> {
 
  const danhSachGhiChu = await layTatCaGhiChu();
  const ghiChuMoi: GhiChu = {
    tieuDe: duLieuGhiChu.tieuDe,
    noiDung: duLieuGhiChu.noiDung,
    the: duLieuGhiChu.the || [],  
    quanTrong: duLieuGhiChu.quanTrong || false,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    ngayTao: new Date().toISOString(),
    daGhim: false,
  };
  danhSachGhiChu.push(ghiChuMoi);
  await luuTatCaGhiChu(danhSachGhiChu);
  return ghiChuMoi;
}

export async function capNhatGhiChu(ghiChuCapNhat: GhiChu): Promise<GhiChu | undefined> {
 
  let danhSachGhiChu = await layTatCaGhiChu();
  const chiSoGhiChu = danhSachGhiChu.findIndex(note => note.id === ghiChuCapNhat.id);
  if (chiSoGhiChu > -1) {
    danhSachGhiChu[chiSoGhiChu] = {
        ...ghiChuCapNhat,
        the: ghiChuCapNhat.the || [],  
    };
    await luuTatCaGhiChu(danhSachGhiChu);
    return danhSachGhiChu[chiSoGhiChu];
  }
  return undefined;
}

export async function xoaGhiChuTheoId(id: string): Promise<void> {
  let danhSachGhiChu = await layTatCaGhiChu();
  danhSachGhiChu = danhSachGhiChu.filter(note => note.id !== id);
  await luuTatCaGhiChu(danhSachGhiChu);
}