// Mock API service for React-only app
export interface EmissionData {
  id: string;
  supplier: string;
  material: string;
  weight: number;
  emissions: number;
  date: string;
  transportMode: string;
}

export interface DashboardData {
  totalEmissions: number;
  suppliers: Array<{
    name: string;
    emissions: number;
    contribution: number;
  }>;
  materials: Array<{
    name: string;
    percentage: number;
  }>;
  transportModes: Array<{
    mode: string;
    value: number;
  }>;
}

// Mock data
const mockData: EmissionData[] = [
  {
    id: '1',
    supplier: 'Global Steel Co',
    material: 'Steel',
    weight: 2000,
    emissions: 3700,
    date: '2024-01-15',
    transportMode: 'Heavy Duty Truck'
  },
  {
    id: '2',
    supplier: 'AluFab Ltd',
    material: 'Aluminum',
    weight: 800,
    emissions: 10000,
    date: '2024-01-20',
    transportMode: 'Cargo Ship'
  }
];

export const mockApiService = {
  getDashboard: (): Promise<DashboardData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalEmissions = mockData.reduce((sum, item) => sum + item.emissions, 0);
        
        resolve({
          totalEmissions,
          suppliers: [
            { name: 'Global Steel Co', emissions: 5400, contribution: 45 },
            { name: 'AluFab Ltd', emissions: 2800, contribution: 21 }
          ],
          materials: [
            { name: 'Steel', percentage: 50 },
            { name: 'Aluminum', percentage: 30 },
            { name: 'Plastic', percentage: 20 }
          ],
          transportModes: [
            { mode: 'Heavy Duty Truck', value: 3500 },
            { mode: 'Cargo Ship', value: 2500 },
            { mode: 'Air Cargo', value: 1200 }
          ]
        });
      }, 500);
    });
  },

  uploadData: (csvData: string): Promise<{ success: boolean; recordsProcessed: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          recordsProcessed: 10
        });
      }, 1000);
    });
  }
};