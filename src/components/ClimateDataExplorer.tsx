import React, { useState } from 'react';
import { ClimateYearData, YearBacktestResult, PricingParameters } from '../types';
import { ERA5_CLIMATE_DATA, MONTH_NAMES } from '../data/era5ClimateData';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { 
  Sun, 
  CloudRain, 
  Thermometer, 
  Calendar, 
  AlertCircle, 
  Layers,
  ChevronRight
} from 'lucide-react';

interface ClimateDataExplorerProps {
  params: PricingParameters;
  backtestResults: YearBacktestResult[];
}

export const ClimateDataExplorer: React.FC<ClimateDataExplorerProps> = ({
  params,
  backtestResults
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2019);

  // Merge ERA5 Climate Data with Backtest Results
  const chartData = ERA5_CLIMATE_DATA.map((clim) => {
    const bt = backtestResults.find((b) => b.year === clim.year);
    return {
      year: clim.year.toString(),
      ghi: clim.annualGHI_kWh_m2,
      aep: bt?.modelledAEP_kWh || clim.modelledAEP_kWh,
      payout: bt?.payout_INR || 0,
      baselineAEP: params.aep50_kWh,
      triggerLine: Math.round(params.aep50_kWh * params.triggerPercent / 100),
      exitLine: Math.round(params.aep50_kWh * params.exitPercent / 100),
      rainfall: clim.monsoonRainfall_mm,
      cloudCover: clim.cloudCoverPercent,
      isAnomaly: clim.isAnomalyYear,
      description: clim.anomalyDescription
    };
  });

  const activeYearData = ERA5_CLIMATE_DATA.find((d) => d.year === selectedYear) || ERA5_CLIMATE_DATA[0];
  const activeBacktest = backtestResults.find((b) => b.year === selectedYear);

  // Monthly profile data for selected year
  const monthlyData = MONTH_NAMES.map((month, idx) => {
    return {
      month,
      ghi: activeYearData.monthlyGHI[idx],
      temp: activeYearData.monthlyTemp[idx],
      generation: activeYearData.monthlyGeneration_kWh[idx]
    };
  });

  return (
    <div className="space-y-8 pb-16 text-slate-800">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
          20-Year ERA5-Land Climate & Generation Explorer (2005–2024)
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          ECMWF 0.1° × 0.1° (~9 km) reanalysis insolation, temperature, and monsoon precipitation for Ahmedabad (Pincode: 380006).
        </p>
      </div>

      {/* Chart 1: 20-Year Generation vs. Trigger & Payout */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Annual Solar Generation vs. Trigger Threshold ({Math.round(params.aep50_kWh * params.triggerPercent / 100).toLocaleString()} kWh)
            </h3>
            <p className="text-xs text-slate-500">
              Gold bars indicate years where insolation dropped below the parametric trigger, initiating insurance payout.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" /> Payout Year
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <span className="w-2.5 h-2.5 bg-slate-300 rounded-sm" /> Normal Year
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} domain={[3000, 5200]} tickFormatter={(v) => `${v}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: number, name: string) => [
                  name.includes('Payout') ? `₹${val.toLocaleString()}` : `${val.toLocaleString()} kWh`,
                  name
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              
              {/* Reference Baseline Lines */}
              <ReferenceLine yAxisId="left" y={params.aep50_kWh} stroke="#059669" strokeDasharray="4 4" label={{ value: `AEP50 (${params.aep50_kWh.toLocaleString()} kWh)`, fill: '#059669', fontSize: 10, position: 'top' }} />
              <ReferenceLine yAxisId="left" y={Math.round(params.aep50_kWh * params.triggerPercent / 100)} stroke="#dc2626" strokeDasharray="3 3" label={{ value: `Trigger (${Math.round(params.aep50_kWh * params.triggerPercent / 100).toLocaleString()} kWh)`, fill: '#dc2626', fontSize: 10, position: 'insideBottomLeft' }} />

              <Bar yAxisId="right" dataKey="payout" name="Parametric Payout (₹)" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Line yAxisId="left" type="monotone" dataKey="aep" name="Modelled AEP (kWh)" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4, fill: '#0284c7' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Year Selector + Detailed Monthly Decomposition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Year Selector List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              Select Historical Year
            </h4>
            <span className="text-[10px] text-slate-500 font-mono font-medium">2005–2024</span>
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
            {ERA5_CLIMATE_DATA.map((item) => {
              const isSelected = item.year === selectedYear;
              const bt = backtestResults.find(b => b.year === item.year);

              return (
                <button
                  key={item.year}
                  onClick={() => setSelectedYear(item.year)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200 shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">{item.year}</span>
                    {item.isAnomalyYear && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                        Anomaly
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500">{item.modelledAEP_kWh} kWh</span>
                    {bt?.triggered ? (
                      <span className="font-mono font-bold text-amber-700">₹{bt.payout_INR}</span>
                    ) : (
                      <span className="text-[10px] text-slate-400">₹0</span>
                    )}
                    <ChevronRight className={`h-3 w-3 ${isSelected ? 'text-blue-700' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Year Monthly Deep Dive */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="text-xs text-blue-700 font-mono font-semibold">
                Climate Deep-Dive: Year {activeYearData.year}
              </div>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                Monthly Solar Irradiance & Generation Curve
              </h4>
            </div>
            <div className="text-right">
              {activeBacktest?.triggered ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Triggered: ₹{activeBacktest.payout_INR} Payout
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  No Deficit (Above Trigger)
                </span>
              )}
            </div>
          </div>

          {/* Meteorological Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-[10px] text-slate-500 font-medium">Annual GHI</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                {activeYearData.annualGHI_kWh_m2} <span className="text-[10px] font-sans text-slate-500 font-normal">kWh/m²</span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-[10px] text-slate-500 font-medium">Monsoon Rainfall</div>
              <div className="text-base font-bold font-mono text-blue-700 mt-0.5">
                {activeYearData.monsoonRainfall_mm} <span className="text-[10px] font-sans text-slate-500 font-normal">mm</span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-[10px] text-slate-500 font-medium">Mean Temp</div>
              <div className="text-base font-bold font-mono text-amber-700 mt-0.5">
                {activeYearData.avgTemp_C} <span className="text-[10px] font-sans text-slate-500 font-normal">°C</span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-[10px] text-slate-500 font-medium">Total AEP</div>
              <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                {activeYearData.modelledAEP_kWh} <span className="text-[10px] font-sans text-slate-500 font-normal">kWh</span>
              </div>
            </div>
          </div>

          {/* Anomaly Description Banner */}
          {activeYearData.anomalyDescription && (
            <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-200 text-xs text-slate-700 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900">Meteorological Notes for {activeYearData.year}:</strong>{" "}
                {activeYearData.anomalyDescription}
              </div>
            </div>
          )}

          {/* Monthly Generation Bar Chart */}
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} domain={[0, 8]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar yAxisId="left" dataKey="generation" name="Monthly Generation (kWh)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="ghi" name="Daily GHI (kWh/m²/day)" stroke="#d97706" strokeWidth={2.5} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
