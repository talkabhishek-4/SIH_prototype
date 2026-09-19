import React from 'react';
import { Menu, RefreshCw, ChevronDown } from 'lucide-react';

export default function Topbar({ onOpenSidebar, pageTitle = 'Home' }) {
  return (
    <header className="flex flex-wrap items-center justify-between border-b border-gray-200/80 bg-white px-6 py-3.5 gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span className="font-semibold text-gray-700">OIL HSSE</span>
          <span>&gt;</span>
          <span className="font-semibold text-gray-900 capitalize">{pageTitle}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-gray-500">
          <RefreshCw size={13} className="text-gray-400" />
          <span>Updated 2 min ago</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>All systems operational</span>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 ml-2">
          <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-xs">
            <span>Last 30 days</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-xs">
            <span>All Sites</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}