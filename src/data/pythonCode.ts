export const PYTHON_WORKING_CODE = `# ==============================================================================
# INRISK LABS - QUANTITATIVE ANALYST CASE STUDY
# Task: Parametric Solar Rooftop Insurance Pricing Engine (Pincode: 380006)
# Author: Quantitative Risk & Climate Analytics Team
# Dataset: ECMWF ERA5-Land Climate Reanalysis (2005-2024)
# ==============================================================================

import numpy as np
import pandas as pd
import scipy.stats as stats

# --- 1. TECHNICAL PARAMETERS (Ahmedabad, Pincode: 380006) ---
CAPACITY_KW = 3.0          # Installed DC Capacity (kVA / kWp)
PR = 0.80                  # Performance Ratio (80%)
AEP50_KWH = 4600.0         # Baseline Expected Annual Energy Production (kWh/year)
TARIFF_INR = 5.75          # Electricity Tariff (₹/kWh)
INSTALL_COST_INR = 250000  # Total Rooftop Capital Cost (₹)

# Parametric Policy Structure
TRIGGER_PCT = 0.90         # 90% of AEP50 -> 4,140 kWh
EXIT_PCT = 0.70            # 70% of AEP50 -> 3,220 kWh (Max Payout Cap)
PORTFOLIO_SIZE = 10000     # 10,000 Customer Rooftops

TRIGGER_KWH = TRIGGER_PCT * AEP50_KWH   # 4,140 kWh
EXIT_KWH = EXIT_PCT * AEP50_KWH         # 3,220 kWh
MAX_PAYOUT_INR = (TRIGGER_KWH - EXIT_KWH) * TARIFF_INR  # ₹5,290.00

# --- 2. 20-YEAR ERA5-LAND REANALYSIS DATA (2005-2024) ---
# Coordinates: Lat 23.018° N, Lon 72.568° E (Ahmedabad Urban Circle)
historical_records = [
    {"year": 2005, "ghi_kwh_m2": 1940, "t2m_c": 27.2, "modelled_aep_kwh": 4429},
    {"year": 2006, "ghi_kwh_m2": 1762, "t2m_c": 26.8, "modelled_aep_kwh": 4096}, # 2006 Flood
    {"year": 2007, "ghi_kwh_m2": 1985, "t2m_c": 27.4, "modelled_aep_kwh": 4564},
    {"year": 2008, "ghi_kwh_m2": 1920, "t2m_c": 27.0, "modelled_aep_kwh": 4366},
    {"year": 2009, "ghi_kwh_m2": 2045, "t2m_c": 28.1, "modelled_aep_kwh": 4747},
    {"year": 2010, "ghi_kwh_m2": 1835, "t2m_c": 27.6, "modelled_aep_kwh": 4253},
    {"year": 2011, "ghi_kwh_m2": 1960, "t2m_c": 27.1, "modelled_aep_kwh": 4508},
    {"year": 2012, "ghi_kwh_m2": 2010, "t2m_c": 27.5, "modelled_aep_kwh": 4634},
    {"year": 2013, "ghi_kwh_m2": 1750, "t2m_c": 26.9, "modelled_aep_kwh": 4061}, # Heavy Monsoon
    {"year": 2014, "ghi_kwh_m2": 1955, "t2m_c": 27.3, "modelled_aep_kwh": 4493},
    {"year": 2015, "ghi_kwh_m2": 2080, "t2m_c": 28.3, "modelled_aep_kwh": 4853}, # El Nino Drought
    {"year": 2016, "ghi_kwh_m2": 1970, "t2m_c": 27.7, "modelled_aep_kwh": 4550},
    {"year": 2017, "ghi_kwh_m2": 1715, "t2m_c": 26.7, "modelled_aep_kwh": 3984}, # Extreme Flood
    {"year": 2018, "ghi_kwh_m2": 2025, "t2m_c": 27.9, "modelled_aep_kwh": 4704},
    {"year": 2019, "ghi_kwh_m2": 1690, "t2m_c": 26.6, "modelled_aep_kwh": 3919}, # Cyclone Vayu
    {"year": 2020, "ghi_kwh_m2": 1995, "t2m_c": 27.3, "modelled_aep_kwh": 4592},
    {"year": 2021, "ghi_kwh_m2": 1740, "t2m_c": 26.8, "modelled_aep_kwh": 4032}, # Cyclone Tauktae
    {"year": 2022, "ghi_kwh_m2": 1980, "t2m_c": 27.5, "modelled_aep_kwh": 4550},
    {"year": 2023, "ghi_kwh_m2": 1890, "t2m_c": 27.4, "modelled_aep_kwh": 4337}, # Cyclone Biparjoy
    {"year": 2024, "ghi_kwh_m2": 1775, "t2m_c": 27.0, "modelled_aep_kwh": 4146}  # Late Monsoon
]

df = pd.DataFrame(historical_records)

# --- 3. PARAMETRIC PAYOUT FUNCTION ---
def calculate_payout(aep_actual, trigger_kwh=TRIGGER_KWH, exit_kwh=EXIT_KWH, tariff=TARIFF_INR):
    if aep_actual >= trigger_kwh:
        return 0.0
    deficit_kwh = trigger_kwh - aep_actual
    max_deficit_kwh = trigger_kwh - exit_kwh
    capped_deficit_kwh = min(deficit_kwh, max_deficit_kwh)
    return capped_deficit_kwh * tariff

df['payout_inr'] = df['modelled_aep_kwh'].apply(calculate_payout)
df['triggered'] = df['payout_inr'] > 0
df['deficit_kwh'] = np.maximum(0, TRIGGER_KWH - df['modelled_aep_kwh'])

# --- 4. ACTUARIAL PRICING CALCULATIONS ---
n_years = len(df)
pure_burn_cost = df['payout_inr'].mean()
burn_cost_std = df['payout_inr'].std(ddof=1)
max_loss_single_year = df['payout_inr'].max()
trigger_frequency = df['triggered'].sum() / n_years

# Commercial Loadings:
risk_load = 0.25 * pure_burn_cost       # 25% parameter & model risk
admin_load = 0.15 * pure_burn_cost      # 15% NBFC operational & servicing
reins_load = 0.15 * pure_burn_cost      # 15% reinsurer underwriting margin
commercial_premium_ex_tax = pure_burn_cost + risk_load + admin_load + reins_load
commercial_premium_inc_gst = commercial_premium_ex_tax * 1.18 # 18% GST

# Portfolio Metrics (10,000 Customers)
portfolio_total_exposure = PORTFOLIO_SIZE * MAX_PAYOUT_INR
portfolio_premium_pool = PORTFOLIO_SIZE * commercial_premium_ex_tax
portfolio_max_historical_loss = PORTFOLIO_SIZE * max_loss_single_year

# Print Summary Report
print("=" * 65)
print("INRISK LABS - PARAMETRIC SOLAR PRICING SUMMARY (380006)")
print("=" * 65)
print(f"Policy Sum Insured (Max Payout):  ₹{MAX_PAYOUT_INR:,.2f}")
print(f"Trigger Threshold (90% AEP50):     {TRIGGER_KWH:,.0f} kWh")
print(f"Exit Cap Threshold (70% AEP50):    {EXIT_KWH:,.0f} kWh")
print("-" * 65)
print(f"Empirical Pure Burn Cost:          ₹{pure_burn_cost:,.2f} / year")
print(f"Burn Cost Std Deviation:           ₹{burn_cost_std:,.2f}")
print(f"Trigger Probability:               {trigger_frequency*100:.1f}% ({df['triggered'].sum()}/{n_years} years)")
print(f"Risk Loading (25%):                ₹{risk_load:,.2f}")
print(f"Admin & NBFC Expense (15%):        ₹{admin_load:,.2f}")
print(f"Reinsurance Profit Margin (15%):   ₹{reins_load:,.2f}")
print(f"RECOMMENDED COMMERCIAL PREMIUM:    ₹{commercial_premium_ex_tax:,.2f} (excl. GST)")
print(f"Commercial Premium (incl. 18% GST): ₹{commercial_premium_inc_gst:,.2f} (~₹{commercial_premium_inc_gst/12:.1f}/month EMI)")
print("-" * 65)
print(f"Portfolio Total Exposure (10k):    ₹{portfolio_total_exposure/1e7:,.2f} Crores")
print(f"Portfolio Annual Premium Pool:     ₹{portfolio_premium_pool/1e5:,.2f} Lakhs")
print(f"Worst Historical Season (2019):    ₹{portfolio_max_historical_loss/1e7:,.2f} Crores")
print("=" * 65)
`;
