import React, { useState } from 'react';
import { RefreshCw, ChevronDown, MapPin, Activity, ShieldAlert, Image as ImageIcon } from 'lucide-react';

export default function SitesActivitiesView() {
  const [selectedSite, setSelectedSite] = useState('Duliajan');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 30 days');
  const [activeSiteFilter, setActiveSiteFilter] = useState('All Sites');

  // Interactive node data for the dark spatial risk map
  const [activeZoneNode, setActiveZoneNode] = useState(null);

  const zones = [
    { id: 'compressor', name: 'Compressor Area', count: 6, level: 'HIGH', badgeBg: 'bg-red-100 text-red-600 border-red-200', nodeColor: 'bg-red-500 text-white ring-4 ring-red-500/30', x: '58%', y: '18%' },
    { id: 'wellhead', name: 'Wellhead', count: 4, level: 'HIGH', badgeBg: 'bg-red-100 text-red-600 border-red-200', nodeColor: 'bg-red-500 text-white ring-4 ring-red-500/30', x: '78%', y: '35%' },
    { id: 'processing', name: 'Processing Unit', count: 3, level: 'REVIEW', badgeBg: 'bg-amber-100 text-amber-600 border-amber-200', nodeColor: 'bg-amber-400 text-slate-900 ring-4 ring-amber-400/30', x: '68%', y: '73%' },
    { id: 'workshop', name: 'Workshop', count: 1, level: 'ROUTINE', badgeBg: 'bg-emerald-100 text-emerald-600 border-emerald-200', nodeColor: 'bg-emerald-500 text-white ring-4 ring-emerald-500/30', x: '53%', y: '73%' },
    { id: 'storage', name: 'Storage Area', count: 1, level: 'ROUTINE', badgeBg: 'bg-emerald-100 text-emerald-600 border-emerald-200', nodeColor: 'bg-emerald-500 text-white ring-4 ring-emerald-500/30', x: '81%', y: '81%' },
  ];

  const siteKPIs = [
    { label: 'Total observations', value: 184 },
    { label: 'SIF-potential', value: 52 },
    { label: 'Near misses', value: 31 },
    { label: 'Critical barriers failed', value: 8 },
    { label: 'Open actions', value: 14 },
  ];

  return (
    <div className="p-6 space-y-5 bg-[#f3f6f9] min-h-screen text-[#1c2a38]">
      
      {/* 1. TOP BANNER IMAGE (Placed before the original Top Controls Bar) */}
      <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden shadow-xs border border-slate-200">
        <img 
          src="/1.jpg" 
          alt="Site Operations Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#012f2b]/90 via-[#012f2b]/40 to-transparent p-6 flex flex-col justify-end">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300 border border-teal-500/30 backdrop-blur-xs w-fit mb-1">
            <MapPin size={13} />
            <span>Active Industrial Field Ops</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {selectedSite} Onshore Field Surveillance
          </h2>
          <p className="text-xs text-teal-100/80 max-w-xl">
            Real-time environmental monitoring, hazard tracking, and live telemetry feed.
          </p>
        </div>
      </div>

      {/* 2. ORIGINAL TOP CONTROLS BAR (Unchanged) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Site Intelligence</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial precursor concentration and site risk analytics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 mr-2">
            <RefreshCw size={13} className="text-slate-400" />
            <span>Updated 2 min ago</span>
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 ml-1"></span>
            <span className="text-slate-600 font-medium">All systems operational</span>
          </div>

          {/* Time Range Dropdown */}
          <div className="relative">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-7 font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:outline-none cursor-pointer"
            >
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* All Sites Filter Dropdown */}
          <div className="relative">
            <select
              value={activeSiteFilter}
              onChange={(e) => setActiveSiteFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-7 font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:outline-none cursor-pointer"
            >
              <option>All Sites</option>
              <option>Duliajan Field</option>
              <option>Digboi Refinery</option>
              <option>Moran Station</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Active Primary Site Button */}
          <div className="relative">
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="appearance-none bg-[#013531] text-white font-semibold rounded-lg px-3.5 py-1.5 pr-8 shadow-xs hover:bg-[#002724] focus:outline-none cursor-pointer"
            >
              <option value="Duliajan">Site: Duliajan</option>
              <option value="Digboi">Site: Digboi</option>
              <option value="Moran">Site: Moran</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-200 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION (Image Card Beside Risk Score Card, followed by KPIs & Zone Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Side: Image + Risk Score + KPIs + Zone Breakdown */}
        <div className="lg:col-span-12 space-y-4">
          
          {/* IMAGE BESIDE RISK SCORE ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Image Card (/img2.jpg) */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon size={13} />
                  Site Surveillance — {selectedSite}
                </span>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
                  Live Feed
                </span>
              </div>
              
              <div className="relative h-44 rounded-lg overflow-hidden border border-slate-100 group">
                <img 
                  src="/img2.jpg" 
                  alt="Site Activity Surveillance" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                      HIGH RISK ZONE
                    </span>
                  </div>
                  <div className="text-white space-y-0.5">
                    <p className="text-xs font-bold leading-snug">{selectedSite} Processing Sector</p>
                    <p className="text-[10px] text-slate-300">Continuous hazard precursor monitoring active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* UNCHANGED SITE RISK SCORE CARD */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  SITE RISK SCORE
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-red-600 tracking-tight">78</span>
                  <span className="text-sm font-semibold text-slate-400">/ 100</span>
                  <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-red-600">
                    <span className="h-2 w-2 rounded-full bg-red-600"></span> Elevated
                  </span>
                </div>
              </div>

              <div>
                {/* Progress Bar */}
                <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[78%] bg-gradient-to-r from-amber-500 to-red-600 rounded-full"></div>
                </div>
              </div>
            </div>

          </div>

          {/* SITE KPIS & ZONE BREAKDOWN (Side-by-Side Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Site KPIs Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                SITE KPIS
              </p>
              <div className="space-y-3.5 text-xs">
                {siteKPIs.map((kpi, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-1 border-b border-slate-50 last:border-0 last:pb-0">
                    <span className="text-slate-600 font-medium">{kpi.label}</span>
                    <span className="font-bold text-slate-900 text-sm">{kpi.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone Breakdown Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                ZONE BREAKDOWN
              </p>
              <div className="space-y-2.5">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    onClick={() => setActiveZoneNode(zone.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                      activeZoneNode === zone.id
                        ? 'bg-slate-50 border-[#013531] shadow-2xs'
                        : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-semibold text-slate-800">{zone.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{zone.count} SIF</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${zone.badgeBg}`}>
                        {zone.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 4. MAP GRAPH SECTION (Placed at the very bottom across full width) */}
      <div className="bg-[#031c19] border border-[#0d3b36] rounded-xl overflow-hidden shadow-md flex flex-col h-[550px] relative mt-6">
        {/* Map Top Header */}
        <div className="p-4 border-b border-[#0d3b36] flex flex-wrap items-center justify-between gap-3 bg-[#012622]/80 backdrop-blur-md">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Site Risk Map — {selectedSite} Field
            </h2>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-300">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block"></span> HIGH
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block"></span> REVIEW
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span> ROUTINE
            </span>
            <span className="text-slate-400 font-normal ml-1">
              · Number = SIF-potential count
            </span>
          </div>
        </div>

        {/* Interactive Map Visual Grid */}
        <div className="relative flex-1 bg-[#021816] bg-[radial-gradient(#083832_1px,transparent_1px)] [background-size:24px_24px] overflow-hidden">
          {/* Live Indicator Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-[#002f2b]/90 border border-[#0a524a] text-[11px] font-medium text-emerald-400 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE · {selectedSite} Field
          </div>

          {/* Connecting Dashed Dotted Flow Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-500/40" strokeDasharray="6,6" strokeWidth="2">
            <line x1="58%" y1="22%" x2="78%" y2="38%" />
            <line x1="78%" y1="38%" x2="68%" y2="72%" />
            <line x1="68%" y1="72%" x2="53%" y2="72%" />
          </svg>

          {/* Zone Map Labels & Interactive Nodes */}
          {/* 1. Compressor Area */}
          <div
            className={`absolute top-[18%] left-[58%] -translate-x-1/2 p-3 rounded-xl border border-[#0f544c] bg-[#002e29]/80 backdrop-blur-xs flex items-center gap-3 cursor-pointer transition hover:scale-105 ${
              activeZoneNode === 'compressor' ? 'ring-2 ring-red-500' : ''
            }`}
            onClick={() => setActiveZoneNode('compressor')}
          >
            <span className="text-xs font-bold text-teal-200 tracking-wider">Compressor</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-4 ring-red-500/30">
              6
            </span>
          </div>

          {/* 2. Wellhead */}
          <div
            className={`absolute top-[35%] left-[78%] -translate-x-1/2 p-3 rounded-xl border border-[#0f544c] bg-[#002e29]/80 backdrop-blur-xs flex items-center gap-3 cursor-pointer transition hover:scale-105 ${
              activeZoneNode === 'wellhead' ? 'ring-2 ring-red-500' : ''
            }`}
            onClick={() => setActiveZoneNode('wellhead')}
          >
            <span className="text-xs font-bold text-teal-200 tracking-wider">Wellhead</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-4 ring-red-500/30">
              4
            </span>
          </div>

          {/* 3. Processing Unit */}
          <div
            className={`absolute top-[73%] left-[68%] -translate-x-1/2 p-3.5 rounded-xl border border-[#0f544c] bg-[#002e29]/80 backdrop-blur-xs flex items-center gap-3 cursor-pointer transition hover:scale-105 ${
              activeZoneNode === 'processing' ? 'ring-2 ring-amber-400' : ''
            }`}
            onClick={() => setActiveZoneNode('processing')}
          >
            <span className="text-xs font-bold text-teal-200 tracking-wider">Processing</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900 ring-4 ring-amber-400/30">
              3
            </span>
          </div>

          {/* 4. Workshop */}
          <div
            className={`absolute top-[73%] left-[53%] -translate-x-1/2 p-3.5 rounded-xl border border-[#0f544c] bg-[#002e29]/80 backdrop-blur-xs flex items-center gap-3 cursor-pointer transition hover:scale-105 ${
              activeZoneNode === 'workshop' ? 'ring-2 ring-emerald-500' : ''
            }`}
            onClick={() => setActiveZoneNode('workshop')}
          >
            <span className="text-xs font-bold text-teal-200 tracking-wider">Workshop</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white ring-4 ring-emerald-500/30">
              1
            </span>
          </div>

          {/* 5. Storage Area */}
          <div
            className={`absolute top-[81%] left-[81%] -translate-x-1/2 p-3.5 rounded-xl border border-[#0f544c] bg-[#002e29]/80 backdrop-blur-xs flex items-center gap-3 cursor-pointer transition hover:scale-105 ${
              activeZoneNode === 'storage' ? 'ring-2 ring-emerald-500' : ''
            }`}
            onClick={() => setActiveZoneNode('storage')}
          >
            <span className="text-xs font-bold text-teal-200 tracking-wider">Storage</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white ring-4 ring-emerald-500/30">
              1
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}