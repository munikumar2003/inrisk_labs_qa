import React, { useMemo } from 'react';
import { PricingParameters, YearBacktestResult, ActuarialSummary } from '../types';
import { generateSensitivityMatrix } from '../utils/actuarialEngine';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { 
  Sliders, 
  RotateCcw, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  Info,
  HelpCircle,
  BarChart3,
  Scale
} from 'lucide-react';

interface InteractivePricingStudioProps {
  params: PricingParameters;
  setParams: React.Dispatch<React.SetStateAction<PricingParameters>>;
  backtestResults: YearBacktestResult[];
  summary: ActuarialSummary;
  onReset: () => void;
}

export const InteractivePricingStudio: React.FC<InteractivePricingStudioProps> = ({
  params,
  setParams,
  backtestResults,
  summary,
  onReset
}) => {
  const sensitivityMatrix = useMemo(() => {
    return generateSensitivityMatrix(params);
  }, [params]);

  // Waterfall Chart Data for Premium Breakdown
  const waterfallData = [
    { name: 'Pure Burn Cost', amount: summary.pureBurnCost_INR, fill: '#f59e0b', type: 'Loss Cost' },
    { name: 'Risk Loading (25%)', amount: summary.riskLoading_INR, fill: '#2563eb', type: 'Capital Margin' },
    { name: 'Admin/NBFC (15%)', amount: summary.adminExpense_INR, fill: '#7c3aed', type: 'Operational' },
    { name: 'Reinsurer Margin (15%)', amount: summary.reinsuranceProfit_INR, fill: '#0891b2', type: 'Profit Margin' },
    { name: 'GST Tax (18%)', amount: Math.round(summary.commercialPremiumExTax_INR * 0.18), fill: '#059669', type: 'Tax' },
  ];

  // Customer Protection Chart Data
  const loanComparisonData = backtestResults.map((row) => {
    const monthlyEMI = 3200; // Benchmark ₹3,200/mo loan EMI
    const annualLoanObligation = monthlyEMI * 12; // ₹38,400
    const baselineSavings = params.aep50_kWh * params.tariff_INR; // ₹26,450
    const unhedgedSavings = row.modelledAEP_kWh * params.tariff_INR;
    const hedgedSavings = unhedgedSavings + row.payout_INR;

    return {
      year: row.year.toString(),
      unhedgedSavings,
      hedgedSavings,
      payout: row.payout_INR,
      aep: row.modelledAEP_kWh,
      triggered: row.triggered
    };
  });

  return (
    <div className="space-y-8 pb-16 text-slate-800">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Parametric Pricing & Sensitivity Studio
          </h2>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition cursor-pointer self-start md:self-auto shadow-2xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Default Inputs</span>
        </button>
      </div>

      {/* KPI Headline Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs relative overflow-hidden">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Pure Loss Cost (Burn Cost)</span>
            <span className="text-[10px] text-amber-700 font-mono font-semibold bg-amber-50 px-1.5 py-0.5 rounded">E[Payout]</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
            ₹{summary.pureBurnCost_INR} <span className="text-xs text-slate-400 font-sans font-normal">/ yr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Std Dev: <span className="font-mono text-slate-700 font-medium">±₹{summary.burnCostStdDev_INR}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs relative overflow-hidden">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Commercial Premium</span>
            <span className="text-[10px] text-emerald-700 font-mono font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Net + Tax</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
            ₹{summary.commercialPremiumWithTax_INR} <span className="text-xs text-slate-400 font-sans font-normal">/ yr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Embedded EMI: <span className="font-mono text-emerald-700 font-bold">₹{summary.monthlyEmbeddedEMI_INR}/mo</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs relative overflow-hidden">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Max Policy Payout</span>
            <span className="text-[10px] text-blue-700 font-mono font-semibold bg-blue-50 px-1.5 py-0.5 rounded">Sum Insured</span>
          </div>
          <div className="text-2xl font-extrabold text-blue-700 font-mono mt-1">
            ₹{summary.sumInsuredMax_INR.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Deficit Cap: <span className="font-mono text-slate-700 font-medium">{Math.round((params.triggerPercent - params.exitPercent) * params.aep50_kWh / 100)} kWh</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs relative overflow-hidden">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Payout Frequency</span>
            <span className="text-[10px] text-purple-700 font-mono font-semibold bg-purple-50 px-1.5 py-0.5 rounded">20-Yr ERA5</span>
          </div>
          <div className="text-2xl font-extrabold text-purple-700 font-mono mt-1">
            {summary.payoutFrequency} / 20 <span className="text-xs text-slate-400 font-sans font-normal">({summary.triggerProbabilityPercent}%)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Return Period: <span className="font-mono text-slate-700 font-medium">~1 in {(20 / Math.max(1, summary.payoutFrequency)).toFixed(1)} yrs</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sliders Controls + Visual Waterfall */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive Parametric Controls */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              Policy Parameters
            </h3>
            <span className="text-[11px] text-blue-700 font-mono font-semibold bg-blue-50 px-2 py-0.5 rounded">Live Inputs</span>
          </div>

          {/* Trigger Threshold Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                Trigger Level (K_T):
              </label>
              <span className="font-mono font-bold text-blue-700">
                {params.triggerPercent}% ({Math.round(params.aep50_kWh * params.triggerPercent / 100)} kWh)
              </span>
            </div>
            <input
              type="range"
              min={80}
              max={98}
              step={1}
              value={params.triggerPercent}
              onChange={(e) => setParams({ ...params, triggerPercent: Number(e.target.value) })}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            
          </div>

          {/* Exit Floor Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                Exit Floor / Cap (K_E):
              </label>
              <span className="font-mono font-bold text-rose-700">
                {params.exitPercent}% ({Math.round(params.aep50_kWh * params.exitPercent / 100)} kWh)
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={params.triggerPercent - 5}
              step={1}
              value={params.exitPercent}
              onChange={(e) => setParams({ ...params, exitPercent: Number(e.target.value) })}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            
          </div>

          {/* Electricity Tariff Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700">
                Electricity Tariff (₹/kWh):
              </label>
              <span className="font-mono font-bold text-amber-700">
                ₹{params.tariff_INR.toFixed(2)} / kWh
              </span>
            </div>
            <input
              type="range"
              min={4.00}
              max={9.00}
              step={0.25}
              value={params.tariff_INR}
              onChange={(e) => setParams({ ...params, tariff_INR: Number(e.target.value) })}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            
          </div>

          {/* System Performance Ratio */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700">
                System Performance Ratio (PR):
              </label>
              <span className="font-mono font-bold text-emerald-700">
                {Math.round(params.performanceRatio * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0.70}
              max={0.90}
              step={0.01}
              value={params.performanceRatio}
              onChange={(e) => setParams({ ...params, performanceRatio: Number(e.target.value) })}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            
          </div>

          {/* Loading Margins Accordion */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Commercial Loading Multipliers
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Risk Load</div>
                <div className="font-bold text-blue-700 font-mono mt-0.5">{params.riskLoadingPercent}%</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-medium">NBFC Ops</div>
                <div className="font-bold text-purple-700 font-mono mt-0.5">{params.adminExpensePercent}%</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Reins Profit</div>
                <div className="font-bold text-teal-700 font-mono mt-0.5">{params.reinsuranceProfitPercent}%</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Premium Decomposition + Loan Hedging Visuals */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart 1: Customer Solar Savings With vs Without Insurance */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                 Loan Repayment Protection Effect (2005–2024)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                   Unhedged Revenue (gray) vs. Financial Position (emerald).
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[11px] px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">
                  Floor Maintained @ ₹{(params.triggerPercent * params.aep50_kWh * params.tariff_INR / 100).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={loanComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: number, name: string) => [`₹${val.toLocaleString()}`, name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="unhedgedSavings" name="Actual Solar Savings (Unhedged)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="payout" name="Parametric Insurance Payout" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Line 
                    type="monotone" 
                    dataKey="hedgedSavings" 
                    name="Protected Floor (Total Customer Cash)" 
                    stroke="#059669" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, fill: '#059669' }} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-600 mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <strong className="text-slate-900">Insight:</strong> During deficit years (2006, 2013, 2017, 2019, 2021), unhedged solar generation plunged well below the loan repayment safety threshold. The parametric payout seamlessly injects liquidity (up to ₹{summary.sumInsuredMax_INR}), preserving debt servicing.
            </div>
          </div>

          {/* Chart 2: Waterfall Decomposition of Commercial Premium */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  Commercial Premium Loading Breakdown
                </h3>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Total: ₹{summary.commercialPremiumWithTax_INR}/yr
                </span>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={waterfallData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: number) => [`₹${val}`, 'Amount']}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* Trigger vs Exit Sensitivity Heatmap Matrix */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              Actuarial Sensitivity Grid: Trigger vs. Exit Floor
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">Matrix Unit: ₹ / Policy</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
          <table className="w-full text-xs text-center">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3 text-left font-semibold">Trigger Level (K_T)</th>
                <th className="p-3 font-semibold">Exit Floor 60%</th>
                <th className="p-3 font-semibold">Exit Floor 65%</th>
                <th className="p-3 bg-blue-50/80 text-blue-900 font-bold border-x border-blue-200">Exit Floor 70% (Default)</th>
                <th className="p-3 font-semibold">Exit Floor 75%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono bg-white">
              {sensitivityMatrix.map((row, idx) => {
                if (!row || row.length === 0) return null;
                const trigPct = row[0]?.triggerPercent;
                const isSelectedRow = trigPct === params.triggerPercent;

                return (
                  <tr key={idx} className={isSelectedRow ? "bg-blue-50/30 font-semibold" : "hover:bg-slate-50/60"}>
                    <td className="p-3 text-left font-bold text-slate-900 font-sans flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      Trigger {trigPct}% ({Math.round(params.aep50_kWh * trigPct / 100)} kWh)
                    </td>
                    {row.map((cell, cIdx) => (
                      <td 
                        key={cIdx} 
                        className={`p-3 ${
                          cell?.exitPercent === params.exitPercent && isSelectedRow
                            ? "bg-blue-100/60 text-blue-900 border-2 border-blue-600 rounded-lg" 
                            : "text-slate-600"
                        }`}
                      >
                        <div className="font-bold text-slate-900">Burn: ₹{cell?.burnCost}</div>
                        <div className="text-[10px] text-emerald-700 font-medium">Comm: ₹{cell?.commercialPremium}</div>
                        <div className="text-[9px] text-slate-400">{cell?.triggerProbability}% Freq</div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
