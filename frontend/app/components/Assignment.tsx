'use client';

import { useState, useEffect } from 'react';
import { assignmentService, type Assignment, type UpdateAssignmentData, type CreateAssignmentData, type RemainingDaysData } from '../services/assignmentService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Assignment() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<UpdateAssignmentData | null>(null);
  const [assignmentRemainingDays, setAssignmentRemainingDays] = useState<RemainingDaysData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRemainingDays, setShowRemainingDays] = useState(false);
  const [remainingDaysData, setRemainingDaysData] = useState<RemainingDaysData[]>([]);
  const [newAssignment, setNewAssignment] = useState<CreateAssignmentData>({ 
    patientId: 0, 
    medicationId: 0, 
    startDate: '', 
    numberOfDays: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [remainingDaysLoading, setRemainingDaysLoading] = useState(false);
  const [assignmentRemainingDaysLoading, setAssignmentRemainingDaysLoading] = useState(false);
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

      // Fetch remaining days for this specific assignment
      try {
        setAssignmentRemainingDaysLoading(true);
        const remainingDaysData = await assignmentService.getRemainingDaysById(assignmentId);
        setAssignmentRemainingDays(remainingDaysData);
      } catch (err) {
        console.error('Failed to fetch assignment remaining days:', err);
        setAssignmentRemainingDays(null);
      } finally {
        setAssignmentRemainingDaysLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assignment details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRemainingDays = async () => {
    try {
      setRemainingDaysLoading(true);
      setError(null);
      const data = await assignmentService.getRemainingDays();
      setRemainingDaysData(data);
      setShowRemainingDays(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch remaining days');
    } finally {
      setRemainingDaysLoading(false);
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
      
      // Refresh remaining days data for this assignment
      try {
        const remainingDaysData = await assignmentService.getRemainingDaysById(selectedAssignment.id);
        setAssignmentRemainingDays(remainingDaysData);
      } catch (err) {
        console.error('Failed to refresh assignment remaining days:', err);
      }
      
      // Refresh remaining days data if it's currently shown
      if (showRemainingDays) {
        try {
          const remainingDaysData = await assignmentService.getRemainingDays();
          setRemainingDaysData(remainingDaysData);
        } catch (err) {
          console.error('Failed to refresh remaining days data:', err);
        }
      }
      
      toast.success('Assignment updated successfully!');
      
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
      setAssignmentRemainingDays(null);
      
      // Refresh remaining days data if it's currently shown
      if (showRemainingDays) {
        try {
          const remainingDaysData = await assignmentService.getRemainingDays();
          setRemainingDaysData(remainingDaysData);
        } catch (err) {
          console.error('Failed to refresh remaining days data:', err);
        }
      }
      
      toast.success('Assignment deleted successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assignment');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.patientId || !newAssignment.medicationId || !newAssignment.startDate || !newAssignment.numberOfDays) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      
      const createdAssignment = await assignmentService.createAssignment(newAssignment);
      
      // If the response contains an error, alert it and do not proceed
      if ('error' in createdAssignment) {
        toast.error(createdAssignment.error);
        return;
      }
      
      // Add the new assignment to the list
      setAssignments(prevAssignments => [...prevAssignments, createdAssignment]);
      
      // Reset form
      setNewAssignment({ patientId: 0, medicationId: 0, startDate: '', numberOfDays: 0 });
      setShowCreateForm(false);
      
      // Refresh remaining days data if it's currently shown
      if (showRemainingDays) {
        try {
          const remainingDaysData = await assignmentService.getRemainingDays();
          setRemainingDaysData(remainingDaysData);
        } catch (err) {
          console.error('Failed to refresh remaining days data:', err);
        }
      }
      
      toast.success('Assignment created successfully!');
      
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
        <div className="flex gap-2">
          <button
            onClick={handleRemainingDays}
            disabled={remainingDaysLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {remainingDaysLoading ? 'Loading...' : 'Remaining Days'}
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
          >
            {showCreateForm ? 'Cancel' : 'Add New Assignment'}
          </button>
        </div>
      </div>
      
      {/* Remaining Days Section */}
      {showRemainingDays && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-purple-50 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-purple-800">Remaining Days</h2>
              <button
                onClick={() => setShowRemainingDays(false)}
                className="text-purple-600 hover:text-purple-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-6">
            {remainingDaysData.length === 0 ? (
              <p className="text-gray-500">No remaining days data found.</p>
            ) : (
              <div className="space-y-4">
                {remainingDaysData.map((item) => (
                  <div key={item.assignment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Assignment #{item.assignment.id}</h3>
                        <p className="text-sm text-gray-500">Patient ID: {item.assignment.patientId}</p>
                        <p className="text-sm text-gray-500">Medication ID: {item.assignment.medicationId}</p>
                        <p className="text-sm text-gray-500">Start Date: {formatDate(item.assignment.startDate)}</p>
                        <p className="text-sm text-gray-500">Total Days: {item.assignment.numberOfDays}</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-600 font-medium">Remaining Days</p>
                          <p className="text-2xl font-bold text-blue-800">{item.remainingDays}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
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
                  <div className="space-y-6">
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

                    {/* Assignment Remaining Days Section */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Remaining Days</h3>
                      {assignmentRemainingDaysLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-gray-600">Loading remaining days...</span>
                        </div>
                      ) : assignmentRemainingDays ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-600 font-medium">Remaining Days</p>
                              <p className="text-3xl font-bold text-green-800">{assignmentRemainingDays.remainingDays}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-green-600">Total Days</p>
                              <p className="text-lg font-semibold text-green-800">{assignmentRemainingDays.assignment.numberOfDays}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-gray-500">Unable to load remaining days data.</p>
                        </div>
                      )}
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
      <ToastContainer aria-label="Toast notifications" />
    </div>
  );
} 