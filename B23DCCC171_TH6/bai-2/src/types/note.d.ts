 export interface GhiChu {
    id: string;
    tieuDe: string;
    noiDung: string;
    ngayTao: string;  
    the: string[];  
    quanTrong: boolean;
    daGhim: boolean;
  }
  
  export type DuLieuFormGhiChu = Omit<GhiChu, 'id' | 'ngayTao' | 'daGhim' | 'quanTrong'> & {
    quanTrong?: boolean; 
    the?: string[];    
  };