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
  Database,
  Type
} from 'lucide-react';

export default function AnalyseStatementView() {

  const [analysisMode, setAnalysisMode] = useState('file'); // 'file' | 'text'

  const [statement, setStatement] = useState('');
  const [site, setSite] = useState('');
  const [activity, setActivity] = useState('');
  
  // File Upload States
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [fileError, setFileError] = useState('');

  // Processing & Results
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [batchResults, setBatchResults] = useState(null);

  // Example prompts for single statement
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

  // CSV Simple Parser
  const parseCSV = (csvText) => {
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Auto-detect columns
    const statementIndex = headers.findIndex(h => h.includes('statement') || h.includes('report') || h.includes('observation') || h.includes('description') || h.includes('text'));
    const siteIndex = headers.findIndex(h => h.includes('site') || h.includes('location') || h.includes('yard'));
    const activityIndex = headers.findIndex(h => h.includes('activity') || h.includes('operation') || h.includes('work'));

    const parsed = [];
    for (let i = 1; i < lines.length; i++) {
      // Basic CSV splitter respecting quotes
      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
      const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());

      const statementVal = statementIndex !== -1 ? cleanValues[statementIndex] : cleanValues[0];
      const siteVal = siteIndex !== -1 ? cleanValues[siteIndex] : (cleanValues[1] || '');
      const activityVal = activityIndex !== -1 ? cleanValues[activityIndex] : (cleanValues[2] || '');

      if (statementVal) {
        parsed.push({ text: statementVal, site: siteVal, activity: activityVal });
      }
    }
    return parsed;
  };

  // Handle File Selection
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileError('');
    setUploadedFile(file);
    setBatchResults(null);

    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          const formatted = Array.isArray(json) ? json.map(item => ({
            text: item.statement || item.text || item.observation || item.report || '',
            site: item.site || item.location || '',
            activity: item.activity || item.operation || ''
          })).filter(i => i.text) : [];
          
          if (formatted.length === 0) {
            setFileError('Invalid JSON format. Expected array of objects containing a "statement" or "text" key.');
          } else {
            setParsedData(formatted);
          }
        } catch (err) {
          setFileError('Failed to parse JSON file. Please check file syntax.');
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.csv')) {
      reader.onload = (event) => {
        try {
          const data = parseCSV(event.target.result);
          if (data.length === 0) {
            setFileError('Could not extract valid records from CSV.');
          } else {
            setParsedData(data);
          }
        } catch (err) {
          setFileError('Failed to parse CSV file.');
        }
      };
      reader.readAsText(file);
    } else {
      setFileError('Unsupported file format. Please upload a .csv or .json file.');
      setUploadedFile(null);
    }
  };

  // Trigger Analysis
  const handleAnalyse = async () => {
    if (loading) return;

    setLoading(true);

    if (analysisMode === 'text') {
      if (!statement.trim()) return;
      setResult(null);
      setTimeout(() => {
        const evaluation = runSafetyClassifier(statement, site, activity);
        setResult(evaluation);
        setLoading(false);
      }, 700);
    } else {
      if (parsedData.length === 0) return;
      setBatchResults(null);
      setTimeout(() => {
        const evaluations = parsedData.map(item => runSafetyClassifier(item.text, item.site, item.activity));
        const psifCount = evaluations.filter(e => e.isPsif).length;
        
        setBatchResults({
          total: evaluations.length,
          psifCount,
          nonPsifCount: evaluations.length - psifCount,
          evaluations
        });
        setLoading(false);
      }, 1000);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setParsedData([]);
    setFileError('');
    setBatchResults(null);
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
  }, [statement, site, activity, parsedData, analysisMode, loading]);

  return (
    <main className="flex-1 p-3 sm:p-4 md:p-5 space-y-4">
      {/* Header section split into distinct containers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Container 1: Text & Information */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-bold text-[#00695c] border border-teal-100">
            <Zap size={14} />
            <span>AI Safety Precursor Engine</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-[#0e1d2c] tracking-tight leading-tight">
            Analyse Safety Statements
          </h1>
          
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Batch-process structured bulk reports via CSV/JSON files or enter a single statement. 
            The local SIF-detection engine automatically identifies causal factors, maps violations to IOGP Life-Saving Rules, and tags high-risk precursors.
          </p>
        </div>

        {/* Container 2: Image Container */}
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

      {/* Input Selection Card (File Upload Default) */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Input Mode Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <button
            type="button"
            onClick={() => setAnalysisMode('file')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              analysisMode === 'file'
                ? 'bg-[#004e47] text-white shadow-2xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Upload size={14} />
            <span>Upload CSV / JSON (Default)</span>
          </button>

          <button
            type="button"
            onClick={() => setAnalysisMode('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              analysisMode === 'text'
                ? 'bg-[#004e47] text-white shadow-2xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Type size={14} />
            <span>Single Statement Entry</span>
          </button>
        </div>

        {/* TAB 1: FILE UPLOAD SECTION (DEFAULT) */}
        {analysisMode === 'file' && (
          <div className="space-y-4">
            {!uploadedFile ? (
              <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-teal-200 rounded-2xl cursor-pointer bg-teal-50/30 hover:bg-teal-50/60 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <div className="p-3 bg-teal-100 text-[#00695c] rounded-full mb-2">
                    <Upload size={22} />
                  </div>
                  <p className="mb-1 text-sm font-bold text-gray-800">
                    Click to upload or drag & drop file
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports <span className="font-semibold text-gray-700">.CSV</span> or <span className="font-semibold text-gray-700">.JSON</span> datasets containing field observation logs
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv, .json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-teal-50/50 border border-teal-200 rounded-xl gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-teal-600 text-white rounded-lg">
                    {uploadedFile.name.endsWith('.csv') ? <FileSpreadsheet size={20} /> : <FileCode size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{uploadedFile.name}</h4>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • {parsedData.length} observation records detected
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition cursor-pointer"
                >
                  <X size={14} />
                  <span>Remove File</span>
                </button>
              </div>
            )}

            {fileError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {fileError}
              </div>
            )}

            {/* Parsed Data Preview Table */}
            {parsedData.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Database size={13} />
                    File Preview ({parsedData.length} Records Loaded)
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 font-bold text-gray-600">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Statement / Observation</th>
                        <th className="p-2.5">Site</th>
                        <th className="p-2.5">Activity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {parsedData.slice(0, 5).map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/80">
                          <td className="p-2.5 font-bold text-gray-400">{i + 1}</td>
                          <td className="p-2.5 text-gray-800 font-medium truncate max-w-xs">{row.text}</td>
                          <td className="p-2.5 text-gray-600">{row.site || '—'}</td>
                          <td className="p-2.5 text-gray-600">{row.activity || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.length > 5 && (
                  <p className="text-[11px] text-gray-400 italic">
                    Showing first 5 rows out of {parsedData.length} records.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SINGLE STATEMENT TEXT ENTRY */}
        {analysisMode === 'text' && (
          <div className="space-y-3">
            <textarea
              rows={4}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="e.g. Monkey board se tool box neeche gira, barricading nahi tha..."
              className="w-full resize-none rounded-xl border border-gray-200 p-3.5 text-sm text-gray-800 placeholder-gray-400 focus:border-teal-600 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            />

            <div className="flex flex-wrap items-center gap-2.5">
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
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={
              loading || 
              (analysisMode === 'text' && !statement.trim()) || 
              (analysisMode === 'file' && parsedData.length === 0)
            }
            onClick={handleAnalyse}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all ${
              loading || 
              (analysisMode === 'text' && !statement.trim()) || 
              (analysisMode === 'file' && parsedData.length === 0)
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-[#004e47] hover:bg-[#08423d] active:scale-98 cursor-pointer'
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Analysing Dataset...</span>
              </>
            ) : (
              <>
                <Zap size={14} />
                <span>{analysisMode === 'file' ? `Analyse ${parsedData.length} Records` : 'Analyse Statement'}</span>
                <kbd className="ml-1 rounded bg-white/20 px-1 py-0.5 text-[10px] font-normal tracking-wide text-white">
                  Ctrl+↵
                </kbd>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RESULT 1: BATCH FILE ANALYSIS OUTPUT */}
      {batchResults && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <Zap className="text-[#00695c]" size={22} />
              <h2 className="text-base font-bold text-gray-900">
                Batch File Classification Summary
              </h2>
            </div>
            <span className="text-xs text-gray-400">Processed {batchResults.total} entries</span>
          </div>

          {/* Batch KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Records</span>
              <p className="text-xl font-black text-gray-800">{batchResults.total}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-xl border border-red-200">
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">P-SIF Precursors</span>
              <p className="text-xl font-black text-red-600">{batchResults.psifCount}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Routine / Non-SIF</span>
              <p className="text-xl font-black text-emerald-600">{batchResults.nonPsifCount}</p>
            </div>
          </div>

          {/* Batch Detailed Results Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 font-bold text-gray-700">
                <tr>
                  <th className="p-3">Verdict</th>
                  <th className="p-3">Statement</th>
                  <th className="p-3">Site</th>
                  <th className="p-3">Rule Violation</th>
                  <th className="p-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {batchResults.evaluations.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full font-bold text-[10px] ${
                        item.isPsif ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.isPsif ? 'P-SIF' : 'Routine'}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-gray-800 max-w-xs">{item.statement}</td>
                    <td className="p-3 text-gray-600">{item.site}</td>
                    <td className="p-3 text-teal-800 font-semibold">{item.ruleViolated}</td>
                    <td className={`p-3 font-bold ${item.isPsif ? 'text-red-600' : 'text-gray-600'}`}>
                      {item.severity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESULT 2: SINGLE STATEMENT OUTPUT CARD */}
      {result && analysisMode === 'text' && (
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