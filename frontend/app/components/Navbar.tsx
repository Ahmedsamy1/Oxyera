"use client"

interface NavbarProps {
  activeTab: 'patient' | 'medication';
  onTabChange: (tab: 'patient' | 'medication') => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Healthcare Management</h1>
            </div>
          </div>
          <div className="flex space-x-8">
            <button
              onClick={() => onTabChange('patient')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer ${
                activeTab === 'patient'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Patients
            </button>
            <button
              onClick={() => onTabChange('medication')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer ${
                activeTab === 'medication'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Medications
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 