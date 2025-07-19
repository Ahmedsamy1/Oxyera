'use client';

import { useState, useEffect } from 'react';
import { patientService, type Patient, type UpdatePatientData, type CreatePatientData } from '../services/patientService';

export default function Patient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<UpdatePatientData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPatient, setNewPatient] = useState<CreatePatientData>({ name: '', dob: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await patientService.getPatients();
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientClick = async (patientId: number) => {
    try {
      setDetailLoading(true);
      setError(null);
      const patient = await patientService.getPatientById(patientId);
      setSelectedPatient(patient);
      setEditingPatient({
        name: patient.name,
        dob: patient.dob
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patient details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPatient || !editingPatient) return;

    try {
      setSaving(true);
      setError(null);
      
      const updatedPatient = await patientService.updatePatient(selectedPatient.id, editingPatient);
      
      // Update the selected patient with new data
      setSelectedPatient(updatedPatient);
      
      // Update the patient in the list
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === selectedPatient.id ? updatedPatient : patient
        )
      );
      
      // Show success message (you could add a toast notification here)
      alert('Patient updated successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update patient');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPatient) return;

    const confirmed = window.confirm(`Are you sure you want to delete patient "${selectedPatient.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeleting(true);
      setError(null);
      
      await patientService.deletePatient(selectedPatient.id);
      
      // Remove the patient from the list
      setPatients(prevPatients => 
        prevPatients.filter(patient => patient.id !== selectedPatient.id)
      );
      
      // Close the detail view
      setSelectedPatient(null);
      setEditingPatient(null);
      
      // Show success message
      alert('Patient deleted successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete patient');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreatePatient = async () => {
    if (!newPatient.name || !newPatient.dob) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      
      const createdPatient = await patientService.createPatient(newPatient);
      
      // Add the new patient to the list
      setPatients(prevPatients => [...prevPatients, createdPatient]);
      
      // Reset form
      setNewPatient({ name: '', dob: '' });
      setShowCreateForm(false);
      
      // Show success message
      alert('Patient created successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create patient');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading patients...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patient Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
        >
          {showCreateForm ? 'Cancel' : 'Add New Patient'}
        </button>
      </div>
      
      {/* Create Patient Form */}
      {showCreateForm && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-green-50 border-b">
            <h2 className="text-lg font-semibold text-green-800">Create New Patient</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={newPatient.dob}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, dob: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleCreatePatient}
                disabled={creating}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {creating ? 'Creating...' : 'Create Patient'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPatient({ name: '', dob: '' });
                }}
                disabled={creating}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {patients.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No patients found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Patient Records</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <div 
                  key={patient.id} 
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handlePatientClick(patient.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500">ID: {patient.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(patient.dob)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Detail Section */}
          {selectedPatient && editingPatient && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-blue-50 border-b">
                <h2 className="text-lg font-semibold text-blue-800">Patient Details</h2>
              </div>
              <div className="p-6">
                {detailLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading patient details...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                        <p className="text-lg text-gray-900">{selectedPatient.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={editingPatient.name}
                          onChange={(e) => setEditingPatient(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={editingPatient.dob}
                          onChange={(e) => setEditingPatient(prev => prev ? {...prev, dob: e.target.value} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200 flex gap-2">
                      <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        onClick={handleDelete}
                        disabled={saving || deleting}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        {deleting ? 'Deleting...' : 'Delete Patient'}
                      </button>
                      <button 
                        onClick={() => setSelectedPatient(null)}
                        disabled={saving || deleting}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 