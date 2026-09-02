import React, { useState } from 'react';
import { PYTHON_WORKING_CODE } from '../data/pythonCode';
import { Code2, Copy, Check, Terminal, BookOpen, Sigma, Calculator } from 'lucide-react';

export const CodeAndWorkings: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_WORKING_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16 text-slate-800">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        
        <h2 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
          Python Code Engine & Mathematical Formulations
        </h2>
        
      </div>

      {/* Mathematical Proofs & Formula Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PV Physics Equations */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
            1. Photovoltaic Conversion Physics
          </div>
          
          <div className="space-y-3 text-xs text-slate-700">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-mono text-slate-900 font-semibold">
              {'E_d = P_STC × (GHI_d / 1.0) × PR × [1 - γ · (T_cell - 25°C)]'}
            </div>
            <p className="font-medium text-slate-900">
              Where:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>P_STC  = 3.0 kW (Peak DC nameplate rating).</li>
              <li>GHI_d  = Daily Global Horizontal Irradiance in kWh/m²/day.</li>
              <li>PR     = 0.80 (System performance ratio including wiring, inverter & mismatch).</li>
              <li>γ      = 0.004/°C (Temperature power derating coefficient for c-Si).</li>
              <li>T_cell = T_ambient + [(NOCT - 20) / 800] × GHI (Sandia/NOCT cell model).</li>
            </ul>
          </div>
        </div>

        {/* Parametric Payout & Burn Cost Math */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
            2. Actuarial Burn Cost & Premium
          </div>
          
          <div className="space-y-3 text-xs text-slate-700">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-mono text-slate-900 font-semibold">
              {'Pure Burn Cost = (1 / N) × ∑ min(MaxPayout, max(0, K_T - I_y) × Tariff)'}
            </div>
            <p className="font-medium text-slate-900">
              Commercial Loading Model:
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-emerald-800 font-semibold">
              {'Premium = Burn Cost × (1 + λ_risk + λ_admin + λ_reins) × (1 + GST)'}
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>K_T       = 0.90 × 4,600 = 4,140 kWh (Trigger Threshold).</li>
              <li>K_E       = 0.70 × 4,600 = 3,220 kWh (Exit Floor Cap).</li>
              <li>MaxPayout = (K_T - K_E) × ₹5.75 = ₹5,290 (Maximum Sum Insured).</li>
              <li>λ_risk    = 0.25 (25%), λ_admin = 0.15 (15%), λ_reins = 0.15 (15%), GST = 0.18 (18%).</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Copyable Python Code Engine */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-blue-400" />
              inrisk_solar_parametric_engine.py
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Python Script</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-6 text-xs font-mono text-slate-300 bg-slate-950 overflow-x-auto leading-relaxed max-h-[600px] select-all">
          <code>{PYTHON_WORKING_CODE}</code>
        </pre>
      </div>

    </div>
  );
};
