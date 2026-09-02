import { FailureMode } from '../types';

export const PORTFOLIO_FAILURE_MODES: FailureMode[] = [
  {
    id: "spatial_basis_risk",
    title: "Spatial & Micro-Climate Basis Risk (Pixel vs. Rooftop)",
    category: "Meteorological & Resolution Basis Risk",
    rootCause: "ERA5-Land reanalysis uses a ~9×9 km grid cell that averages irradiance across Ahmedabad. It cannot detect localized convective cloud cover, urban heat islands, or construction dust corridors over individual rooftops.",
    portfolioImpact: "15%–18% of customers may experience generation shortfalls during localized overcast while the macro grid remains above the 90% trigger threshold, resulting in ₹0 payout.",
    severityLevel: "High",
    affectedCustomersPercent: 18,
    financialExposure_INR: "₹1.5 Cr – ₹2.0 Cr uncompensated customer deficit",
    proposedImprovement: "Blend ERA5 with INSAT-3D (1 km) geostationary imagery and calibrate with 5 ground pyranometer reference stations across Ahmedabad using Kriging interpolation to cut basis error to <3.5%.",
    implementationComplexity: "Medium"
  },
  {
    id: "grid_curtailment_anti_islanding",
    title: "Grid Curtailment & DISCOM Outage Mismatch",
    category: "Operational & Infrastructure Mismatch",
    rootCause: "Grid-tied inverters automatically trip during local grid outages or voltage fluctuations (anti-islanding). On clear sunny days with a grid cut, the customer generates 0 kWh, but the weather index shows clear skies.",
    portfolioImpact: "Up to 25% of annual customer shortfall events stem from utility grid downtime rather than cloud cover, leaving loan EMIs unprotected since parametric weather criteria are not met.",
    severityLevel: "Critical",
    affectedCustomersPercent: 25,
    financialExposure_INR: "₹2.5 Cr annual loan repayment default risk",
    proposedImprovement: "Deploy smart meter telemetry for a dual-trigger structure: standard weather parametric if grid availability is ≥98%, and a secondary bank/DISCOM-backed micro-rider if grid downtime exceeds 8%.",
    implementationComplexity: "Medium"
  },
  {
    id: "systemic_tail_correlation",
    title: "Regional Tail Correlation & Systemic Solvency Drain",
    category: "Actuarial & Systemic Catastrophe Risk",
    rootCause: "Monsoons and cyclones affect the entire city simultaneously. All 10,000 systems in Pincode 380006 experience simultaneous generation deficits, eliminating standard risk pooling benefits.",
    portfolioImpact: "In a severe monsoon (e.g., 2019), 100% of systems trigger maximum payout, creating a ₹5.29 Cr liability against an annual premium pool of ~₹80 Lakhs (loss ratio >650%).",
    severityLevel: "Critical",
    affectedCustomersPercent: 100,
    financialExposure_INR: "₹5.29 Cr single-season catastrophic liability",
    proposedImprovement: "Structure a 70% Quota-Share reinsurance treaty with international reinsurers plus an aggregate Stop-Loss layer at 140% loss ratio, while expanding geographically across Gujarat.",
    implementationComplexity: "High"
  },
  {
    id: "soiling_and_maintenance_hazard",
    title: "Soiling Degradation & Maintenance Moral Hazard",
    category: "Behavioral & Maintenance Hazard",
    rootCause: "Urban dust and soot reduce panel output by 12%–20% if unwashed. Homeowners might mistakenly assume dirty panel losses are covered by the insurance policy.",
    portfolioImpact: "Unwashed panels degrade long-term solar yield and lender collateral value without triggering parametric weather payouts.",
    severityLevel: "Medium",
    affectedCustomersPercent: 30,
    financialExposure_INR: "₹1.2 Cr lifetime asset yield erosion",
    proposedImprovement: "Enforce parametric invariance (payouts depend strictly on satellite irradiance, not inverter meters) and bundle annual cleaning vouchers directly with the loan EMI.",
    implementationComplexity: "Low"
  }
];
