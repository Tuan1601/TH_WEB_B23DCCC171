import type { Destination, AppFilters } from '@/types';
import { nanoid } from 'nanoid';

const mockDestinations: Destination[] = [
  { id: nanoid(8), name: 'Ha Long Bay', location: 'Quang Ninh', type: 'beach', imageUrl: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/3/9/1155741/Du-Lich-Vinh-Ha-Long-01.jpg', rating: 4.8, priceRange: 4, description: 'Famous for its emerald waters and thousands of towering limestone islands topped by rainforests.' },
  { id: nanoid(8), name: 'Sapa', location: 'Lao Cai', type: 'mountain', imageUrl: 'https://truyenhinhnghean.vn/file/4028eaa46735a26101673a4df345003c/052023/sapa20230509102910-7052_20230512161256.jpg', rating: 4.5, priceRange: 3, description: 'Known for its terraced rice fields and trekking routes.' },
  { id: nanoid(8), name: 'Hoi An Ancient Town', location: 'Quang Nam', type: 'city', imageUrl: 'https://kienviet.net/wp-content/uploads/2020/12/Picture1.png', rating: 4.7, priceRange: 3, description: 'A well-preserved example of a Southeast Asian trading port.' },
  { id: nanoid(8), name: 'Phu Quoc Island', location: 'Kien Giang', type: 'beach', imageUrl: 'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/11/25/phu-quoc-2-1034.jpg', rating: 4.4, priceRange: 5, description: 'White-sand beaches and calm waters.' },
  { id: nanoid(8), name: 'Da Lat', location: 'Lam Dong', type: 'mountain', imageUrl: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/07/anh-da-lat-36.jpg', rating: 4.3, priceRange: 2, description: 'Known as the "City of Eternal Spring" for its cool climate.' },
  { id: nanoid(8), name: 'Ho Chi Minh City', location: 'Ho Chi Minh City', type: 'city', imageUrl: 'https://static.tuoitre.vn/tto/i/s626/2016/07/25/cho-ben-thanh-02-1469427469.jpg', rating: 4.6, priceRange: 4, description: 'The bustling economic heart of Vietnam.' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function queryDestinations(filters?: AppFilters): Promise<{ data: Destination[]; total: number }> {
  console.log('API Call: queryDestinations with filters:', filters);
  await delay(500);

  let filteredData = [...mockDestinations];

  if (filters) {
    if (filters.type && filters.type.length > 0) {
      filteredData = filteredData.filter(d => filters.type?.includes(d.type));
    }
    if (filters.priceRange) {
        filteredData = filteredData.filter(d => d.priceRange >= filters.priceRange![0] && d.priceRange <= filters.priceRange![1]);
    }
    if (filters.minRating) {
        filteredData = filteredData.filter(d => d.rating >= filters.minRating!);
    }
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'rating_desc':
                filteredData.sort((a, b) => b.rating - a.rating);
                break;
            case 'price_asc':
                filteredData.sort((a, b) => a.priceRange - b.priceRange);
                break;
            case 'price_desc':
                 filteredData.sort((a, b) => b.priceRange - a.priceRange);
                break;
        }
    }
  }

  return { data: filteredData, total: filteredData.length };
}

export async function addDestination(destinationData: Omit<Destination, 'id'>): Promise<Destination> {
    console.log('API Call: addDestination', destinationData);
    await delay(300);
    const newDestination: Destination = {
        ...destinationData,
        id: nanoid(8),
    };
    mockDestinations.push(newDestination);
    return newDestination;
}

export async function updateDestination(id: string, destinationData: Partial<Destination>): Promise<Destination> {
     console.log('API Call: updateDestination', id, destinationData);
     await delay(300);
     const index = mockDestinations.findIndex(d => d.id === id);
     if (index !== -1) {
        mockDestinations[index] = { ...mockDestinations[index], ...destinationData };
        return mockDestinations[index];
     }
     throw new Error('Destination not found');
}

export async function deleteDestination(id: string): Promise<{ success: boolean }> {
    console.log('API Call: deleteDestination', id);
    await delay(300);
    const index = mockDestinations.findIndex(d => d.id === id);
    if (index !== -1) {
        mockDestinations.splice(index, 1);
        return { success: true };
    }
     return { success: false };
}

export async function queryStatistics(): Promise<any> {
    console.log('API Call: queryStatistics');
    await delay(400);
    return {
        itinerariesByMonth: { 'Jan': 10, 'Feb': 15, 'Mar': 25 },
        popularDestinations: [
            { id: mockDestinations[0]?.id || '1', name: mockDestinations[0]?.name || 'Ha Long', count: 15 },
            { id: mockDestinations[2]?.id || '3', name: mockDestinations[2]?.name || 'Hoi An', count: 12 },
        ]
    };
}
