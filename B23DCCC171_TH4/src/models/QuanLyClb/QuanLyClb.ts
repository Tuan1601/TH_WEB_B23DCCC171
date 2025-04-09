import { Registration, Member } from '../../services/QuanLyClb/typing';

export const storageService = {
  // Registration
  getRegistrations: (): Registration[] => {
    return JSON.parse(localStorage.getItem('registrations') || '[]');
  },
  
  saveRegistration: (data: Registration) => {
    const registrations = storageService.getRegistrations();
    registrations.push(data);
    localStorage.setItem('registrations', JSON.stringify(registrations));
  },
  
  updateRegistration: (data: Registration) => {
    const registrations = storageService.getRegistrations();
    const index = registrations.findIndex(r => r.id === data.id);
    if (index !== -1) {
      registrations[index] = data;
      localStorage.setItem('registrations', JSON.stringify(registrations));
    }
  },

  // Members
  getMembers: (): Member[] => {
    return JSON.parse(localStorage.getItem('members') || '[]');
  },
  
  saveMember: (data: Member) => {
    const members = storageService.getMembers();
    members.push(data);
    localStorage.setItem('members', JSON.stringify(members));
  },
  
  updateMember: (data: Member) => {
    const members = storageService.getMembers();
    const index = members.findIndex(m => m.id === data.id);
    if (index !== -1) {
      members[index] = data;
      localStorage.setItem('members', JSON.stringify(members));
    }
  }
};