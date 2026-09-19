import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  RefreshCw, 
  ChevronDown, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Activity,
  SlidersHorizontal
} from 'lucide-react';

export default function Topbar({ onOpenSidebar, pageTitle = 'Home' }) {
  // Functional Dropdown States
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 days');
  const [selectedSite, setSelectedSite] = useState('All Sites');

  // Interactive Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('Updated 2 min ago');

  // Tooltip State for Operational Status
  const [showStatusModal, setShowStatusModal] = useState(false);

  const dateRef = useRef(null);
  const siteRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDateDropdownOpen(false);
      }
      if (siteRef.current && !siteRef.current.contains(e.target)) {
        setSiteDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Sync Action Handler
  const handleManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setLastSyncText('Syncing telemetry...');
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncText('Updated just now');
    }, 1200);
  };

  const dateOptions = [
    'Today',
    'This week',
    'Last 30 days',
    'Last 90 days',
    'Quarter to date',
    'Year to date'
  ];

  const siteOptions = [
    'All Sites',
    'Duliajan',
    'Digboi',
    'Naharkatiya',
    'Moran',
    'Baghjan',
    'Rajasthan (Jodhpur)',
    'KG Basin'
  ];

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] transition-all">
      {/* Left: Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onOpenSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <span className="font-bold tracking-tight text-teal-900/80 uppercase text-[11px] bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
            OIL HSSE
          </span>
          <span className="text-slate-300 font-light select-none">/</span>
          <span className="font-semibold text-slate-800 tracking-tight text-[13px] capitalize">
            {pageTitle}
          </span>
        </nav>
      </div>

      {/* Right: Live Telemetry, Sync & Functional Controls */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
        {/* Sync Trigger Button */}
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="group flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 text-slate-500 hover:border-slate-200 hover:bg-slate-50/80 hover:text-slate-800 active:scale-95 transition cursor-pointer"
          title="Click to fetch live updates"
        >
          <RefreshCw
            size={13}
            className={`text-slate-400 group-hover:text-teal-700 transition ${
              isSyncing ? 'animate-spin text-teal-600' : ''
            }`}
          />
          <span className="font-medium text-[11px] select-none">
            {lastSyncText}
          </span>
        </button>

        {/* Live Status Pill with Hover Details */}
        <div className="relative">
          <button
            onMouseEnter={() => setShowStatusModal(true)}
            onMouseLeave={() => setShowStatusModal(false)}
            onClick={() => setShowStatusModal(!showStatusModal)}
            className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-medium text-emerald-800 shadow-xs hover:bg-emerald-100/70 transition cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            </span>
            <span className="font-semibold">All systems operational</span>
          </button>

          {/* Telemetry Status Popover */}
          {showStatusModal && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-[11px] font-bold text-slate-800">
                <Activity size={14} className="text-emerald-600" />
                <span>Node Telemetry Status</span>
              </div>
              <div className="mt-2 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">NLP Engine:</span>
                  <span className="font-semibold text-emerald-700">Healthy (28ms)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database:</span>
                  <span className="font-semibold text-emerald-700">Replicated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Edge Sync:</span>
                  <span className="font-semibold text-emerald-700">Live</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Functional Date Range Dropdown */}
        <div className="relative" ref={dateRef}>
          <button
            type="button"
            onClick={() => {
              setDateDropdownOpen(!dateDropdownOpen);
              setSiteDropdownOpen(false);
            }}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold tracking-tight transition cursor-pointer shadow-xs ${
              dateDropdownOpen
                ? 'border-teal-600 bg-teal-50/40 text-teal-900 ring-2 ring-teal-600/10'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Calendar size={13} className="text-slate-400" />
            <span>{selectedDateRange}</span>
            <ChevronDown
              size={13}
              className={`text-slate-400 transition-transform duration-200 ${
                dateDropdownOpen ? 'rotate-180 text-teal-700' : ''
              }`}
            />
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Filter Duration
              </div>
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedDateRange(opt);
                    setDateDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer ${
                    selectedDateRange === opt
                      ? 'bg-teal-50 text-teal-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedDateRange === opt && (
                    <CheckCircle2 size={13} className="text-teal-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Functional Site Selection Dropdown */}
        <div className="relative" ref={siteRef}>
          <button
            type="button"
            onClick={() => {
              setSiteDropdownOpen(!siteDropdownOpen);
              setDateDropdownOpen(false);
            }}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold tracking-tight transition cursor-pointer shadow-xs ${
              siteDropdownOpen
                ? 'border-teal-600 bg-teal-50/40 text-teal-900 ring-2 ring-teal-600/10'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <MapPin size={13} className="text-slate-400" />
            <span>{selectedSite}</span>
            <ChevronDown
              size={13}
              className={`text-slate-400 transition-transform duration-200 ${
                siteDropdownOpen ? 'rotate-180 text-teal-700' : ''
              }`}
            />
          </button>

          {siteDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-60 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Operational Site
              </div>
              {siteOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedSite(opt);
                    setSiteDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer ${
                    selectedSite === opt
                      ? 'bg-teal-50 text-teal-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {selectedSite === opt && (
                    <CheckCircle2 size={13} className="text-teal-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}