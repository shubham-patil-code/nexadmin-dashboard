# NexaCare 360 AI — Super Admin Dashboard

React project for the NexaCare 360 AI Hospital Management System — Super Admin Dashboard.

## Setup

```bash
npm install
npm start
```

## Build for production

```bash
npm run build
```

## Tech Stack
- React 18
- Chart.js + react-chartjs-2
- CSS Modules (plain CSS per component)

## Components

| Component | Description |
|---|---|
| `Sidebar` | Navigation with all 24 modules across 5 sections |
| `Topbar` | Header with live badge, role, avatar |
| `KPIGrid` | 4 KPI cards: patients, revenue, bed occupancy, active doctors |
| `RevenueChart` | 7-day bar chart using Chart.js |
| `UserRoles` | Online user count per role with progress bars |
| `ModuleStatus` | Status grid of all 22+ modules |
| `BranchOverview` | Multi-branch / multi-hospital management panel |
| `SystemAlerts` | Live system alerts feed |

## Modules Covered (from NexaCare 360 docs)

Authentication · Dashboard · Patient · Appointment · OPD · IPD · Emergency · Doctor · Nursing · OT/Surgery · Pharmacy · Lab · Radiology · Billing · Insurance/TPA · Inventory · HR & Payroll · Finance · Reports · AI · Social Media · Chat Support · Settings · Mobile App

Built by Shekru Labs — hr@shekruweb.com
