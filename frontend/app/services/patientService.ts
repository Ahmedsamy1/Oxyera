export interface Patient {
  id: number;
  name: string;
  dob: string;
}

export interface UpdatePatientData {
  name: string;
  dob: string;
}

export interface CreatePatientData {
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
  },

  async createPatient(patientData: CreatePatientData): Promise<Patient> {
    try {
      const response = await fetch(`${API_BASE_URL}/patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  async updatePatient(id: number, patientData: UpdatePatientData): Promise<Patient> {
    try {
      const response = await fetch(`${API_BASE_URL}/patient/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating patient ${id}:`, error);
      throw error;
    }
  },

  async deletePatient(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/patient/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting patient ${id}:`, error);
      throw error;
    }
  }
}; 