export default function Medication() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Medication Management</h1>
      <p className="text-gray-600">
        This is the medication management section. Here you can view and manage medication information.
      </p>
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Medication Features</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>View medication inventory</li>
          <li>Add new medications</li>
          <li>Update medication details</li>
          <li>Track medication usage</li>
        </ul>
      </div>
    </div>
  );
} 