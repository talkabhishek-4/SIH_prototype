import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import HomeView from './components/views/HomeView';
import AnalyseStatementView from './components/views/AnalyseStatementView';
import SifPrecursorTriageView from './components/views/SifPrecursorTriageView';
import RiskDashboardView from './components/views/RiskDashboardView';
import PrecursorPatternsView from './components/views/PrecursorPatternsView';
import SitesActivitiesView from './components/views/SitesActivitiesView';
import LifeSavingRulesView from './components/views/LifeSavingRulesView';
import ReportsView from './components/views/ReportsView';
import SystemView from './components/views/SystemView';

function PlaceholderView({ title }) {
  return (
    <main className="flex-1 p-8">
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
        <h2 className="text-xl font-bold capitalize text-slate-800">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">
          Content for the <span className="font-semibold">{title}</span> section is under construction.
        </p>
      </div>
    </main>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('system');

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'risk-dashboard':
        return 'Risk Dashboard';
      case 'triage':
        return 'SIF-Precursor Triage';
      case 'analyse':
        return 'Analyse Statement';
      case 'patterns':
        return 'Precursor Patterns';
      case 'sites':
        return 'Sites & Activities';
      case 'rules':
        return 'Life-Saving Rules';
      case 'reports':
        return 'Reports';
      case 'system':
        return 'System';
      default:
        return tab.replace('-', ' ');
    }
  };

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
          pageTitle={getPageTitle(activeTab)}
        />

        {activeTab === 'home' && (
          <HomeView onNavigate={(tabId) => setActiveTab(tabId)} />
        )}

        {activeTab === 'analyse' && <AnalyseStatementView />}

        {activeTab === 'triage' && <SifPrecursorTriageView />}

        {activeTab === 'risk-dashboard' && <RiskDashboardView />}

        {activeTab === 'patterns' && <PrecursorPatternsView />}

        {activeTab === 'sites' && <SitesActivitiesView />}

        {activeTab === 'rules' && <LifeSavingRulesView />}

        {activeTab === 'reports' && <ReportsView />}

        {activeTab === 'system' && <SystemView />}

        {activeTab !== 'home' &&
          activeTab !== 'analyse' &&
          activeTab !== 'triage' &&
          activeTab !== 'risk-dashboard' &&
          activeTab !== 'patterns' &&
          activeTab !== 'sites' &&
          activeTab !== 'rules' &&
          activeTab !== 'reports' &&
          activeTab !== 'system' && (
            <PlaceholderView title={getPageTitle(activeTab)} />
          )}
      </div>
    </div>
  );
}