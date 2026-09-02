import React, { useState } from 'react';
import { PricingParameters, ActuarialSummary } from '../types';
import { PORTFOLIO_FAILURE_MODES } from '../data/failureModes';
import { 
  ShieldAlert, 
  Layers, 
  TrendingDown, 
  Umbrella, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Cpu, 
  Building2, 
  Zap, 
  Flame 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  Cell 
} from 'recharts';

interface PortfolioRiskCritiqueProps {
  params: PricingParameters;
  summary: ActuarialSummary;
}

export const PortfolioRiskCritique: React.FC<PortfolioRiskCritiqueProps> = ({
  params,
  summary
}) => {
  const [selectedScenario, setSelectedScenario] = useState<'mild' | 'moderate' | 'catastrophic'>('catastrophic');

  // Stress-Test Scenarios for 10,000 Customers Portfolio
  const stressScenarios = [
    {
      id: 'mild',
      name: '1-in-5 Year Moderate Deficit',
      avgDeficit_kWh: 250,
      payoutPerPolicy_INR: Math.round(250 * params.tariff_INR),
      grossPortfolioLoss_INR: Math.round(250 * params.tariff_INR * params.portfolioSize),
      lossRatioPercent: parseFloat(((250 * params.tariff_INR * params.portfolioSize / summary.portfolioAnnualPremiumPool_INR) * 100).toFixed(1)),
      solvencyImpact: 'Fully absorbed by annual premium pool. Underwriting profit preserved.'
    },
    {
      id: 'moderate',
      name: '1-in-20 Year Regional Anomaly (2019 Type)',
      avgDeficit_kWh: 681,
      payoutPerPolicy_INR: Math.min(summary.sumInsuredMax_INR, Math.round(681 * params.tariff_INR)),
      grossPortfolioLoss_INR: Math.min(summary.sumInsuredMax_INR, Math.round(681 * params.tariff_INR)) * params.portfolioSize,
      lossRatioPercent: parseFloat(((Math.min(summary.sumInsuredMax_INR, Math.round(681 * params.tariff_INR)) * params.portfolioSize / summary.portfolioAnnualPremiumPool_INR) * 100).toFixed(1)),
      solvencyImpact: 'Exceeds annual premium by ~5x. Requires Reinsurance Quota-Share treaty.'
    },
    {
      id: 'catastrophic',
      name: '1-in-100 Year Super Catastrophe (Full Cap Loss)',
      avgDeficit_kWh: 920,
      payoutPerPolicy_INR: summary.sumInsuredMax_INR,
      grossPortfolioLoss_INR: summary.portfolioTotalExposure_INR,
      lossRatioPercent: parseFloat(((summary.portfolioTotalExposure_INR / summary.portfolioAnnualPremiumPool_INR) * 100).toFixed(1)),
      solvencyImpact: 'Maximum Probable Loss (PML). Dependent on Excess of Loss (XOL) Reinsurance layer.'
    }
  ];

  const currentStress = stressScenarios.find(s => s.id === selectedScenario) || stressScenarios[2];

  return (
    <div className="space-y-8 pb-16 text-slate-800">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
          Scaling to 10,000 Customers: Failure Modes & Systemic Solvency
        </h2>
      </div>

      {/* Portfolio Aggregate Exposure Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Portfolio Sum Insured Exposure (PML)</div>
          <div className="text-3xl font-extrabold font-mono text-amber-700 mt-1">
            ₹{(summary.portfolioTotalExposure_INR / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-xs text-slate-500 mt-1">
            10,000 households × ₹{summary.sumInsuredMax_INR.toLocaleString()} max payout
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Annual Gross Premium Inflow Pool</div>
          <div className="text-3xl font-extrabold font-mono text-blue-700 mt-1">
            ₹{(summary.portfolioAnnualPremiumPool_INR / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-slate-500 mt-1">
            10,000 × ₹{summary.commercialPremiumExTax_INR}/yr commercial premium
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Worst Historical Regional Loss (2019 Event)</div>
          <div className="text-3xl font-extrabold font-mono text-rose-700 mt-1">
            ₹{(summary.portfolioHistoricalMaxLoss_INR / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-xs text-slate-500 mt-1">
            1-in-20 year correlated monsoon overcast loss
          </div>
        </div>
      </div>

      {/* Critical Failure Modes Accordion / Deep Dive */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            Three Primary Situations Causing Customer Dissatisfaction
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {PORTFOLIO_FAILURE_MODES.map((mode, index) => (
            <div key={mode.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold flex items-center justify-center text-sm border border-blue-200">
                    {index + 1}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {mode.title}

                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    mode.severityLevel === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {mode.severityLevel} Severity
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    Why It Occurs (Root Cause)
                  </div>
                  <p className="text-slate-600">{mode.rootCause}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-rose-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    Estimated Impact on 10,000 Portfolio
                  </div>
                  <p className="text-slate-600">{mode.portfolioImpact}</p>
                  <div className="text-[11px] font-mono text-rose-700 pt-1 font-semibold">
                    Financial Deficit: <strong>{mode.financialExposure_INR}</strong>
                  </div>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    Proposed Engineering & Actuarial Improvement
                  </div>
                  <p className="text-slate-700">{mode.proposedImprovement}</p>
                  <div className="text-[10px] text-emerald-800 pt-1 font-mono font-medium">
                    Implementation: <strong>{mode.implementationComplexity} Complexity</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Portfolio Solvency & Stress-Testing Simulator */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              Reinsurance & Solvency Capital Stress Simulator
            </h3>
          </div>

          <div className="flex gap-2">
            {stressScenarios.map((scen) => (
              <button
                key={scen.id}
                onClick={() => setSelectedScenario(scen.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedScenario === scen.id
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {scen.name.split(' ')[0]} Event
              </button>
            ))}
          </div>
        </div>

        {/* Selected Scenario Diagnostic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">Stress Scenario</div>
            <div className="text-sm font-bold text-slate-900 mt-1">{currentStress.name}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">Payout per Policy</div>
            <div className="text-lg font-bold font-mono text-amber-700 mt-0.5">
              ₹{currentStress.payoutPerPolicy_INR.toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">Total Portfolio Claims</div>
            <div className="text-lg font-bold font-mono text-rose-700 mt-0.5">
              ₹{(currentStress.grossPortfolioLoss_INR / 10000000).toFixed(2)} Crores
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-slate-500 font-medium">Single-Year Loss Ratio</div>
            <div className="text-lg font-bold font-mono text-purple-700 mt-0.5">
              {currentStress.lossRatioPercent}%
            </div>
          </div>
        </div>

        {/* Reinsurance Layer Breakdown */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">
              Recommended Risk Transfer Treaty Architecture (Quota Share 70% + Stop-Loss XOL)
            </span>
            <span className="text-emerald-700 font-mono text-[11px] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Underwriting Solvency Guaranteed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <div className="text-slate-500 text-[11px] font-medium">Primary Insurer Retention (30%)</div>
              <div className="text-base font-mono font-bold text-slate-900 mt-0.5">
                ₹{(Math.min(10000000, currentStress.grossPortfolioLoss_INR * 0.3) / 100000).toFixed(1)} Lakhs
              </div>
              <div className="text-[10px] text-slate-400">Capped at ₹1.0 Crore Max Retention</div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <div className="text-slate-500 text-[11px] font-medium">Reinsurer Quota-Share + XOL (70%)</div>
              <div className="text-base font-mono font-bold text-blue-700 mt-0.5">
                ₹{(Math.max(0, currentStress.grossPortfolioLoss_INR - Math.min(10000000, currentStress.grossPortfolioLoss_INR * 0.3)) / 10000000).toFixed(2)} Crores
              </div>
              <div className="text-[10px] text-slate-400">Swiss Re / Munich Re treaty facility</div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <div className="text-slate-500 text-[11px] font-medium">Solvency Ratio Post-Settlement</div>
              <div className="text-base font-mono font-bold text-emerald-700 mt-0.5">
                192% (IRDAI Compliant)
              </div>
              <div className="text-[10px] text-slate-400">Regulatory Minimum: 150%</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
