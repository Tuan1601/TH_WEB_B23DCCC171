
export interface Registration {
    id: string;
    fullName: string;
    email: string;
    aspiration: 'design' | 'dev' | 'media';
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    note?: string;
    log?: string;
  }
  
  export interface Member {
    id: string;
    fullName: string;
    email: string;
    role: string;
    team: 'Team Design' | 'Team Dev' | 'Team Media';
  }