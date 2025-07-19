export interface Patient {
  id: number;
  name: string;
  dob: string;
}

const API_BASE_URL = 'http://localhost:8080';

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patient`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  async getPatientById(id: number): Promise<Patient> {
    try {
      const response = await fetch(`${API_BASE_URL}/patient/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error);
      throw error;
    }
  }
}; 