import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Loader2, 
  ArrowRight,
  Info
} from 'lucide-react';

export default function AnalyseStatementView() {
  const [statement, setStatement] = useState('');
  const [site, setSite] = useState('');
  const [activity, setActivity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Example prompts with pre-filled metadata
  const examplePrompts = [
    {
      text: 'Crane lifting 2 ton pipe over workers, sling was frayed and tag lines were missing.',
      site: 'Duliajan Yard',
      activity: 'Lifting Operations'
    },
    {
      text: 'Monkey board se tool box neeche gira, barricading nahi tha aur derrick man bina harness ke tha.',
      site: 'Rig #07 Digboi',
      activity: 'Drilling / Derrick Work'
    },
    {
      text: 'Hot work near wellhead without gas test certificate or fire watch present.',
      site: 'Wellhead #14 Naharkatiya',
      activity: 'Welding & Cutting'
    },
    {
      text: 'AC ka remote kharab ho gaya canteen me, repair required.',
      site: 'Central Canteen',
      activity: 'Facility Management'
    },
  ];

  // Logic to simulate local NLP / rule evaluation
  const runSafetyClassifier = (text, siteName, activityName) => {
    const lower = text.toLowerCase();

    // SIF-Precursor hazard indicators
    const isLifting = lower.includes('crane') || lower.includes('lift') || lower.includes('sling');
    const isHeight = lower.includes('monkey board') || lower.includes('gira') || lower.includes('derrick') || lower.includes('fall') || lower.includes('harness');
    const isGasOrFire = lower.includes('gas') || lower.includes('hot work') || lower.includes('fire') || lower.includes('wellhead');
    const isEnergy = lower.includes('isolation') || lower.includes('electric') || lower.includes('loto') || lower.includes('pressure');

    const isHighRisk = isLifting || isHeight || isGasOrFire || isEnergy;

    if (!isHighRisk) {
      return {
        verdict: 'Non-SIF Hazard / Routine Observation',
        isPsif: false,
        severity: 'Low',
        confidence: '91.4%',
        ruleViolated: 'None (General Maintenance / Housekeeping)',
        evidence: [
          'No immediate threat to life or limb identified',
          'Absence of high-energy release or severe fall hazards'
        ],
        action: 'Route to facility manager / maintenance desk. No emergency intervention required.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    let rule = 'IOGP LSR - General Safety';
    const evidence = [];

    if (isHeight) {
      rule = 'Work at Height / Dropped Objects Prevention';
      evidence.push('Unsecured load/tools dropped from height without safety tethering');
      evidence.push('Inadequate exclusion zone / absence of barricading');
    } else if (isLifting) {
      rule = 'Safe Mechanical Lifting Operations';
      evidence.push('Suspension of heavy load directly over personnel');
      evidence.push('Compromised rigging hardware and absence of tagline control');
    } else if (isGasOrFire) {
      rule = 'Hot Work & Explosive Atmosphere Verification';
      evidence.push('Potential hydrocarbon release zone without atmospheric monitoring');
      evidence.push('Failure to establish formal hot-work permit controls');
    }

    return {
      verdict: 'Potential SIF (P-SIF) Precursor Detected',
      isPsif: true,
      severity: 'Critical / High-Risk',
      confidence: '95.8%',
      ruleViolated: rule,
      evidence,
      action: 'Immediate work stop notice recommended. Mobilize field HSSE officer for perimeter enforcement and barrier verification.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleAnalyse = async () => {
    if (!statement.trim() || loading) return;

    setLoading(true);
    setResult(null);

    // Simulated inference delay (~700ms)
    setTimeout(() => {
      const evaluation = runSafetyClassifier(statement, site, activity);
      setResult(evaluation);
      setLoading(false);
    }, 700);
  };

  // Keyboard shortcut listener: Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleAnalyse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [statement, site, activity, loading]);

  return (
    <main className="flex-1 p-3 sm:p-4 md:p-5 space-y-4">
      {/* Header section split into distinct, low-padding containers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Container 1: Text & Information */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-bold text-[#00695c] border border-teal-100">
            <Zap size={14} />
            <span>AI Safety Precursor Engine</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-[#0e1d2c] tracking-tight leading-tight">
            Analyse a Statement
          </h1>
          
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Paste an observation or near-miss report in English, Hindi, or Hinglish. 
            The local SIF-detection model will automatically extract causal factors, map to IOGP Life-Saving Rules, and evaluate high-energy precursors.
          </p>
        </div>

        {/* Container 2: Larger Image Container */}
        <div className="lg:col-span-6 xl:col-span-5 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-center">
          <div className="w-full h-full min-h-[260px] relative overflow-hidden rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center group">
            <img
              src="/analyse.jpg"
              alt="Safety Precursor Process Diagram"
              className="w-full h-auto max-h-72 sm:max-h-80 md:max-h-96 object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                e.currentTarget.src = '/analyse.jpg';
              }}
            />
          </div>
        </div>

      </div>

      {/* Input Form Card */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <textarea
          rows={4}
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="e.g. Monkey board se tool box neeche gira, barricading nahi tha..."
          className="w-full resize-none rounded-xl border border-gray-200 p-3.5 text-sm text-gray-800 placeholder-gray-400 focus:border-teal-600 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
        />

        {/* Inputs & Examples */}
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            placeholder="Site (optional)"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 placeholder-gray-400 focus:border-teal-600 focus:outline-hidden sm:w-44"
          />

          <input
            type="text"
            placeholder="Activity (optional)"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 placeholder-gray-400 focus:border-teal-600 focus:outline-hidden sm:w-44"
          />

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-gray-400">Try:</span>
            {examplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setStatement(p.text);
                  setSite(p.site);
                  setActivity(p.activity);
                }}
                className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-[#00695c] hover:bg-teal-100 transition-colors cursor-pointer"
              >
                {p.text.slice(0, 32)}...
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={!statement.trim() || loading}
            onClick={handleAnalyse}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all ${
              !statement.trim() || loading
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-[#004e47] hover:bg-[#08423d] active:scale-98 cursor-pointer'
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Analysing NLP Model...</span>
              </>
            ) : (
              <>
                <Zap size={14} />
                <span>Analyse</span>
                <kbd className="ml-1 rounded bg-white/20 px-1 py-0.5 text-[10px] font-normal tracking-wide text-white">
                  Ctrl+↵
                </kbd>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Model Analysis Output Card */}
      {result && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-2">
            <div className="flex items-center gap-2">
              {result.isPsif ? (
                <ShieldAlert className="text-red-500" size={22} />
              ) : (
                <CheckCircle2 className="text-emerald-500" size={22} />
              )}
              <h2 className="text-base font-bold text-gray-900">
                Classification Verdict
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Evaluated at {result.timestamp}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  result.isPsif
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {result.verdict}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1: Core Metrics */}
            <div className="space-y-3 border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-4">
              <div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Severity Level
                </span>
                <p className={`mt-0.5 text-sm font-bold ${result.isPsif ? 'text-red-600' : 'text-gray-700'}`}>
                  {result.severity}
                </p>
              </div>

              <div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Confidence Score
                </span>
                <p className="mt-0.5 text-sm font-bold text-gray-800">
                  {result.confidence}
                </p>
              </div>

              <div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Life-Saving Rule Mapping
                </span>
                <p className="mt-0.5 text-xs font-semibold text-teal-800 bg-teal-50 rounded-md p-2">
                  {result.ruleViolated}
                </p>
              </div>
            </div>

            {/* Column 2: Key Evidence Extracted */}
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-4">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={13} />
                Identified Hazards & Causal Factors
              </span>
              <ul className="mt-2 space-y-1.5">
                {result.evidence.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Recommended Corrective Action */}
            <div className="space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Info size={13} />
                  Operational Recommendation
                </span>
                <p className="mt-2 text-xs text-gray-700 leading-relaxed bg-gray-50 border border-gray-100 p-3 rounded-lg">
                  {result.action}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Record logged for Site: ${site || 'Not Specified'}`)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00695c] hover:underline cursor-pointer"
                >
                  <span>Log incident into Precursor Triage</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}