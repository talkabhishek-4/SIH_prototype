import React from 'react';
import {
  Zap,
  ArrowRight,
  RefreshCw,
  Layers,
  BarChart3,
  Network,
  MapPin,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function HomeView({ onNavigate }) {
  const quickNavCards = [
    { id: 'triage', title: 'SIF-Precursor Triage', desc: 'Triage queue, heatmap, act-first alerts', icon: Layers },
    { id: 'risk-dashboard', title: 'Risk Dashboard', desc: 'Density, site rankings, trend charts', icon: BarChart3 },
    { id: 'patterns', title: 'Precursor Patterns', desc: 'Recurring failure modes across activities', icon: Network },
    { id: 'sites', title: 'Sites & Activities', desc: 'Spatial risk maps and zone breakdowns', icon: MapPin },
    { id: 'rules', title: 'Life-Saving Rules', desc: 'IOGP LSR compliance and SIF mapping', icon: ShieldCheck },
    { id: 'reports', title: 'Reports', desc: 'Searchable HSSE observation explorer', icon: FileText },
  ];

  return (
    <main className="flex-1 p-6 md:p-8 space-y-7">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-[26px] font-bold text-[#0e1d2c]">
          Good morning, HSE Administrator
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here is what is happening across your sites today.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="text-3xl font-bold text-[#dc2626]">9</div>
          <div className="mt-2 text-sm font-semibold text-gray-900">P-SIF this week</div>
          <div className="mt-0.5 text-xs text-gray-500">▲ 12% vs last week</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="text-3xl font-bold text-[#d97706]">23.6%</div>
          <div className="mt-2 text-sm font-semibold text-gray-900">SIF precursor density</div>
          <div className="mt-0.5 text-xs text-gray-500">Across all active sites</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="text-3xl font-bold text-[#0e7490]">14</div>
          <div className="mt-2 text-sm font-semibold text-gray-900">Sites affected</div>
          <div className="mt-0.5 text-xs text-gray-500">6 field sites monitored</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="text-3xl font-bold text-[#2563eb]">23</div>
          <div className="mt-2 text-sm font-semibold text-gray-900">Awaiting review</div>
          <div className="mt-0.5 text-xs text-gray-500">Oldest 3 days · est. 45 min</div>
        </div>
      </div>

      {/* Middle Section: Alerts & AI Model Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs your attention */}
        <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-gray-900">Needs your attention</h2>
            <p className="text-xs text-gray-400 mt-0.5">Top unreviewed high-risk P-SIF alerts</p>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#eb3d3d] shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                    Suspended load without banksman
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-400 font-mono">
                    OIL-2026-00482 · Duliajan · 2h ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#eb3d3d] shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                    Technician entered vessel before gas test
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-400 font-mono">
                    OIL-2026-00479 · Digboi · 4h ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#eb3d3d] shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                    Energy isolation not verified before maintenance
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-400 font-mono">
                    OIL-2026-00475 · Naharkatiya · 6h ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-2">
            <button
              onClick={() => onNavigate && onNavigate('triage')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00695c] hover:underline"
            >
              <span>View all in SIF-Precursor Triage</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* AI Model Status */}
        <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#00897b]" />
              <h2 className="text-base font-bold text-gray-900">AI Model Status</h2>
            </div>

            <div className="mt-5 divide-y divide-gray-100 text-sm">
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Status</span>
                <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Operational
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">NLP version</span>
                <span className="font-medium text-gray-700 font-mono text-xs">v3.2</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Last sync</span>
                <span className="font-medium text-gray-700">2 min ago</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Model accuracy</span>
                <span className="font-semibold text-emerald-600 font-mono">94.1%</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Pending ingestion</span>
                <span className="font-semibold text-[#d97706]">3 reports</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Rule engine</span>
                <span className="font-mono text-xs text-gray-600">policy_table_v4.yaml</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-2">
            <button
              onClick={() => onNavigate && onNavigate('admin')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00695c] hover:underline"
            >
              <span>Go to Administration</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-600">
          Quick Navigation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {quickNavCards.map((card) => {
            const CardIcon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate && onNavigate(card.id)}
                className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-xs transition hover:shadow-md hover:border-gray-200 cursor-pointer"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-[#00695c] mb-3">
                    <CardIcon size={18} />
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 leading-tight">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-gray-400 leading-snug">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-2 pt-2 text-xs text-gray-400">
        <RefreshCw size={13} />
        <span>Data last synced 2 min ago · All systems operational</span>
      </div>
    </main>
  );
}