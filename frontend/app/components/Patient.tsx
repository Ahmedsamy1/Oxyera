export default function Patient() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
      <p className="text-gray-600">
        This is the patient management section. Here you can view and manage patient information.
      </p>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Patient Features</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>View patient records</li>
          <li>Add new patients</li>
          <li>Update patient information</li>
          <li>Search patient database</li>
        </ul>
      </div>
    </div>
  );
} 