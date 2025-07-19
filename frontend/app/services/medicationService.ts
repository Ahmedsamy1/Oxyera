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

import { API_BASE_URL } from '../config/api';

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
  },

  async deleteMedication(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/medication/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting medication ${id}:`, error);
      throw error;
    }
  }
}; 