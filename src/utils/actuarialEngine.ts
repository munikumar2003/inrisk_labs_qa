import { ClimateYearData, PricingParameters, YearBacktestResult, ActuarialSummary } from '../types';
import { ERA5_CLIMATE_DATA } from '../data/era5ClimateData';

/**
 * Actuarial Pricing and Risk Engine for Rooftop Solar Parametric Insurance
 */

export const DEFAULT_PRICING_PARAMS: PricingParameters = {
  installedCapacity_kW: 3.0,
  performanceRatio: 0.80,
  aep50_kWh: 4600,
  tariff_INR: 5.75,
  installationCost_INR: 250000,
  triggerPercent: 90, // Trigger at 90% of AEP50 (4,140 kWh)
  exitPercent: 70,    // Max payout cap at 70% of AEP50 (3,220 kWh)
  riskLoadingPercent: 25, // 25% for climate volatility & model uncertainty
  adminExpensePercent: 15, // 15% for NBFC distribution & operational costs
  reinsuranceProfitPercent: 15, // 15% for underwriting profit & capital cost
  taxGSTPercent: 18, // 18% GST standard Indian commercial insurance rate
  portfolioSize: 10000
};

/**
 * Backtest the parametric product over historical ERA5-Land climate records
 */
export function runBacktest(
  climateData: ClimateYearData[] = ERA5_CLIMATE_DATA,
  params: PricingParameters = DEFAULT_PRICING_PARAMS
): YearBacktestResult[] {
  const trigger_kWh = (params.triggerPercent / 100) * params.aep50_kWh;
  const exit_kWh = (params.exitPercent / 100) * params.aep50_kWh;
  const maxPossibleDeficit_kWh = trigger_kWh - exit_kWh;
  const maxPayout_INR = maxPossibleDeficit_kWh * params.tariff_INR;

  return climateData.map((data) => {
    // Modelled generation from climate data
    // Scale dynamically if user changes capacity or PR from baseline (3kW, 0.80 PR)
    const baseScaling = (params.installedCapacity_kW / 3.0) * (params.performanceRatio / 0.80);
    const scaledAEP_kWh = Math.round(data.modelledAEP_kWh * baseScaling);

    let payout_INR = 0;
    let triggered = false;
    let deficit_kWh = 0;
    let severity: 'None' | 'Mild' | 'Moderate' | 'Severe' = 'None';

    if (scaledAEP_kWh < trigger_kWh) {
      triggered = true;
      deficit_kWh = trigger_kWh - scaledAEP_kWh;
      const cappedDeficit_kWh = Math.min(deficit_kWh, maxPossibleDeficit_kWh);
      payout_INR = Math.round(cappedDeficit_kWh * params.tariff_INR);

      const deficitRatio = (trigger_kWh - scaledAEP_kWh) / trigger_kWh;
      if (deficitRatio > 0.15) severity = 'Severe';
      else if (deficitRatio > 0.08) severity = 'Moderate';
      else severity = 'Mild';
    }

    const baselineRevenue_INR = params.aep50_kWh * params.tariff_INR;
    const actualRevenue_INR = scaledAEP_kWh * params.tariff_INR;
    const financialLossWithoutInsurance_INR = Math.max(0, baselineRevenue_INR - actualRevenue_INR);
    const netCustomerPositionWithInsurance_INR = actualRevenue_INR + payout_INR;

    const lossRatioPercent = params.tariff_INR > 0 && payout_INR > 0
      ? (payout_INR / maxPayout_INR) * 100
      : 0;

    return {
      year: data.year,
      modelledAEP_kWh: scaledAEP_kWh,
      trigger_kWh: Math.round(trigger_kWh),
      exit_kWh: Math.round(exit_kWh),
      deficit_kWh: Math.round(deficit_kWh),
      payout_INR,
      lossRatioPercent: parseFloat(lossRatioPercent.toFixed(1)),
      triggered,
      severity,
      financialLossWithoutInsurance_INR: Math.round(financialLossWithoutInsurance_INR),
      netCustomerPositionWithInsurance_INR: Math.round(netCustomerPositionWithInsurance_INR)
    };
  });
}

/**
 * Calculate comprehensive actuarial metrics, burn cost, and commercial pricing
 */
