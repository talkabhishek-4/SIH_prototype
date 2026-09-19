import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  RefreshCw,
  Eye,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function PrecursorPatterns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');

  const stats = [
    { title: 'Detected Clusters', value: '14 Active', trend: '+2 this week', icon: Network, color: 'text-teal-400' },
    { title: 'High-Risk Patterns', value: '05 Critical', trend: 'Requires Review', icon: AlertTriangle, color: 'text-rose-400' },
    { title: 'Pattern Confidence', value: '94.2%', trend: 'NLP Model v3.2', icon: Sparkles, color: 'text-emerald-400' },
    { title: 'Correlated Incidents', value: '128 Total', trend: 'Across 6 sites', icon: Layers, color: 'text-amber-400' },
  ];

  const patterns = [
    {
      id: 'PAT-8091',
      title: 'Pressurized System Venting Sequence Failure',
      category: 'Process Safety',
      riskLevel: 'High',
      confidence: '96%',
      occurrences: 18,
      leadIndicator: 'Incomplete line depressurization prior to flange breakdown',
      impactArea: 'Assam Oil Fields · Digboi',
      status: 'Active Monitoring',
    },
    {
      id: 'PAT-7042',
      title: 'Scaffold Lock Mechanism Fatigue under Vibrational Load',
      category: 'Working at Height',
      riskLevel: 'Critical',
      confidence: '91%',
      occurrences: 24,
      leadIndicator: 'Overtightened clamp bolts + high rig vibration',
      impactArea: 'Duliajan Drilling Complex',
      status: 'Action Required',
    },
    {
      id: 'PAT-6511',
      title: 'Gas Detector Sensor Drift in Enclosed Pump Rooms',
      category: 'Hazardous Atmosphere',
      riskLevel: 'High',
      confidence: '89%',
      occurrences: 12,
      leadIndicator: 'Calibration interval delays > 45 days',
      impactArea: 'Moran Station',
      status: 'Active Monitoring',
    },
    {
      id: 'PAT-5203',
      title: 'LOTO Bypass During Emergency Valve Clears',
      category: 'Electrical & Isolation',
      riskLevel: 'Medium',
      confidence: '85%',
      occurrences: 9,
      leadIndicator: 'Shift handover miscommunication on active permits',
      impactArea: 'Jorhat Installation',
      status: 'Under Review',
    },
  ];

  const filteredPatterns = patterns.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.impactArea.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRisk === 'all' || p.riskLevel.toLowerCase() === selectedRisk.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="p-6 space-y-6 bg-[#f3f6f9] min-h-screen text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Network className="text-[#013531]" size={26} />
            Precursor Patterns & Clusters
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            AI-driven cluster identification and leading indicators derived from field observations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer">
            <RefreshCw size={14} className="text-slate-500" />
            Re-cluster Data
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#013531] text-white text-xs font-semibold hover:bg-[#002724] shadow-xs cursor-pointer">
            <ShieldAlert size={14} />
            Export Risk Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{stat.trend}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#013531] text-white">
                <Icon size={20} className={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pattern, ID, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#013531]/20 focus:border-[#013531]"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Filter size={14} />
            <span>Risk Level:</span>
          </div>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:border-[#013531] cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Pattern Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatterns.map((pattern) => (
          <div 
            key={pattern.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-[#013531]/40 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                  {pattern.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  pattern.riskLevel === 'Critical' 
                    ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                    : pattern.riskLevel === 'High'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {pattern.riskLevel} Risk
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                {pattern.title}
              </h3>

              <div className="mt-3 space-y-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700">Leading Indicator:</span>
                  <p className="text-slate-600 mt-0.5">{pattern.leadIndicator}</p>
                </div>
                <div className="flex items-center justify-between text-slate-500 pt-1">
                  <span>Site / Unit: <strong className="text-slate-700">{pattern.impactArea}</strong></span>
                  <span>Category: <strong className="text-slate-700">{pattern.category}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-slate-500">
                <span>Occurrences: <strong className="text-slate-900">{pattern.occurrences}</strong></span>
                <span>Confidence: <strong className="text-teal-700">{pattern.confidence}</strong></span>
              </div>
              <button className="flex items-center gap-1 font-semibold text-[#013531] hover:underline cursor-pointer">
                <span>Analyze Cluster</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}