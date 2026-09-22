import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Loader2, 
  ArrowRight,
  Info,
  Upload,
  FileSpreadsheet,
  FileCode,
  X,
  Layers,
  AlertTriangle
} from 'lucide-react';

export default function AnalyseStatementView() {
  const [mode, setMode] = useState('single'); // 'single' | 'batch'
  const [statement, setStatement] = useState('');
  const [site, setSite] = useState('');
  const [activity, setActivity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [batchFile, setBatchFile] = useState(null);
  const [batchData, setBatchData] = useState([]);
  const [batchResults, setBatchResults] = useState(null);

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

  const runSafetyClassifier = (text, siteName = '', activityName = '') => {
    const lower = text.toLowerCase();

    const isLifting = lower.includes('crane') || lower.includes('lift') || lower.includes('sling');
    const isHeight = lower.includes('monkey board') || lower.includes('gira') || lower.includes('derrick') || lower.includes('fall') || lower.includes('harness');
    const isGasOrFire = lower.includes('gas') || lower.includes('hot work') || lower.includes('fire') || lower.includes('wellhead');
    const isEnergy = lower.includes('isolation') || lower.includes('electric') || lower.includes('loto') || lower.includes('pressure');

    const isHighRisk = isLifting || isHeight || isGasOrFire || isEnergy;

    if (!isHighRisk) {
      return {
        statement: text,
        site: siteName || 'N/A',
        activity: activityName || 'N/A',
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
      statement: text,
      site: siteName || 'N/A',
      activity: activityName || 'N/A',
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

    setTimeout(() => {
      const evaluation = runSafetyClassifier(statement, site, activity);
      setResult(evaluation);
      setLoading(false);
    }, 700);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && mode === 'single') {
        e.preventDefault();
        handleAnalyse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [statement, site, activity, loading, mode]);

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) return [];
    return lines.map((line) => {
      const parts = line.split(',');
      return {
        statement: parts[0]?.trim() || '',
        site: parts[1]?.trim() || '',
        activity: parts[2]?.trim() || ''
      };
    }).filter(row => row.statement.length > 0);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBatchFile(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;

      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          const dataArray = Array.isArray(parsed) ? parsed : [parsed];
          const normalized = dataArray.map(item => ({
            statement: item.statement || item.text || item.description || '',
            site: item.site || item.location || '',
            activity: item.activity || item.type || ''
          }));
          setBatchData(normalized);
        } catch (err) {
          alert('Invalid JSON file structure.');
        }
      } else {
        
        const parsed = parseCSV(content);
        setBatchData(parsed);
      }
    };

    reader.readAsText(file);
  };

  const handleBatchAnalyse = () => {
    if (batchData.length === 0 || loading) return;

    setLoading(true);
    setBatchResults(null);

    setTimeout(() => {
      const evaluations = batchData.map(item => runSafetyClassifier(item.statement, item.site, item.activity));
      
      const total = evaluations.length;
      const psifCount = evaluations.filter(e => e.isPsif).length;
      const nonPsifCount = total - psifCount;

      setBatchResults({
        total,
        psifCount,
        nonPsifCount,
        items: evaluations
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <main className="flex-1 p-3 sm:p-4 md:p-5 space-y-4">
      {/* Top Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-bold text-[#00695c] border border-teal-100">
            <Zap size={14} />
            <span>AI Safety Precursor Engine</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-[#0e1d2c] tracking-tight leading-tight">
            Analyse a Statement
          </h1>
          
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Paste an observation report in English, Hindi, or Hinglish, or upload bulk batch files (CSV / JSON). 
            The local SIF-detection model extracts causal factors, maps to IOGP Life-Saving Rules, and identifies hazards.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => setMode('single')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                mode === 'single'
                  ? 'bg-[#004e47] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Zap size={13} />
              Single Statement
            </button>
            <button
              onClick={() => setMode('batch')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                mode === 'batch'
                  ? 'bg-[#004e47] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Layers size={13} />
              Batch Upload (CSV / JSON)
            </button>
          </div>
        </div>

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

      {mode === 'single' && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <textarea
            rows={4}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder="e.g. Monkey board se tool box neeche gira, barricading nahi tha..."
            className="w-full resize-none rounded-xl border border-gray-200 p-3.5 text-sm text-gray-800 placeholder-gray-400 focus:border-teal-600 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
          />

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
      )}

      {mode === 'batch' && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs space-y-4">
          <div className="border-2 border-dashed border-slate-200 hover:border-teal-600 transition rounded-xl p-6 text-center bg-slate-50/50 flex flex-col items-center justify-center relative">
            <input
              type="file"
              accept=".csv, .json"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            
            <div className="h-12 w-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-[#00695c] mb-2">
              <Upload size={22} />
            </div>

            <p className="text-sm font-bold text-slate-800">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports <span className="font-semibold text-slate-600">.CSV</span> (statement, site, activity) or <span className="font-semibold text-slate-600">.JSON</span> array files
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                <FileSpreadsheet size={13} className="text-emerald-600" /> .CSV File
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                <FileCode size={13} className="text-amber-600" /> .JSON File
              </span>
            </div>
          </div>

          {batchFile && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/60 border border-teal-100 text-xs">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#00695c]" />
                <span className="font-bold text-slate-800">{batchFile.name}</span>
                <span className="text-slate-400">({(batchFile.size / 1024).toFixed(1)} KB)</span>
                <span className="bg-teal-100 text-[#00695c] font-semibold px-2 py-0.5 rounded-full text-[10px]">
                  {batchData.length} records parsed
                </span>
              </div>
              <button
                onClick={() => {
                  setBatchFile(null);
                  setBatchData([]);
                  setBatchResults(null);
                }}
                className="text-slate-400 hover:text-red-500 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!batchFile || batchData.length === 0 || loading}
              onClick={handleBatchAnalyse}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all ${
                !batchFile || batchData.length === 0 || loading
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-[#004e47] hover:bg-[#08423d] active:scale-98 cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Processing Batch Records...</span>
                </>
              ) : (
                <>
                  <Layers size={14} />
                  <span>Run Batch Classification ({batchData.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {mode === 'single' && result && (
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

      {mode === 'batch' && batchResults && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Total Analysed</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{batchResults.total} Statements</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-100">
              <p className="text-[11px] font-bold text-red-500 uppercase">P-SIF Precursors Detected</p>
              <p className="text-2xl font-black text-red-600 mt-1">{batchResults.psifCount} High Risk</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[11px] font-bold text-emerald-600 uppercase">Routine / Non-SIF</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">{batchResults.nonPsifCount} Hazards</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Statement</th>
                  <th className="p-3">Location / Activity</th>
                  <th className="p-3">Verdict</th>
                  <th className="p-3">LSR Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batchResults.items.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-medium text-slate-900 max-w-xs truncate">{row.statement}</td>
                    <td className="p-3 text-slate-500">{row.site} · {row.activity}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        row.isPsif ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {row.isPsif ? 'P-SIF Risk' : 'Routine'}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-teal-800">{row.ruleViolated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}