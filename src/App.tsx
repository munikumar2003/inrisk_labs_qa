import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { InteractivePricingStudio } from './components/InteractivePricingStudio';
import { ClimateDataExplorer } from './components/ClimateDataExplorer';
import { PortfolioRiskCritique } from './components/PortfolioRiskCritique';
import { CodeAndWorkings } from './components/CodeAndWorkings';
import { DEFAULT_PRICING_PARAMS, runBacktest, calculateActuarialSummary } from './utils/actuarialEngine';
import { ERA5_CLIMATE_DATA } from './data/era5ClimateData';
import { PricingParameters } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('studio');
  const [params, setParams] = useState<PricingParameters>(DEFAULT_PRICING_PARAMS);

  // Dynamically compute backtest and actuarial summary
  const backtestResults = useMemo(() => {
    return runBacktest(ERA5_CLIMATE_DATA, params);
  }, [params]);

  const actuarialSummary = useMemo(() => {
    return calculateActuarialSummary(backtestResults, params);
  }, [backtestResults, params]);

  const handleReset = () => {
    setParams(DEFAULT_PRICING_PARAMS);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-900">
      
      {/* Top Navigation & Direct Deliverable PDF Exporter */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        params={params}
        backtestResults={backtestResults}
        summary={actuarialSummary}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'studio' && (
          <InteractivePricingStudio 
            params={params} 
            setParams={setParams} 
            backtestResults={backtestResults} 
            summary={actuarialSummary} 
            onReset={handleReset} 
          />
        )}

        {activeTab === 'climate' && (
          <ClimateDataExplorer 
            params={params} 
            backtestResults={backtestResults} 
          />
        )}

        {activeTab === 'critique' && (
          <PortfolioRiskCritique 
            params={params} 
            summary={actuarialSummary} 
          />
        )}

        {activeTab === 'code' && (
          <CodeAndWorkings />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
              I
            </div>
            <span className="font-semibold text-slate-700">InRisk Labs</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span className="text-slate-500">Ahmedabad Urban Grid (Pincode: 380006)</span>
            <span>•</span>
            <span className="text-blue-700 font-semibold">Sum Insured: ₹{actuarialSummary.sumInsuredMax_INR.toLocaleString()}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
