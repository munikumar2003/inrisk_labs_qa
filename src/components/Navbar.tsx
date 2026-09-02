import React, { useState } from 'react';
import { 
  Download,
  FileText,
  Code2,
  Check,
  ChevronDown
} from 'lucide-react';
import { PricingParameters, YearBacktestResult, ActuarialSummary } from '../types';
import { downloadPdfReport } from '../utils/pdfGenerator';
import { downloadFile, generateMarkdownReport, DEFAULT_CANDIDATE_INFO } from '../utils/exportReport';
import { PYTHON_WORKING_CODE } from '../data/pythonCode';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  params: PricingParameters;
  backtestResults: YearBacktestResult[];
  summary: ActuarialSummary;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  params,
  backtestResults,
  summary
}) => {
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const tabs = [
    { id: 'studio', label: 'Pricing Studio & Sensitivity', badge: 'Interactive' },
    { id: 'climate', label: '20-Year ERA5 Backtest', badge: '2005–2024' },
    { id: 'critique', label: '10,000 Portfolio Critique', badge: 'Risk & Solvency' },
    { id: 'code', label: 'Python & Actuarial Math', badge: 'Workings' },
  ];

  const handleDownloadPdf = () => {
    downloadPdfReport(DEFAULT_CANDIDATE_INFO, params, backtestResults, summary);
    setDownloadSuccess('PDF Generated & Downloaded');
    setTimeout(() => setDownloadSuccess(null), 3000);
    setShowExportMenu(false);
  };

  const handleDownloadMd = () => {
    const md = generateMarkdownReport(DEFAULT_CANDIDATE_INFO, params, backtestResults, summary);
    downloadFile(md, `InRisk_Labs_Case_Study_Report_${DEFAULT_CANDIDATE_INFO.name.replace(/\s+/g, '_')}.md`, 'text/markdown');
    setDownloadSuccess('Markdown Report Downloaded');
    setTimeout(() => setDownloadSuccess(null), 3000);
    setShowExportMenu(false);
  };

  const handleDownloadPython = () => {
    downloadFile(PYTHON_WORKING_CODE, 'inrisk_solar_parametric_engine.py', 'text/x-python');
    setDownloadSuccess('Python Script Downloaded');
    setTimeout(() => setDownloadSuccess(null), 3000);
    setShowExportMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            I
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-slate-900">
                InRisk Labs <span className="font-normal text-slate-400">| Quantitative Analyst Workbench</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Specification Chips */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 gap-3">
            <div><span className="text-slate-400 font-medium">System:</span> <strong className="text-slate-700">3.0 kVA</strong></div>
            <div className="h-3 w-px bg-slate-200" />
            <div><span className="text-slate-400 font-medium">PR:</span> <strong className="text-slate-700">80%</strong></div>
            <div className="h-3 w-px bg-slate-200" />
            <div><span className="text-slate-400 font-medium">AEP50:</span> <strong className="text-blue-700 font-mono">4,600 kWh</strong></div>
            <div className="h-3 w-px bg-slate-200" />
            <div><span className="text-slate-400 font-medium">Tariff:</span> <strong className="text-emerald-700 font-mono">₹5.75/kWh</strong></div>
          </div>

          {/* PDF & Deliverables Export Button with Dropdown
          <div className="relative">
            <div className="inline-flex rounded-lg shadow-xs">
              <button
                id="download-pdf-primary-btn"
                onClick={handleDownloadPdf}
                className="flex items-center gap-2 px-3.5 py-2 rounded-l-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
                title="Download 4-Page Formal Case Study Report PDF"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                    <span>{downloadSuccess}</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-2 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-r-lg border-l border-blue-500 transition cursor-pointer"
                title="More export options"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {/* {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Deliverable Files
                </div>
                <button
                  onClick={handleDownloadPdf}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left hover:bg-blue-50 text-slate-800 hover:text-blue-700 rounded-lg transition font-medium cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-blue-600" />
                  <div>
                    <div className="font-bold">Formal Report PDF (4-Page)</div>
                    <div className="text-[10px] text-slate-500">A4 printable document with all tasks</div>
                  </div>
                </button>
                <button
                  onClick={handleDownloadMd}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left hover:bg-blue-50 text-slate-800 hover:text-blue-700 rounded-lg transition font-medium cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-600" />
                  <div>
                    <div className="font-bold">Markdown Deliverable (.md)</div>
                    <div className="text-[10px] text-slate-500">Standalone raw markdown report</div>
                  </div>
                </button>
                <button
                  onClick={handleDownloadPython}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left hover:bg-blue-50 text-slate-800 hover:text-blue-700 rounded-lg transition font-medium cursor-pointer"
                >
                  <Code2 className="h-3.5 w-3.5 text-amber-600" />
                  <div>
                    <div className="font-bold">Python Actuarial Engine (.py)</div>
                    <div className="text-[10px] text-slate-500">Standalone executable python script</div>
                  </div>
                </button>
              </div>
            )}
          </div> */}
        </div> 
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
