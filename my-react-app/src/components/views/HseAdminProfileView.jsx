import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Building2,
  Lock,
  Key,
  Award,
  Bell,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  Clock,
  Shield,
  Edit3,
  ExternalLink,
  Download
} from 'lucide-react';

export default function HseAdminProfileView() {
  const [toastMessage, setToastMessage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Mock Profile Data
  const profile = {
    name: 'Abhi Jais',
    role: 'Lead HSE Administrator & System Admin',
    employeeId: 'OIL-HSE-2026-08',
    department: 'Health, Safety, Security & Environment (HSSE)',
    organization: 'Oil India Limited (OIL)',
    location: 'Duliajan Corporate Hub, Assam',
    email: 'abhi@oil.gov.in',
    phone: '+91 98765 43210',
    clearanceLevel: 'Level 4 (Full Systems & Safety Override)',
    activeDutyStatus: 'On Duty / Incident Control Coordinator',
    certifications: [
      { name: 'NEBOSH International General Certificate in Occupational Health', validUntil: 'Dec 2028' },
      { name: 'ISO 45001:2018 Lead Auditor (OH&S Management)', validUntil: 'Aug 2027' },
      { name: 'Hazard Identification & Risk Assessment (HIRA) Specialist', validUntil: 'Permanent' },
    ]
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800 relative font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>OIL HSSE</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">HSE Administration Profile</span>
        </div>
        <button
          onClick={() => showToast('Profile details exported as PDF.')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all cursor-pointer shadow-2xs"
        >
          <Download size={13} className="text-slate-500" />
          <span>Export Credentials</span>
        </button>
      </div>

      {/* Profile Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#012d29] via-[#013531] to-[#044a44] p-6 text-white shadow-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar / Profile Badge */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-2xl font-black text-white shadow-inner backdrop-blur-md">
                AJ
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-[#012d29] rounded-full flex items-center justify-center title='Active Status'">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>{profile.clearanceLevel}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{profile.name}</h1>
              <p className="text-xs text-emerald-100/80 font-medium">{profile.role}</p>
              <p className="text-[11px] text-emerald-200/60 font-mono">{profile.employeeId} • {profile.location}</p>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0">
            <button
              onClick={() => showToast('Editing profile credentials...')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs backdrop-blur-md active:scale-95 transition-all cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Edit Profile</span>
            </button>
            <span className="text-[11px] text-emerald-200/70 font-mono">
              Status: <strong className="text-emerald-300 font-semibold">{profile.activeDutyStatus}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal & Organization Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Official Administrative Details */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Building2 size={16} className="text-[#013531]" />
              <span>Administrative & Operational Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Department</span>
                <span className="font-semibold text-slate-800">{profile.department}</span>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Organization</span>
                <span className="font-semibold text-slate-800">{profile.organization}</span>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Work Email</span>
                <div className="flex items-center gap-2 font-mono text-slate-800 font-semibold">
                  <Mail size={13} className="text-slate-400" />
                  <span>{profile.email}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Emergency Hot-line</span>
                <div className="flex items-center gap-2 font-mono text-slate-800 font-semibold">
                  <Phone size={13} className="text-slate-400" />
                  <span>{profile.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* HSE Certifications & Compliance */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Award size={16} className="text-[#013531]" />
              <span>HSE Certifications & Compliance Credentials</span>
            </h2>

            <div className="space-y-2.5">
              {profile.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100/60 hover:translate-x-0.5 transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <FileCheck size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{cert.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Validity: {cert.validUntil}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/80">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security & Preferences */}
        <div className="space-y-6">
          {/* System Security & Access Controls */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Lock size={16} className="text-[#013531]" />
              <span>Security & Privileges</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-800">Two-Factor Auth (2FA)</div>
                  <div className="text-[10px] text-slate-400">Enforced for Admin Override</div>
                </div>
                <button
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showToast(`2FA ${!twoFactorEnabled ? 'Enabled' : 'Disabled'}`);
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    twoFactorEnabled ? 'bg-[#013531]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.75 ml-0.75 ${
                      twoFactorEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-800">Emergency Dispatches</div>
                  <div className="text-[10px] text-slate-400">Push SMS & In-App Alerts</div>
                </div>
                <button
                  onClick={() => {
                    setNotificationsEnabled(!notificationsEnabled);
                    showToast(`Alerts ${!notificationsEnabled ? 'Enabled' : 'Disabled'}`);
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    notificationsEnabled ? 'bg-[#013531]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.75 ml-0.75 ${
                      notificationsEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={() => showToast('Password reset link dispatched to your work email.')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer text-center block"
              >
                Change Admin Password
              </button>
            </div>
          </div>

          {/* Quick HSE Action Panel */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Shield size={16} className="text-[#013531]" />
              <span>Admin Incident Actions</span>
            </h2>

            <button
              onClick={() => showToast('Initiated SIF High-Priority Safety Broadcast!')}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-semibold text-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-rose-600 group-hover:scale-110 transition-transform" />
                <span>Broadcast SIF Alert</span>
              </div>
              <ExternalLink size={13} className="text-rose-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}