'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Award, 
  Layers, CheckCircle2, ArrowUpRight, Zap
} from 'lucide-react';
import { 
  HIERARCHY_DATA, SALES_FORECAST_DATA, TEAM_PERFORMANCE_DATA 
} from '../data/mockJmsData';
import CustomSelect, { CustomSelectOption } from './CustomSelect';

const YEAR_OPTIONS: CustomSelectOption[] = [
  { value: '2026', label: 'Year 2026 (Current)' },
  { value: '2025', label: 'Year 2025' },
  { value: '2024', label: 'Year 2024' },
];

const CORP_OPTIONS: CustomSelectOption[] = [
  { value: 'SQ-CORP', label: 'Square Group (Entire Holding)' },
  { value: 'SEC-HOLD', label: 'Square Communications (SEC)' },
  { value: 'DENTSU-SQ', label: 'Dentsu Square Partnership' },
];

export default function Dashboard({ onNavigateJobList }: { onNavigateJobList?: () => void } = {}) {
  const [selectedCorp, setSelectedCorp] = useState('SQ-CORP');
  const [selectedBu, setSelectedBu] = useState('ALL');
  const [selectedSubUnit, setSelectedSubUnit] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [forecastHorizon, setForecastHorizon] = useState<'12m' | '24m'>('24m');

  const availableBus = HIERARCHY_DATA.children || [];

  const availableSubUnits = useMemo(() => {
    if (selectedBu === 'ALL') {
      return availableBus.flatMap(bu => bu.children || []);
    }
    const foundBu = availableBus.find(bu => bu.code === selectedBu);
    return foundBu ? foundBu.children || [] : [];
  }, [availableBus, selectedBu]);

  const handleBuChange = (buCode: string) => {
    setSelectedBu(buCode);
    setSelectedSubUnit('ALL');
  };

  const buOptions: CustomSelectOption[] = useMemo(() => [
    { value: 'ALL', label: 'All Business Units' },
    ...availableBus.map(bu => ({ value: bu.code, label: bu.name }))
  ], [availableBus]);

  const subUnitOptions: CustomSelectOption[] = useMemo(() => [
    { value: 'ALL', label: 'All Teams' },
    ...availableSubUnits.map(sub => ({ value: sub.code, label: sub.name }))
  ], [availableSubUnits]);

  const displayForecastData = useMemo(() => {
    if (forecastHorizon === '12m') {
      return SALES_FORECAST_DATA.slice(12, 24);
    }
    return SALES_FORECAST_DATA;
  }, [forecastHorizon]);

  const maxVal = Math.max(
    ...displayForecastData.map(d => Math.max(d.actual, d.forecast, d.allocateAuto, d.target))
  ) * 1.15;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner Card & Hierarchical Filter */}
      <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Consolidated Executive Reporting
            </span>
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive Operations Dashboard</h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Data
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Consolidated Account & Arito Accounting data: 24-month Sales Forecast, Allocate Auto smoothing & Team Win/Fail KPI.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold shrink-0">Reporting Period:</span>
            <CustomSelect
              variant="pill"
              size="sm"
              value={selectedYear}
              onChange={setSelectedYear}
              options={YEAR_OPTIONS}
              className="w-48"
            />
          </div>
        </div>

        {/* 3-Level Hierarchical Filter Bar */}
        <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100/80">
          <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-blue-800">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Hierarchical Executive Filters (3 Levels):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Level 1: Brand Corp (Holding)
              </label>
              <CustomSelect
                value={selectedCorp}
                onChange={setSelectedCorp}
                options={CORP_OPTIONS}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Level 2: Business Unit (BU)
              </label>
              <CustomSelect
                value={selectedBu}
                onChange={handleBuChange}
                options={buOptions}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Level 3: Sub-unit (Assigned Team)
              </label>
              <CustomSelect
                value={selectedSubUnit}
                onChange={setSelectedSubUnit}
                options={subUnitOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Executive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={onNavigateJobList}
          className={`bg-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-3 ${
            onNavigateJobList ? 'cursor-pointer hover:border-blue-300 group' : ''
          }`}
          title={onNavigateJobList ? 'Click to view Jobs List' : undefined}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider group-hover:underline">Active Running Jobs</span>
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline justify-between">
              <span>42 <span className="text-sm font-semibold text-slate-400">jobs</span></span>
              {onNavigateJobList && (
                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  View all →
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% YoY vs 2025</span>
            </div>
          </div>
          <div className="pt-2 border-t border-blue-50 flex items-center justify-between text-[11px] text-slate-500">
            <span>Bidding stage:</span>
            <strong className="text-amber-600 font-bold">18 jobs</strong>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total Pipeline Budget</span>
            <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-200">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight">
              148.5 <span className="text-sm font-semibold text-slate-500">Bil ₫</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Contracted: 112.8 Bil ₫</span>
            </div>
          </div>
          <div className="pt-2 border-t border-blue-50 flex items-center justify-between text-[11px] text-slate-500">
            <span>Briefed potential:</span>
            <strong className="text-blue-600 font-bold">35.7 Bil ₫</strong>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Actual Revenue</span>
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
              96.2 <span className="text-sm font-semibold text-slate-500">Bil ₫</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Collected: 88.4 Bil ₫</span>
            </div>
          </div>
          <div className="pt-2 border-t border-blue-50 flex items-center justify-between text-[11px] text-slate-500">
            <span>Receivables:</span>
            <strong className="text-amber-600 font-bold">7.8 Bil ₫</strong>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Win Rate & GP</span>
            <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs border border-purple-200">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-900 tracking-tight">
              75.8% <span className="text-xs font-semibold text-slate-400">Win Rate</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-bold mt-1">
              <span>Avg Gross Profit: <strong>31.8%</strong></span>
            </div>
          </div>
          <div className="pt-2 border-t border-blue-50 flex items-center justify-between text-[11px] text-slate-500">
            <span>Won 86 of 113 bids</span>
            <strong className="text-emerald-600 font-bold">+3.5%</strong>
          </div>
        </div>
      </div>

      {/* ==================== CHART 1: SALES FORECAST 2 YEARS & ALLOCATE AUTO ==================== */}
      <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Financial Forecasting</span>
            <div className="flex items-center gap-2 mt-0.5">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-extrabold text-slate-900">
                24-Month Sales Forecast & Automated Cost Allocation (Allocate Auto)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              2-year rolling revenue forecast coupled with automated monthly cost allocation (smoothing) to reflect true profit margins
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center bg-blue-50/70 p-1 rounded-full text-xs font-semibold text-slate-600 border border-blue-100">
              <button
                type="button"
                onClick={() => setForecastHorizon('12m')}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  forecastHorizon === '12m' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-blue-700'
                }`}
              >
                12 Months (2026)
              </button>
              <button
                type="button"
                onClick={() => setForecastHorizon('24m')}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  forecastHorizon === '24m' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-blue-700'
                }`}
              >
                24 Months (2025 - 2026)
              </button>
            </div>

            <div className="hidden xl:flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="text-slate-600">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-200 border border-blue-400"></span>
                <span className="text-slate-600">Forecast</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-amber-500 rounded-full"></span>
                <span className="text-slate-600">Allocate Auto (Cost)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Bar & Line Chart Representation */}
        <div className="h-72 w-full pt-4 relative">
          <div className="h-full flex items-end justify-between gap-1.5 sm:gap-2 border-b border-blue-100 pb-2">
            {displayForecastData.map((d) => {
              const actualH = (d.actual / maxVal) * 100;
              const forecastH = (d.forecast / maxVal) * 100;
              const allocateH = (d.allocateAuto / maxVal) * 100;
              const isFuture = d.actual === 0;

              return (
                <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col p-2.5 bg-slate-900 text-white rounded-xl text-[11px] shadow-xl z-20 pointer-events-none whitespace-nowrap">
                    <span className="font-extrabold text-blue-300">{d.month}</span>
                    {d.actual > 0 ? (
                      <span>Actual Revenue: <strong>{d.actual} Bil ₫</strong></span>
                    ) : (
                      <span>Forecast: <strong>{d.forecast} Bil ₫</strong></span>
                    )}
                    <span className="text-amber-300">Allocated Cost: <strong>{d.allocateAuto} Bil ₫</strong></span>
                    <span className="text-emerald-300">Est. Margin: <strong>{((isFuture ? d.forecast : d.actual) - d.allocateAuto).toFixed(1)} Bil ₫</strong></span>
                  </div>

                  <div className="w-full flex items-end justify-center relative h-full">
                    <div 
                      style={{ height: `${forecastH}%` }}
                      className={`w-full max-w-[18px] rounded-t-md transition-all ${
                        isFuture 
                          ? 'bg-blue-200 border border-dashed border-blue-400 group-hover:bg-blue-300' 
                          : 'bg-blue-100/80'
                      }`}
                    />

                    {d.actual > 0 && (
                      <div 
                        style={{ height: `${actualH}%` }}
                        className="absolute bottom-0 w-full max-w-[18px] bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md group-hover:from-blue-800 group-hover:to-blue-600 transition-all shadow-xs"
                      />
                    )}

                    <div 
                      style={{ bottom: `${allocateH}%` }}
                      className="absolute w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white shadow-xs z-10 -translate-y-1/2"
                      title={`Allocate Cost: ${d.allocateAuto} Bil ₫`}
                    />
                  </div>

                  <span className="text-[10px] text-slate-500 mt-2 font-semibold tracking-tighter truncate max-w-full">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="absolute left-0 top-0 text-[10px] text-blue-400 font-mono font-bold">
            {maxVal.toFixed(0)} Bil VND
          </div>
        </div>

        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
          <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Automated Cost Allocation (Allocate Auto):</strong> The Arito system automatically smoothes cost budgets across the project lifecycle, giving Square Group leadership accurate monthly profit visibility without artificial timing distortions from delayed invoicing.
          </div>
        </div>
      </div>

      {/* ==================== TEAM PERFORMANCE & WIN/FAIL ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Team Performance</span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Team Performance & Win/Fail Ratio</span>
              </h2>
            </div>

            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Year {selectedYear}
            </span>
          </div>

          <div className="overflow-x-auto border border-blue-100 rounded-2xl text-xs custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50/70 text-blue-900/80 uppercase font-semibold border-b border-blue-100">
                  <th className="py-3.5 px-4">Team</th>
                  <th className="py-3.5 px-4 text-center">Won</th>
                  <th className="py-3.5 px-4 text-center">Running</th>
                  <th className="py-3.5 px-4 text-center">Bidding</th>
                  <th className="py-3.5 px-4 text-center">Failed</th>
                  <th className="py-3.5 px-4 text-right">Revenue (Bil ₫)</th>
                  <th className="py-3.5 px-4 text-center">Avg GP</th>
                  <th className="py-3.5 px-4 text-center">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {TEAM_PERFORMANCE_DATA.map((t) => (
                  <tr key={t.team} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span>{t.team}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {t.wonJobs}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {t.runningJobs}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-amber-600 font-bold">
                      {t.biddingJobs}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400">
                      {t.failedJobs}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                      {t.revenue} Bil
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                      {t.gpAvg}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-extrabold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-0.5 rounded-full">
                        {t.winRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Service Breakdown</span>
            <h2 className="text-base font-extrabold text-slate-900">Revenue by Discipline</h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1.5">
                <span className="text-slate-700">Events & Activations</span>
                <span className="text-blue-700">45.0% (66.8 Bil ₫)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1.5">
                <span className="text-slate-700">Retail Experience & POSM</span>
                <span className="text-indigo-700">28.5% (42.3 Bil ₫)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full w-[28.5%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1.5">
                <span className="text-slate-700">Creative Campaign & Content</span>
                <span className="text-emerald-700">16.5% (24.5 Bil ₫)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[16.5%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1.5">
                <span className="text-slate-700">Digital Marketing & Social</span>
                <span className="text-amber-700">10.0% (14.9 Bil ₫)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[10%]" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-50 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">Overall Job Status (YTD):</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl flex justify-between">
                <span className="text-slate-500 font-medium">Completed:</span>
                <strong className="text-emerald-600 font-bold">54%</strong>
              </div>
              <div className="p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl flex justify-between">
                <span className="text-slate-500 font-medium">Running:</span>
                <strong className="text-blue-600 font-bold">32%</strong>
              </div>
              <div className="p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl flex justify-between">
                <span className="text-slate-500 font-medium">Bidding:</span>
                <strong className="text-amber-600 font-bold">9%</strong>
              </div>
              <div className="p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl flex justify-between">
                <span className="text-slate-500 font-medium">Cancelled:</span>
                <strong className="text-slate-400 font-bold">5%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
