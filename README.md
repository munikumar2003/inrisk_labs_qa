# InRisk Labs — Parametric Solar Underwriting & Pricing Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

An institutional-grade quantitative actuarial workbench and interactive decision engine designed to price, backtest, and stress-test **parametric weather insurance contracts** protecting residential solar photovoltaic (PV) assets in urban India.

---

## 🎯 Executive Overview & Case Study Scope

Residential solar rooftop installations in emerging markets face climate-driven solar irradiance deficits. When extended overcast conditions or abnormal monsoons reduce generation, household solar savings plunge below scheduled loan debt-service obligations, causing loan defaults.

This platform implements a parametric weather insurance model for a benchmark **3.0 kVA grid-connected residential rooftop system** located in **Ahmedabad, Gujarat (Pincode: 380006)**.

```
ERA5-Land Climate Data (2005–2024) ──▶ PV Physics Model (GHI & Temp) ──▶ Burn Cost & Loading Engine ──▶ Automated T+5 Loan Payout
```

### Key Analytical Deliverables

| Metric / Parameter | Value | Description |
| :--- | :--- | :--- |
| **Asset Specification** | `3.0 kVA DC` | Crystalline silicon rooftop array (Tilt: 23.018° N) |
| **System Performance Ratio (PR)** | `80.0%` | Inverter efficiency, cabling resistance, and baseline soiling |
| **Baseline Expected Generation (P50)** | `4,600 kWh/yr` | Equivalent to ~5.25 Peak Sun Hours (PSH) per day |
| **Index Trigger Threshold ($K_T$)** | `90.0% (4,140 kWh)` | Policy triggers payout when annual yield drops below 4,140 kWh |
| **Exit Floor / Maximum Cap ($K_E$)** | `70.0% (3,220 kWh)` | Maximum sum insured indemnification ceiling |
| **Tick Rate (Grid Tariff)** | `₹5.75 / kWh` | Ahmedabad residential net-metering grid injection rate |
| **Maximum Sum Insured** | `₹5,290 / policy` | $(K_T - K_E) \times \text{Tariff} = 920 \text{ kWh} \times ₹5.75$ |
| **Pure Actuarial Burn Cost** | `₹78.20 / yr` | 20-year mean historical loss expectation |
| **Gross Retail Commercial Premium** | `₹137 / yr` | Inclusive of 25% risk, 15% admin, 15% reins, & 18% GST |
| **Loan EMI Surcharge** | `₹11 / month` | Embedded surcharge on baseline ₹3,200/mo loan (+0.36%) |

---

## 🏗️ Core Modules & Capabilities

### 1. 🎛️ Interactive Pricing Studio & Sensitivity Matrix
- **Real-Time Actuarial Recalculations**: Adjust strike triggers (80%–98%), exit caps (50%–85%), grid tariffs (₹4.00–₹9.00/kWh), and performance ratios with immediate burn cost and gross premium recomputation.
- **Actuarial Loading Breakdown**: Transparent waterfall decomposition covering pure burn cost, climate volatility reserve (25%), bank distribution cost (15%), reinsurer margin (15%), and GST (18%).
- **Loan Repayment Protection Curve**: Comparative cash flow visualization of unhedged household revenue versus hedged positions with parametric indemnity.
- **Sensitivity Matrix Grid**: Cross-tabulated sensitivity matrix mapping Pure Burn Cost and Commercial Premium across varying trigger and exit thresholds.

### 2. ☀️ 20-Year ERA5-Land Climate Explorer (2005–2024)
- **Copernicus Reanalysis Dataset**: 20 years of hourly surface solar radiation downwards (`ssrd`), 2m ambient air temperature (`2t`), total precipitation (`tp`), and total cloud cover (`tcc`) across Ahmedabad (`23.018° N, 72.568° E`).
- **Interactive Multi-Variable Timeline**: Synchronized visualization of annual GHI ($kWh/m^2$), temperature-derated PV yield ($kWh$), monsoon precipitation ($mm$), and payout occurrence history.
- **Monthly Seasonality Heatmap**: Granular 12-month breakdown capturing peak generation months (March–May) vs. monsoon irradiance dips (July–August).

### 3. 🛡️ 10,000 Customer Portfolio Stress-Testing & Critique
- **Catastrophic Tail Accumulation**: Evaluates systemic correlation during severe monsoons (e.g., 2019 replay) with a gross PML liability of **₹5.29 Crore** against an annual premium pool of **₹80.5 Lakhs** (loss ratio >650%).
- **Primary Operational Failure Modes**:
  - *Spatial & Micro-Climate Basis Risk*: ~9 km ERA5 grid resolution vs. individual rooftop divergence mitigated via geostationary INSAT-3D blending and local pyranometer ground calibration.
  - *Grid Curtailment & Anti-Islanding Inverter Trips*: DISCOM feeder shutdowns addressed via smart meter telemetry and dual-trigger availability riders.
  - *Soiling Degradation & Maintenance Moral Hazard*: Preserved via pure parametric invariance and bundled annual cleaning maintenance vouchers.
