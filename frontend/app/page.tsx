"use client"

import { useState } from 'react';
import Navbar from './components/Navbar';
import Patient from './components/Patient';
import Medication from './components/Medication';
import Assignment from './components/Assignment';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'patient' | 'medication' | 'assignment'>('patient');

  const renderContent = () => {
    switch (activeTab) {
      case 'patient':
        return <Patient />;
      case 'medication':
        return <Medication />;
      case 'assignment':
        return <Assignment />;
      default:
        return <Patient />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
}
