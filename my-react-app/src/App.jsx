import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import HomeView from './components/views/HomeView';
import AnalyseStatementView from './components/views/AnalyseStatementView';
import SifPrecursorTriageView from './components/views/SifPrecursorTriageView';

function PlaceholderView({ title }) {
  return (
    <main className="flex-1 p-8">
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-xs">
        <h2 className="text-xl font-bold capitalize text-gray-800">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">
          Content for the <span className="font-semibold">{title}</span> section is under construction.
        </p>
      </div>
    </main>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('triage'); // Set to triage to view immediately

  return (
    <div className="flex min-h-screen bg-[#f3f6f9] text-[#1c2a38] font-sans antialiased">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenSidebar={() => setSidebarOpen(true)}
          pageTitle={
            activeTab === 'triage'
              ? 'SIF-Precursor Triage'
              : activeTab === 'analyse'
              ? 'Analyse Statement'
              : activeTab.replace('-', ' ')
          }
        />

        {activeTab === 'home' && (
          <HomeView onNavigate={(tabId) => setActiveTab(tabId)} />
        )}

        {activeTab === 'analyse' && <AnalyseStatementView />}

        {activeTab === 'triage' && <SifPrecursorTriageView />}

        {activeTab !== 'home' &&
          activeTab !== 'analyse' &&
          activeTab !== 'triage' && (
            <PlaceholderView title={activeTab.replace('-', ' ')} />
          )}
      </div>
    </div>
  );
}