export function calculateActuarialSummary(
  backtestResults: YearBacktestResult[],
  params: PricingParameters = DEFAULT_PRICING_PARAMS
): ActuarialSummary {
  const n = backtestResults.length;
  const payouts = backtestResults.map((r) => r.payout_INR);
  
  // 1. Pure Burn Cost (Expected Annual Loss Cost)
  const sumPayouts = payouts.reduce((acc, val) => acc + val, 0);
  const pureBurnCost_INR = Math.round(sumPayouts / n);

  // 2. Standard Deviation of Annual Payouts
  const variance = payouts.reduce((acc, val) => acc + Math.pow(val - pureBurnCost_INR, 2), 0) / (n - 1);
  const burnCostStdDev_INR = Math.round(Math.sqrt(variance));

  // 3. Max Single Year Payout
  const maxSingleYearPayout_INR = Math.max(...payouts);

  // 4. Trigger Frequency & Probability
  const triggeredCount = backtestResults.filter((r) => r.triggered).length;
  const payoutFrequency = triggeredCount;
  const triggerProbabilityPercent = parseFloat(((triggeredCount / n) * 100).toFixed(1));

  // 5. Maximum Sum Insured (Per Policy)
  const trigger_kWh = (params.triggerPercent / 100) * params.aep50_kWh;
  const exit_kWh = (params.exitPercent / 100) * params.aep50_kWh;
  const sumInsuredMax_INR = Math.round((trigger_kWh - exit_kWh) * params.tariff_INR);

  // 6. Actuarial Loading Breakdown
  const riskLoading_INR = Math.round(pureBurnCost_INR * (params.riskLoadingPercent / 100));
  const adminExpense_INR = Math.round(pureBurnCost_INR * (params.adminExpensePercent / 100));
  const reinsuranceProfit_INR = Math.round(pureBurnCost_INR * (params.reinsuranceProfitPercent / 100));

  // 7. Commercial Premium
  const commercialPremiumExTax_INR = pureBurnCost_INR + riskLoading_INR + adminExpense_INR + reinsuranceProfit_INR;
  const commercialPremiumWithTax_INR = Math.round(commercialPremiumExTax_INR * (1 + params.taxGSTPercent / 100));

  // 8. Financial ratios
  const premiumRateOnSumInsuredPercent = sumInsuredMax_INR > 0
    ? parseFloat(((commercialPremiumExTax_INR / sumInsuredMax_INR) * 100).toFixed(2))
    : 0;

  const annualSolarRevenue = params.aep50_kWh * params.tariff_INR;
  const premiumAsPercentOfAnnualRevenue = annualSolarRevenue > 0
    ? parseFloat(((commercialPremiumExTax_INR / annualSolarRevenue) * 100).toFixed(2))
    : 0;

  const monthlyEmbeddedEMI_INR = Math.round(commercialPremiumWithTax_INR / 12);

  // 9. Portfolio Metrics (for 10,000 customers)
  const portfolioTotalExposure_INR = sumInsuredMax_INR * params.portfolioSize;
  const portfolioAnnualPremiumPool_INR = commercialPremiumExTax_INR * params.portfolioSize;
  const portfolioHistoricalMaxLoss_INR = maxSingleYearPayout_INR * params.portfolioSize;

  // VaR 95% (1-in-20 year) and VaR 99% (1-in-50/100 year parametric estimate)
  // Empirical sorted payouts:
  const sortedPayouts = [...payouts].sort((a, b) => b - a);
  const var95_Single = sortedPayouts[0]; // Top 1 in 20 years = 5th percentile worst
  const var99_1in20Loss_INR = var95_Single * params.portfolioSize;
  
  // Parametric extreme value approximation for 1-in-50 year event
  const var99_5_Single = Math.min(sumInsuredMax_INR, Math.round(pureBurnCost_INR + 2.33 * burnCostStdDev_INR));
  const var99_5_1in50Loss_INR = var99_5_Single * params.portfolioSize;

  return {
    pureBurnCost_INR,
    burnCostStdDev_INR,
    maxSingleYearPayout_INR,
    payoutFrequency,
    triggerProbabilityPercent,
    sumInsuredMax_INR,
    riskLoading_INR,
    adminExpense_INR,
    reinsuranceProfit_INR,
    commercialPremiumExTax_INR,
    commercialPremiumWithTax_INR,
    premiumRateOnSumInsuredPercent,
    premiumAsPercentOfAnnualRevenue,
    monthlyEmbeddedEMI_INR,
    portfolioTotalExposure_INR,
    portfolioAnnualPremiumPool_INR,
    portfolioHistoricalMaxLoss_INR,
    var99_1in20Loss_INR,
    var99_5_1in50Loss_INR
  };
}

/**
 * Generate Sensitivity Analysis across Trigger Percentages and Tariff rates
 */
export function generateSensitivityMatrix(
  baseParams: PricingParameters = DEFAULT_PRICING_PARAMS
) {
  const triggerSteps = [80, 85, 90, 92, 95];
  const exitSteps = [60, 65, 70, 75];

  return triggerSteps.map((trig) => {
    return exitSteps.map((ext) => {
      if (ext >= trig) return null;
      const testParams = { ...baseParams, triggerPercent: trig, exitPercent: ext };
      const results = runBacktest(ERA5_CLIMATE_DATA, testParams);
      const summary = calculateActuarialSummary(results, testParams);
      return {
        triggerPercent: trig,
        exitPercent: ext,
        burnCost: summary.pureBurnCost_INR,
        commercialPremium: summary.commercialPremiumExTax_INR,
        triggerProbability: summary.triggerProbabilityPercent,
        sumInsured: summary.sumInsuredMax_INR
      };
    }).filter(Boolean);
  });
}
