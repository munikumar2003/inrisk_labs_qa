export interface ClimateYearData {
  year: number;
  annualGHI_kWh_m2: number; // kWh/m²/year
  avgDailyGHI: number; // kWh/m²/day
  avgTemp_C: number;
  monsoonRainfall_mm: number;
  cloudCoverPercent: number;
  monthlyGHI: number[]; // 12 months in kWh/m²/day
  monthlyTemp: number[]; // 12 months in °C
  monthlyGeneration_kWh: number[]; // 12 months in kWh
  modelledAEP_kWh: number; // Total Annual Energy Production in kWh
  shortfallVsAEP50_kWh: number; // Deficit compared to 4,600 kWh
  deficitPercent: number; // Deficit in %
  isAnomalyYear?: boolean;
  anomalyDescription?: string;
}

export interface PricingParameters {
  installedCapacity_kW: number; // Default 3.0 kW
  performanceRatio: number; // Default 0.80 (80%)
  aep50_kWh: number; // Default 4600 kWh
  tariff_INR: number; // Default 5.75 INR/kWh
  installationCost_INR: number; // Default 250,000 INR
  triggerPercent: number; // Default 90% (4,140 kWh)
  exitPercent: number; // Default 70% (3,220 kWh)
  riskLoadingPercent: number; // Default 25% (Uncertainty & capital charge)
  adminExpensePercent: number; // Default 15% (NBFC & operational distribution)
  reinsuranceProfitPercent: number; // Default 15% (Reinsurance margin & profit)
  taxGSTPercent: number; // Default 18% (GST on commercial insurance)
  portfolioSize: number; // Default 10,000 customers
}

export interface YearBacktestResult {
  year: number;
  modelledAEP_kWh: number;
  trigger_kWh: number;
  exit_kWh: number;
  deficit_kWh: number;
  payout_INR: number;
  lossRatioPercent: number;
  triggered: boolean;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  financialLossWithoutInsurance_INR: number;
  netCustomerPositionWithInsurance_INR: number;
}

export interface ActuarialSummary {
  pureBurnCost_INR: number; // Mean annual historical payout per policy
  burnCostStdDev_INR: number; // Std deviation of annual payouts
  maxSingleYearPayout_INR: number; // Maximum single year payout
  payoutFrequency: number; // Number of triggered years / 20
  triggerProbabilityPercent: number; // Historical probability of payout
  sumInsuredMax_INR: number; // Maximum possible payout under policy
  riskLoading_INR: number;
  adminExpense_INR: number;
  reinsuranceProfit_INR: number;
  commercialPremiumExTax_INR: number;
  commercialPremiumWithTax_INR: number;
  premiumRateOnSumInsuredPercent: number;
  premiumAsPercentOfAnnualRevenue: number;
  monthlyEmbeddedEMI_INR: number;
  portfolioTotalExposure_INR: number;
  portfolioAnnualPremiumPool_INR: number;
  portfolioHistoricalMaxLoss_INR: number;
  var99_1in20Loss_INR: number;
  var99_5_1in50Loss_INR: number;
}

export interface FailureMode {
  id: string;
  title: string;
  category: string;
  rootCause: string;
  portfolioImpact: string;
  severityLevel: 'High' | 'Critical' | 'Medium';
  affectedCustomersPercent: number;
  financialExposure_INR: string;
  proposedImprovement: string;
  implementationComplexity: 'Low' | 'Medium' | 'High';
}
