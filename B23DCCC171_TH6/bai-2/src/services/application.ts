import { v4 as uuidv4 } from 'uuid'; 

const STORAGE_KEY = 'recruitment_applications';

 
export interface Application {
  id: string;
  name: string;
  email: string;
  aspiration: 'design' | 'dev' | 'media';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;  
  logs: string[];  
  createdAt: number;  
  group?: 'design' | 'dev' | 'media';  
}

 
function getApplicationsFromStorage(): Application[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error reading applications from localStorage:', error);
    return [];
  }
}

function saveApplicationsToStorage(applications: Application[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    console.error('Error saving applications to localStorage:', error);
  }
}
 
export async function queryApplications(params?: {
  current?: number;
  pageSize?: number;
  name?: string;
  email?: string;
  aspiration?: string;
  sorter?: string;  
}): Promise<{ data: Application[]; total: number; success: boolean }> {
  console.log('Querying applications with params:', params);
  await new Promise(resolve => setTimeout(resolve, 300));  

  let applications = getApplicationsFromStorage();

 
  if (params?.name) {
    applications = applications.filter(app =>
      app.name.toLowerCase().includes(params.name?.toLowerCase() ?? '')
    );
  }
  if (params?.email) {
    applications = applications.filter(app =>
      app.email.toLowerCase().includes(params.email?.toLowerCase() ?? '')
    );
  }
   if (params?.aspiration) {
    applications = applications.filter(app => app.aspiration === params.aspiration);
  }

   
   if (params?.sorter === 'createdAt_descend') {
       applications.sort((a, b) => b.createdAt - a.createdAt);
   } else {
     
       applications.sort((a, b) => b.createdAt - a.createdAt);
   }
  


  const total = applications.length;

  
  const { current = 1, pageSize = 10 } = params ?? {};
  const startIndex = (current - 1) * pageSize;
  const paginatedData = applications.slice(startIndex, startIndex + pageSize);


  return { data: paginatedData, total, success: true };
}

 
export async function addApplication(data: Omit<Application, 'id' | 'status' | 'logs' | 'createdAt'>): Promise<{ success: boolean; data?: Application }> {
  console.log('Adding application:', data);
  await new Promise(resolve => setTimeout(resolve, 200)); 

  const applications = getApplicationsFromStorage();
  const newApplication: Application = {
    ...data,
    id: uuidv4(),  
    status: 'pending',
    logs: [`Application submitted at ${new Date().toLocaleString()}`],
    createdAt: Date.now(),
  };
  applications.push(newApplication);
  saveApplicationsToStorage(applications);
  return { success: true, data: newApplication };
}

 
export async function updateApplicationStatus(
    id: string,
    status: 'approved' | 'rejected',
    notes: string,
    adminUsername: string = 'Admin'  
): Promise<{ success: boolean }> {
    console.log(`Updating status for ${id} to ${status} with notes: ${notes}`);
    await new Promise(resolve => setTimeout(resolve, 300));  

    const applications = getApplicationsFromStorage();
    const appIndex = applications.findIndex(app => app.id === id);

    if (appIndex === -1) {
        return { success: false };
    }

    const timestamp = new Date().toLocaleString();
    let logMessage = `${adminUsername} ${status === 'approved' ? 'Approved' : 'Rejected'} at ${timestamp}`;
    if (status === 'rejected' && notes) {
        logMessage += ` with reason: ${notes}`;
    } else if (status === 'approved') {
        
        applications[appIndex].group = applications[appIndex].aspiration;
    }


    applications[appIndex].status = status;
    applications[appIndex].notes = notes;  
    applications[appIndex].logs.push(logMessage);

    saveApplicationsToStorage(applications);
    return { success: true };
}


 
export async function queryMembers(params?: {
  current?: number;
  pageSize?: number;
  name?: string;
  email?: string;
  group?: string;
 
}): Promise<{ data: Application[]; total: number; success: boolean }> {
  console.log('Querying members with params:', params);
  await new Promise(resolve => setTimeout(resolve, 300)); 

  let applications = getApplicationsFromStorage();
  let members = applications.filter(app => app.status === 'approved');

 
  if (params?.name) {
    members = members.filter(mem =>
      mem.name.toLowerCase().includes(params.name?.toLowerCase() ?? '')
    );
  }
   if (params?.email) {
    members = members.filter(mem =>
      mem.email.toLowerCase().includes(params.email?.toLowerCase() ?? '')
    );
  }
  if (params?.group) {
    members = members.filter(mem => mem.group === params.group);
  }

  
  members.sort((a, b) => a.name.localeCompare(b.name));

  const total = members.length;
 
  const { current = 1, pageSize = 10 } = params ?? {};
  const startIndex = (current - 1) * pageSize;
  const paginatedData = members.slice(startIndex, startIndex + pageSize);

  return { data: paginatedData, total, success: true };
}


 
export async function updateMemberGroup(
    id: string,
    group: 'design' | 'dev' | 'media',
    adminUsername: string = 'Admin'
): Promise<{ success: boolean }> {
    console.log(`Updating group for member ${id} to ${group}`);
    await new Promise(resolve => setTimeout(resolve, 200));  

    const applications = getApplicationsFromStorage();
    const appIndex = applications.findIndex(app => app.id === id && app.status === 'approved');

    if (appIndex === -1) {
        return { success: false };  
    }

    const oldGroup = applications[appIndex].group;
    applications[appIndex].group = group;

    const timestamp = new Date().toLocaleString();
    const logMessage = `${adminUsername} changed group from ${oldGroup || 'N/A'} to ${group} at ${timestamp}`;
    applications[appIndex].logs.push(logMessage);


    saveApplicationsToStorage(applications);
    return { success: true };
}

 
export const ASPIRATIONS = [
    { value: 'dev', label: 'Developer' },
    { value: 'design', label: 'Designer' },
    { value: 'media', label: 'Media/Content' },
];

export const GROUPS = ASPIRATIONS;  