export interface Assignment {
  id: number;
  patientId: number;
  medicationId: number;
  startDate: string;
  numberOfDays: number;
}

export interface UpdateAssignmentData {
  patientId: number;
  medicationId: number;
  startDate: string;
  numberOfDays: number;
}

export interface CreateAssignmentData {
  patientId: number;
  medicationId: number;
  startDate: string;
  numberOfDays: number;
}

export interface RemainingDaysData {
  assignment: Assignment;
  remainingDays: number;
}

const API_BASE_URL = 'http://localhost:8080';

export const assignmentService = {
  async getAssignments(): Promise<Assignment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/assignment`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  async getAssignmentsByPatientId(patientId: number): Promise<Assignment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/assignment/patient/${patientId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching assignments for patient ${patientId}:`, error);
      throw error;
    }
  },

  async getAssignmentById(id: number): Promise<Assignment> {
    try {
      const response = await fetch(`${API_BASE_URL}/assignment/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error);
      throw error;
    }
  },

  async getRemainingDaysById(id: number): Promise<RemainingDaysData> {
    try {
      const response = await fetch(`${API_BASE_URL}/assignment/${id}/remaining-days`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching remaining days for assignment ${id}:`, error);
      throw error;
    }
  },

  async getRemainingDays(): Promise<RemainingDaysData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/assignment/remaining-days`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching remaining days:', error);
      throw error;
    }
  },

  async createAssignment(assignmentData: CreateAssignmentData): Promise<Assignment | { error: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/assignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });
      
      const data = await response.json();
      if (!response.ok) {
        // If the response is not ok, return the error field from the response JSON or a fallback
        return { error: data.error || `HTTP error! status: ${response.status}` };
      }
      
      return data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },

  async updateAssignment(id: number, assignmentData: UpdateAssignmentData): Promise<Assignment> {
    try {
      const response = await fetch(`${API_BASE_URL}/assignment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating assignment ${id}:`, error);
      throw error;
    }
  },

  async deleteAssignment(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/assignment/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting assignment ${id}:`, error);
      throw error;
    }
  }
}; 