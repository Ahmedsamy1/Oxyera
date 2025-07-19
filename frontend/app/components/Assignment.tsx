'use client';

import { useState, useEffect } from 'react';
import { assignmentService, type Assignment, type UpdateAssignmentData, type CreateAssignmentData } from '../services/assignmentService';

export default function Assignment() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<UpdateAssignmentData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState<CreateAssignmentData>({ 
    patientId: 0, 
    medicationId: 0, 
    startDate: '', 
    numberOfDays: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await assignmentService.getAssignments();
        setAssignments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleAssignmentClick = async (assignmentId: number) => {
    try {
      setDetailLoading(true);
      setError(null);
      const assignment = await assignmentService.getAssignmentById(assignmentId);
      setSelectedAssignment(assignment);
      setEditingAssignment({
        patientId: assignment.patientId,
        medicationId: assignment.medicationId,
        startDate: assignment.startDate,
        numberOfDays: assignment.numberOfDays
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assignment details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedAssignment || !editingAssignment) return;

    try {
      setSaving(true);
      setError(null);
      
      const updatedAssignment = await assignmentService.updateAssignment(selectedAssignment.id, editingAssignment);
      
      // Update the selected assignment with new data
      setSelectedAssignment(updatedAssignment);
      
      // Update the assignment in the list
      setAssignments(prevAssignments => 
        prevAssignments.map(assignment => 
          assignment.id === selectedAssignment.id ? updatedAssignment : assignment
        )
      );
      
      // Show success message (you could add a toast notification here)
      alert('Assignment updated successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update assignment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAssignment) return;

    const confirmed = window.confirm(`Are you sure you want to delete assignment ID ${selectedAssignment.id}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeleting(true);
      setError(null);
      
      await assignmentService.deleteAssignment(selectedAssignment.id);
      
      // Remove the assignment from the list
      setAssignments(prevAssignments => 
        prevAssignments.filter(assignment => assignment.id !== selectedAssignment.id)
      );
      
      // Close the detail view
      setSelectedAssignment(null);
      setEditingAssignment(null);
      
      // Show success message
      alert('Assignment deleted successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assignment');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.patientId || !newAssignment.medicationId || !newAssignment.startDate || !newAssignment.numberOfDays) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      
      const createdAssignment = await assignmentService.createAssignment(newAssignment);
      
      // Add the new assignment to the list
      setAssignments(prevAssignments => [...prevAssignments, createdAssignment]);
      
      // Reset form
      setNewAssignment({ patientId: 0, medicationId: 0, startDate: '', numberOfDays: 0 });
      setShowCreateForm(false);
      
      // Show success message
      alert('Assignment created successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
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
        <h1 className="text-2xl font-bold mb-4">Assignment Management</h1>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading assignments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Assignment Management</h1>
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
        <h1 className="text-2xl font-bold">Assignment Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
        >
          {showCreateForm ? 'Cancel' : 'Add New Assignment'}
        </button>
      </div>
      
      {/* Create Assignment Form */}
      {showCreateForm && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-green-50 border-b">
            <h2 className="text-lg font-semibold text-green-800">Create New Assignment</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <input
                  type="number"
                  value={newAssignment.patientId || ''}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, patientId: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medication ID</label>
                <input
                  type="number"
                  value={newAssignment.medicationId || ''}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, medicationId: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter medication ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={newAssignment.startDate}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
                <input
                  type="number"
                  value={newAssignment.numberOfDays || ''}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, numberOfDays: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter number of days"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleCreateAssignment}
                disabled={creating}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {creating ? 'Creating...' : 'Create Assignment'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewAssignment({ patientId: 0, medicationId: 0, startDate: '', numberOfDays: 0 });
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
      
      {assignments.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No assignments found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Assignment Records</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <div 
                  key={assignment.id} 
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleAssignmentClick(assignment.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Assignment #{assignment.id}</h3>
                      <p className="text-sm text-gray-500">Patient ID: {assignment.patientId}</p>
                      <p className="text-sm text-gray-500">Medication ID: {assignment.medicationId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(assignment.startDate)}</p>
                      <p className="text-sm text-gray-600 mt-1">Duration</p>
                      <p className="text-sm font-medium text-gray-900">{assignment.numberOfDays} days</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Detail Section */}
          {selectedAssignment && editingAssignment && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-blue-50 border-b">
                <h2 className="text-lg font-semibold text-blue-800">Assignment Details</h2>
              </div>
              <div className="p-6">
                {detailLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading assignment details...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assignment ID</label>
                        <p className="text-lg text-gray-900">{selectedAssignment.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                        <input
                          type="number"
                          value={editingAssignment.patientId}
                          onChange={(e) => setEditingAssignment(prev => prev ? {...prev, patientId: parseInt(e.target.value) || 0} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medication ID</label>
                        <input
                          type="number"
                          value={editingAssignment.medicationId}
                          onChange={(e) => setEditingAssignment(prev => prev ? {...prev, medicationId: parseInt(e.target.value) || 0} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={editingAssignment.startDate}
                          onChange={(e) => setEditingAssignment(prev => prev ? {...prev, startDate: e.target.value} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
                        <input
                          type="number"
                          value={editingAssignment.numberOfDays}
                          onChange={(e) => setEditingAssignment(prev => prev ? {...prev, numberOfDays: parseInt(e.target.value) || 0} : null)}
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
                        {deleting ? 'Deleting...' : 'Delete Assignment'}
                      </button>
                      <button 
                        onClick={() => setSelectedAssignment(null)}
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