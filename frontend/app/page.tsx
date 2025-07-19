"use client"

import { useState } from 'react';
import Navbar from './components/Navbar';
import Patient from './components/Patient';
import Medication from './components/Medication';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'patient' | 'medication'>('patient');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto">
        {activeTab === 'patient' ? <Patient /> : <Medication />}
      </main>
    </div>
  );
}
