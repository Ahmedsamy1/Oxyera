export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
}

export interface UpdateMedicationData {
  name: string;
  dosage: string;
  frequency: string;
}

export interface CreateMedicationData {
  name: string;
  dosage: string;
  frequency: string;
}

const API_BASE_URL = 'http://localhost:8080';

export const medicationService = {
  async getMedications(): Promise<Medication[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/medication`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching medications:', error);
      throw error;
    }
  },

  async getMedicationById(id: number): Promise<Medication> {
    try {
      const response = await fetch(`${API_BASE_URL}/medication/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching medication ${id}:`, error);
      throw error;
    }
  },

  async createMedication(medicationData: CreateMedicationData): Promise<Medication> {
    try {
      const response = await fetch(`${API_BASE_URL}/medication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicationData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating medication:', error);
      throw error;
    }
  },

  async updateMedication(id: number, medicationData: UpdateMedicationData): Promise<Medication> {
    try {
      const response = await fetch(`${API_BASE_URL}/medication/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicationData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating medication ${id}:`, error);
      throw error;
    }
  }
}; 