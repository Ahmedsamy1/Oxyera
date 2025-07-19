'use client';

import { useState, useEffect } from 'react';
import { medicationService, type Medication, type UpdateMedicationData, type CreateMedicationData } from '../services/medicationService';

export default function Medication() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [editingMedication, setEditingMedication] = useState<UpdateMedicationData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMedication, setNewMedication] = useState<CreateMedicationData>({ name: '', dosage: '', frequency: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await medicationService.getMedications();
        setMedications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch medications');
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  const handleMedicationClick = async (medicationId: number) => {
    try {
      setDetailLoading(true);
      setError(null);
      const medication = await medicationService.getMedicationById(medicationId);
      setSelectedMedication(medication);
      setEditingMedication({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch medication details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedMedication || !editingMedication) return;

    try {
      setSaving(true);
      setError(null);
      
      const updatedMedication = await medicationService.updateMedication(selectedMedication.id, editingMedication);
      
      // Update the selected medication with new data
      setSelectedMedication(updatedMedication);
      
      // Update the medication in the list
      setMedications(prevMedications => 
        prevMedications.map(medication => 
          medication.id === selectedMedication.id ? updatedMedication : medication
        )
      );
      
      // Show success message (you could add a toast notification here)
      alert('Medication updated successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update medication');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMedication) return;

    const confirmed = window.confirm(`Are you sure you want to delete medication "${selectedMedication.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeleting(true);
      setError(null);
      
      await medicationService.deleteMedication(selectedMedication.id);
      
      // Remove the medication from the list
      setMedications(prevMedications => 
        prevMedications.filter(medication => medication.id !== selectedMedication.id)
      );
      
      // Close the detail view
      setSelectedMedication(null);
      setEditingMedication(null);
      
      // Show success message
      alert('Medication deleted successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete medication');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateMedication = async () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      
      const createdMedication = await medicationService.createMedication(newMedication);
      
      // Add the new medication to the list
      setMedications(prevMedications => [...prevMedications, createdMedication]);
      
      // Reset form
      setNewMedication({ name: '', dosage: '', frequency: '' });
      setShowCreateForm(false);
      
      // Show success message
      alert('Medication created successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create medication');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Medication Management</h1>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading medications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Medication Management</h1>
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
        <h1 className="text-2xl font-bold">Medication Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
        >
          {showCreateForm ? 'Cancel' : 'Add New Medication'}
        </button>
      </div>
      
      {/* Create Medication Form */}
      {showCreateForm && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-green-50 border-b">
            <h2 className="text-lg font-semibold text-green-800">Create New Medication</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter medication name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 100mg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <input
                  type="text"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Once daily"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleCreateMedication}
                disabled={creating}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {creating ? 'Creating...' : 'Create Medication'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewMedication({ name: '', dosage: '', frequency: '' });
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
      
      {medications.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No medications found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Medication Records</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {medications.map((medication) => (
                <div 
                  key={medication.id} 
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleMedicationClick(medication.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                      <p className="text-sm text-gray-500">ID: {medication.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Dosage</p>
                      <p className="text-sm font-medium text-gray-900">{medication.dosage}</p>
                      <p className="text-sm text-gray-600 mt-1">Frequency</p>
                      <p className="text-sm font-medium text-gray-900">{medication.frequency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medication Detail Section */}
          {selectedMedication && editingMedication && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-blue-50 border-b">
                <h2 className="text-lg font-semibold text-blue-800">Medication Details</h2>
              </div>
              <div className="p-6">
                {detailLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading medication details...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medication ID</label>
                        <p className="text-lg text-gray-900">{selectedMedication.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={editingMedication.name}
                          onChange={(e) => setEditingMedication(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                        <input
                          type="text"
                          value={editingMedication.dosage}
                          onChange={(e) => setEditingMedication(prev => prev ? {...prev, dosage: e.target.value} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                        <input
                          type="text"
                          value={editingMedication.frequency}
                          onChange={(e) => setEditingMedication(prev => prev ? {...prev, frequency: e.target.value} : null)}
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
                        {deleting ? 'Deleting...' : 'Delete Medication'}
                      </button>
                      <button 
                        onClick={() => setSelectedMedication(null)}
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