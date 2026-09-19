import React, { useState, useEffect } from 'react';
import {
  Zap,
  ArrowRight,
  RefreshCw,
  Layers,
  BarChart3,
  Network,
  MapPin,
  ShieldCheck,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function HomeView({ onNavigate }) {
  // Quick Navigation cards
  const quickNavCards = [
    { id: 'triage', title: 'SIF-Precursor Triage', desc: 'Triage queue, heatmap, act-first alerts', icon: Layers },
    { id: 'risk-dashboard', title: 'Risk Dashboard', desc: 'Density, site rankings, trend charts', icon: BarChart3 },
    { id: 'patterns', title: 'Precursor Patterns', desc: 'Recurring failure modes across activities', icon: Network },
    { id: 'sites', title: 'Sites & Activities', desc: 'Spatial risk maps and zone breakdowns', icon: MapPin },
    { id: 'rules', title: 'Life-Saving Rules', desc: 'IOGP LSR compliance and SIF mapping', icon: ShieldCheck },
    { id: 'reports', title: 'Reports', desc: 'Searchable HSSE observation explorer', icon: FileText },
  ];

  // Carousel images configured with details matching uploaded HSE safety posters
  const carouselImages = [
    {
      src: '/slide1.jpg',
      alt: 'Health Safety Environment Gear',
      title: 'Health, Safety & Environment (HSE)',
      tag: 'Mandatory PPE',
      caption: 'Hard hat, industrial leather gloves, eye safety goggles, and ear muff protection.'
    },
    {
      src: '/slide2.jpg',
      alt: 'Workplace Safety Equipment Guide',
      title: 'Work Safety Equipment Standard',
      tag: 'PPE Matrix',
      caption: 'Full protection checklist: Hard hat, eye protection, face mask, reflective vest, gloves, and boots.'
    },
    {
      src: '/slide3.jpg',
      alt: 'Oil India Limited Safety Tag',
      title: 'Oil India Limited — Workplace Safety',
      tag: 'Corporate Policy',
      caption: '"Safety at Workplace: NO COMPROMISE" enforced across rigs and operating facilities.'
    },
    {
      src: '/slide4.jpg',
      alt: 'IndianOil Safety Commitment',
      title: 'Your Safety. Our Priority. — IndianOil',
      tag: 'IndianOil Campaign',
      caption: 'A daily commitment upholding hazard prevention, life-saving rules, and site safety.'
    },
    {
      src: '/slide5.jpg',
      alt: 'OIL Personal Protective Equipment Schedule',
      title: 'OIL Personal Protective Equipment Schedule',
      tag: 'Safety Department',
      caption: 'Issued by Safety and Environment Department, Duliajan, Assam.'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-switch image every 3 seconds (3000ms)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, carouselImages.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  // Helper function to calculate circular loop indices
  const getSlideIndex = (offset) => {
    const total = carouselImages.length;
    return (currentSlide + offset + total) % total;
  };

  const leftIndex = getSlideIndex(-1);
  const centerIndex = currentSlide;
  const rightIndex = getSlideIndex(1);

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#f3f6f9]">
      {/* 100% Full Width Hero Header */}
      <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden shadow-xs bg-[#013531]">
        <img
          src="/assets/home-banner.jpg"
          alt="OIL Operations Complex"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.src = '/home-banner.jpg';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#021c19]/90 via-[#013531]/60 to-transparent flex flex-col justify-end p-6 md:p-8">
          <div className="max-w-4xl space-y-1 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-medium text-emerald-300 border border-white/20 mb-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Assam Asset & Refinery Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-xs">
              Good morning, HSE Administrator
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-normal drop-shadow-xs">
              Here is what is happening across your active field sites and processing facilities today.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 md:p-8 space-y-7">
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
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00695c] hover:underline cursor-pointer"
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
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00695c] hover:underline cursor-pointer"
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

        {/* ============================================================== */}
        {/* SOFT COLOR CAROUSEL: 3s ROTATION, NO ZOOM / PROPER CONTAIN FIT */}
        {/* ============================================================== */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Safety Practices & Field Highlights
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Automated continuous rotation of safety standards (3s interval).
              </p>
            </div>
            {/* Live Indicator & Slide Counter */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                Live Feed
              </span>
              <span className="text-xs font-mono font-medium text-gray-600 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-2xs">
                {currentSlide + 1} / {carouselImages.length}
              </span>
            </div>
          </div>

          {/* Soft-toned Outer Container */}
          <div
            className="relative w-full overflow-hidden py-4 rounded-2xl bg-slate-200/50 border border-slate-200 shadow-xs group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* 3-Card Layout Container */}
            <div className="flex items-center justify-center gap-3 sm:gap-5 px-4 h-72 sm:h-80 md:h-96">
              
              {/* LEFT SLIDE (Soft background card, uncropped thumbnail, scaled down) */}
              <div
                onClick={prevSlide}
                className="hidden sm:flex relative w-1/4 h-[85%] rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs cursor-pointer transition-all duration-500 scale-90 opacity-60 hover:opacity-90 blur-[1px] hover:blur-none items-center justify-center p-3"
              >
                <img
                  src={carouselImages[leftIndex].src}
                  alt={carouselImages[leftIndex].alt}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = `/assets${carouselImages[leftIndex].src}`;
                  }}
                />
              </div>

              {/* CENTER ACTIVE SLIDE (Fully clear, proper aspect fit, clean white background) */}
              <div className="relative w-full sm:w-1/2 h-full rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-md transition-all duration-500 scale-100 z-10 flex flex-col justify-between">
                
                {/* Image Container with object-contain to prevent zoom/crop */}
                <div className="relative w-full h-full p-4 flex items-center justify-center bg-slate-50/50">
                  <img
                    key={centerIndex}
                    src={carouselImages[centerIndex].src}
                    alt={carouselImages[centerIndex].alt}
                    className="w-full h-full object-contain transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.src = `/assets${carouselImages[centerIndex].src}`;
                    }}
                  />
                </div>

                {/* Soft Bottom Caption Overlay */}
                <div className="w-full bg-slate-900/90 backdrop-blur-md p-4 text-white">
                  <div className="max-w-xl space-y-0.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-teal-600 text-white mb-1 shadow-2xs">
                      {carouselImages[centerIndex].tag}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold tracking-tight text-white leading-tight">
                      {carouselImages[centerIndex].title}
                    </h3>
                    <p className="text-xs text-slate-300 font-normal leading-snug line-clamp-2">
                      {carouselImages[centerIndex].caption}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SLIDE (Soft background card, uncropped thumbnail, scaled down) */}
              <div
                onClick={nextSlide}
                className="hidden sm:flex relative w-1/4 h-[85%] rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs cursor-pointer transition-all duration-500 scale-90 opacity-60 hover:opacity-90 blur-[1px] hover:blur-none items-center justify-center p-3"
              >
                <img
                  src={carouselImages[rightIndex].src}
                  alt={carouselImages[rightIndex].alt}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = `/assets${carouselImages[rightIndex].src}`;
                  }}
                />
              </div>

            </div>

            {/* Left Navigation Arrow */}
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 transition hover:scale-105 active:scale-95 cursor-pointer z-20"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right Navigation Arrow */}
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 transition hover:scale-105 active:scale-95 cursor-pointer z-20"
            >
              <ChevronRight size={20} />
            </button>

            {/* Bottom Dots Indicator */}
            <div className="flex items-center justify-center gap-1.5 pt-3 z-20">
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Jump to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx
                      ? 'w-6 bg-[#00695c] shadow-2xs'
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center gap-2 pt-2 text-xs text-gray-400">
          <RefreshCw size={13} />
          <span>Data last synced 2 min ago · All systems operational</span>
        </div>
      </div>
    </main>
  );
}