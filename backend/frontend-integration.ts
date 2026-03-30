// API service for connecting React frontend to FastAPI backend
// Place this in src/services/api.ts

const API_BASE_URL = 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Upload CSV dataset
  async uploadDataset(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return { data: await response.json() };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Upload failed' };
    }
  }

  // Get dashboard data
  async getDashboard() {
    return this.request('/dashboard');
  }

  // Get recommendations
  async getRecommendations() {
    return this.request('/recommendations');
  }

  // Get audit information
  async getAuditInfo() {
    return this.request('/audit');
  }

  // Get supply chain records
  async getRecords(limit = 100) {
    return this.request(`/records?limit=${limit}`);
  }

  // Get emission factors
  async getEmissionFactors() {
    return this.request('/emission-factors');
  }
}

export const apiService = new ApiService();

// Usage example for updating DataContext:
/*
// In DataContext.tsx, replace local calculations with API calls:

const commitParsedData = async (file: File) => {
  const result = await apiService.uploadDataset(file);
  
  if (result.error) {
    showNotification(result.error, 'error');
    return;
  }

  // Refresh dashboard data
  const dashboardResult = await apiService.getDashboard();
  if (dashboardResult.data) {
    // Update state with backend data
    setData(prevData => ({
      ...prevData,
      totalEmissions: dashboardResult.data.total_emissions,
      suppliers: dashboardResult.data.suppliers,
      materials: dashboardResult.data.materials,
      transportModes: dashboardResult.data.transport_modes,
      categoryBreakdown: dashboardResult.data.category_breakdown,
      dataVersion: Date.now()
    }));
  }

  showNotification(
    `Successfully processed ${result.data.records_processed} records`,
    'success'
  );
};
*/