- **Reinsurance & Solvency Architecture**: Structure model for a 70% Quota-Share treaty combined with an aggregate Stop-Loss layer attaching at a 140% loss ratio to maintain IRDAI capital compliance.

### 4. 📐 Mathematical & Physical Formulations

#### Photovoltaic Conversion Physics
$$E_d = P_{\text{STC}} \times \left(\frac{\text{GHI}_d}{G_{\text{STC}}}\right) \times \text{PR} \times \left[1 - \gamma \cdot (T_{\text{cell},d} - 25^\circ\text{C})\right]$$

#### Sandia / NOCT Cell Temperature Formulation
$$T_{\text{cell},d} = T_{\text{ambient},d} + \left(\frac{\text{NOCT} - 20^\circ\text{C}}{800}\right) \times \text{GHI}_d$$

#### Parametric Payout Step-Function
$$\text{Payout}(I) = \begin{cases} 0, & \text{if } I \ge K_T \\ (K_T - I) \times \text{Tariff}, & \text{if } K_E < I < K_T \\ (K_T - K_E) \times \text{Tariff} = \text{Max Payout}, & \text{if } I \le K_E \end{cases}$$

#### Actuarial Premium Loading Formula
$$\text{Premium}_{\text{Commercial}} = \text{BurnCost} \times (1 + \lambda_{\text{risk}} + \lambda_{\text{admin}} + \lambda_{\text{reins}}) \times (1 + \text{GST})$$

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun** / **yarn** / **pnpm**
- **Python 3**: (optional, for running standalone analytics scripts or rebuilding archives)

### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/your-username/inrisk-parametric-solar-pricing.git
cd inrisk-parametric-solar-pricing

# 2. Install dependencies
npm install

# 3. Launch the development server
npm run dev
```

Visit `http://localhost:3000` in your browser to view the interactive studio.

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Boots the Vite development server on `http://localhost:3000` |
| `npm run build` | Compiles the production bundle into `/dist` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript compiler checks (`tsc --noEmit`) |
| `npm run zip` | Regenerates the clean standalone `project.zip` archive |

---

## 📂 Project Architecture

```
├── index.html                   # HTML entry point with meta tags
├── package.json                 # Dependencies & automation scripts
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite bundler configuration with Tailwind plugin
├── create_zip.py                # Standalone script for creating clean zip archives
├── project.zip                  # Extractable codebase archive
├── public/                      # Static assets & reports
└── src/
    ├── main.tsx                 # React application root entry point
    ├── App.tsx                  # Main layout container & tab routing
    ├── types.ts                 # Shared TypeScript interfaces & types
    ├── index.css                # Global stylesheet with Tailwind CSS
    ├── components/
    │   ├── Navbar.tsx           # Navigation header, export actions & PDF trigger
    │   ├── InteractivePricingStudio.tsx # Real-time actuarial sliders & charts
    │   ├── ClimateDataExplorer.tsx      # 2005–2024 ERA5 climate visualizer
    │   ├── PortfolioRiskCritique.tsx    # 10,000 portfolio scaling & failure modes
    │   └── CodeAndWorkings.tsx          # Mathematical proofs & Python scripts
    ├── data/
    │   ├── era5ClimateData.ts   # 20-year hourly ERA5-Land climate dataset
    │   ├── failureModes.ts      # Structured failure mode critique & mitigations
    │   └── pythonCode.ts        # Copernicus CDS API pipeline scripts
    ├── utils/
    │   ├── actuarialEngine.ts   # Core burn cost, pricing & sensitivity engine
    │   ├── pdfGenerator.ts      # Multi-page executive PDF report builder (jsPDF)
    │   └── exportReport.ts      # Markdown & HTML export generators
    └── docs/
        └── InRisk_Labs_Case_Study_Report.md # Full academic case study documentation
```

---

## 📊 Tech Stack

- **Frontend & Core Engine**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Document Exporting**: [jsPDF](https://github.com/parallax/jsPDF) vector rendering engine
- **Climate Data Pipeline**: Copernicus CDS API (`era5-land`) Python specifications

---

## 📄 License & Attribution

Distributed under the MIT License. Developed for quantitative risk research and parametric weather underwriting analysis. Data sourced from the European Centre for Medium-Range Weather Forecasts (**ECMWF**) Copernicus Climate Data Store (ERA5-Land reanalysis).
