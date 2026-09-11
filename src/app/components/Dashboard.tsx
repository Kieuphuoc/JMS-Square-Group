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
      {/* ==================== TOP HERO BANNER & HIERARCHICAL FILTER ==================== */}
      <div className="relative overflow-hidden rounded-[32px] p-6 sm:p-8 bg-gradient-to-r from-[#FDF2F2] via-[#FDE8E8] to-[#FCD9D7] border border-[#D0342A]/20 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5">
        {/* Subtle decorative Square brand wave background element */}
        <div className="absolute -right-8 -bottom-10 w-64 h-64 opacity-25 pointer-events-none">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#D0342A]/20">
            <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,41.9C64.8,54.7,53.8,65.7,40.7,72.8C27.6,79.8,13.8,82.9,-0.6,83.9C-15,84.9,-30,83.8,-43.3,77.1C-56.6,70.4,-68.2,58,-76.3,44C-84.4,30,-89,15,-88.4,0.3C-87.8,-14.3,-82,-28.7,-73.4,-41.6C-64.8,-54.5,-53.4,-66,-40,-73.5C-26.6,-81,-13.3,-84.5,0.7,-85.7C14.7,-86.9,29.4,-85.8,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-[10px] font-black text-[#D0342A] bg-white/80 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider inline-block shadow-2xs">
              Consolidated Executive Reporting
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A0A0C] tracking-tight">
                Executive Operations Dashboard
              </h1>
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#1A0A0C] text-white shadow-2xs">
                Live Data
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#1A0A0C]/70 mt-1 font-medium max-w-2xl leading-relaxed">
              Consolidated Account & Arito Accounting data: 24-month Sales Forecast, Allocate Auto smoothing & Team Win/Fail KPI.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs relative z-10">
            <span className="text-slate-600 font-bold shrink-0">Reporting Period:</span>
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

        {/* 3-Level Hierarchical Filter Bar (Bento Container) */}
        <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-md rounded-[24px] border border-[#D0342A]/15 shadow-2xs relative z-10">
          <div className="flex items-center gap-2 mb-3 text-xs font-black text-[#1A0A0C]">
            <Layers className="w-4 h-4 text-[#D0342A]" />
            <span>Hierarchical Executive Filters (3 Levels):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Level 1: Brand Corp (Holding)
              </label>
              <CustomSelect
                value={selectedCorp}
                onChange={setSelectedCorp}
                options={CORP_OPTIONS}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Level 2: Business Unit (BU)
              </label>
              <CustomSelect
                value={selectedBu}
                onChange={handleBuChange}
                options={buOptions}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
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

      {/* ==================== TOP 4 KPI EXECUTIVE BENTO CARDS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div 
          onClick={onNavigateJobList}
          className={`bg-white p-6 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all space-y-3 ${
            onNavigateJobList ? 'cursor-pointer group' : ''
          }`}
          title={onNavigateJobList ? 'Click to view Jobs List' : undefined}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-[#D0342A] transition-colors">
              Active Running Jobs
            </span>
            <span className="w-9 h-9 rounded-full bg-[#FDF2F2] text-[#D0342A] flex items-center justify-center font-bold text-xs border border-[#D0342A]/20 group-hover:bg-[#1A0A0C] group-hover:text-white transition-colors">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline justify-between">
              <span>42 <span className="text-sm font-semibold text-slate-400">jobs</span></span>
              {onNavigateJobList && (
                <span className="text-xs font-black text-[#D0342A] group-hover:translate-x-0.5 transition-transform">
                  View all →
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% YoY vs 2025</span>
            </div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Bidding stage:</span>
            <strong className="text-amber-700 font-black">18 jobs</strong>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-br from-[#FDF2F2] to-[#FDE8E8] p-6 rounded-[24px] border border-[#D0342A]/20 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#D0342A] uppercase tracking-wider">
              Total Pipeline Budget
            </span>
            <span className="w-9 h-9 rounded-full bg-white/90 text-[#D0342A] flex items-center justify-center font-bold text-xs border border-[#D0342A]/20 shadow-2xs">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1A0A0C] tracking-tight">
              148.5 <span className="text-sm font-semibold text-[#1A0A0C]/70">Bil ₫</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Contracted: 112.8 Bil ₫</span>
            </div>
          </div>
          <div className="pt-2.5 border-t border-[#D0342A]/15 flex items-center justify-between text-[11px] text-[#1A0A0C]/70 font-medium">
            <span>Briefed potential:</span>
            <strong className="text-[#D0342A] font-black">35.7 Bil ₫</strong>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Actual Revenue
            </span>
            <span className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight">
              96.2 <span className="text-sm font-semibold text-slate-400">Bil ₫</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Collected: 88.4 Bil ₫</span>
            </div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Receivables:</span>
            <strong className="text-amber-700 font-black">7.8 Bil ₫</strong>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#f6f6f9] p-6 rounded-[24px] border border-black/[0.04] hover:shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Win Rate & GP
            </span>
            <span className="w-9 h-9 rounded-full bg-white text-[#1A0A0C] flex items-center justify-center font-bold text-xs border border-slate-200/60 shadow-2xs">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              75.8% <span className="text-xs font-semibold text-slate-400">Win Rate</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#D0342A] font-bold mt-1">
              <span>Avg Gross Profit: <strong>31.8%</strong></span>
            </div>
          </div>
          <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Won 86 of 113 bids</span>
            <strong className="text-emerald-700 font-black">+3.5%</strong>
          </div>
        </div>
      </div>

      {/* ==================== CHART 1: SALES FORECAST 2 YEARS & ALLOCATE AUTO ==================== */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-black/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-[#D0342A] bg-[#FDF2F2] px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Financial Forecasting
            </span>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-5 h-5 text-[#D0342A]" />
              <h2 className="text-base font-black text-slate-900">
                24-Month Sales Forecast & Automated Cost Allocation (Allocate Auto)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              2-year rolling revenue forecast coupled with automated monthly cost allocation (smoothing) to reflect true profit margins
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Segmented Horizon Switcher */}
            <div className="inline-flex items-center bg-[#f6f6f9] p-1 rounded-full text-xs font-semibold border border-black/[0.04]">
              <button
                type="button"
                onClick={() => setForecastHorizon('12m')}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  forecastHorizon === '12m' 
                    ? 'bg-[#1A0A0C] text-white shadow-xs font-bold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                12 Months (2026)
              </button>
              <button
                type="button"
                onClick={() => setForecastHorizon('24m')}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  forecastHorizon === '24m' 
                    ? 'bg-[#1A0A0C] text-white shadow-xs font-bold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                24 Months (2025 - 2026)
              </button>
            </div>

            <div className="hidden xl:flex items-center gap-3 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#E5635B] to-[#D0342A]"></span>
                <span className="text-slate-700">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FDE8E8] border border-[#D0342A]/30"></span>
                <span className="text-slate-700">Forecast</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-amber-500 rounded-full"></span>
                <span className="text-slate-700">Allocate Auto (Cost)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Bar & Line Chart Representation */}
        <div className="h-72 w-full pt-4 relative">
          <div className="h-full flex items-end justify-between gap-1.5 sm:gap-2 border-b border-slate-100 pb-2">
            {displayForecastData.map((d) => {
              const actualH = (d.actual / maxVal) * 100;
              const forecastH = (d.forecast / maxVal) * 100;
              const allocateH = (d.allocateAuto / maxVal) * 100;
              const isFuture = d.actual === 0;

              return (
                <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col p-3 bg-[#1A0A0C] text-white rounded-[16px] text-[11px] shadow-xl z-20 pointer-events-none whitespace-nowrap">
                    <span className="font-black text-[#FCD9D7]">{d.month}</span>
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
                      className={`w-full max-w-[18px] rounded-t-lg transition-all ${
                        isFuture 
                          ? 'bg-[#FDE8E8] border border-dashed border-[#D0342A]/30 group-hover:bg-[#FCD9D7]' 
                          : 'bg-[#FDF2F2]'
                      }`}
                    />

                    {d.actual > 0 && (
                      <div 
                        style={{ height: `${actualH}%` }}
                        className="absolute bottom-0 w-full max-w-[18px] bg-gradient-to-t from-[#B72A21] to-[#E5635B] rounded-t-lg group-hover:from-[#D0342A] group-hover:to-[#F28B82] transition-all shadow-xs"
                      />
                    )}

                    <div 
                      style={{ bottom: `${allocateH}%` }}
                      className="absolute w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white shadow-xs z-10 -translate-y-1/2"
                      title={`Allocate Cost: ${d.allocateAuto} Bil ₫`}
                    />
                  </div>

                  <span className="text-[10px] text-slate-400 mt-2 font-bold tracking-tighter truncate max-w-full font-mono">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="absolute left-0 top-0 text-[10px] text-[#D0342A] font-mono font-bold">
            {maxVal.toFixed(0)} Bil VND
          </div>
        </div>

        <div className="p-4 bg-[#f6f6f9] border border-black/[0.04] rounded-[20px] flex items-start gap-3 text-xs text-slate-700">
          <Zap className="w-4 h-4 text-[#D0342A] shrink-0 mt-0.5" />
          <div className="font-medium">
            <strong className="font-bold text-slate-900">Automated Cost Allocation (Allocate Auto):</strong> The Arito system automatically smoothes cost budgets across the project lifecycle, giving Square Group leadership accurate monthly profit visibility without artificial timing distortions from delayed invoicing.
          </div>
        </div>
      </div>

      {/* ==================== TEAM PERFORMANCE & WIN/FAIL ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-[28px] border border-black/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-[#D0342A] bg-[#FDF2F2] px-3 py-1 rounded-full uppercase tracking-wider block mb-1">
                Team Performance
              </span>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#D0342A]" />
                <span>Team Performance & Win/Fail Ratio</span>
              </h2>
            </div>

            <span className="text-xs font-black text-[#D0342A] bg-[#FDF2F2] border border-[#D0342A]/20 px-3.5 py-1 rounded-full">
              Year {selectedYear}
            </span>
          </div>

          <div className="overflow-x-auto border border-black/[0.04] rounded-[22px] bg-white text-xs custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f6f6f9] text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
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
              <tbody className="divide-y divide-slate-100">
                {TEAM_PERFORMANCE_DATA.map((t) => (
                  <tr key={t.team} className="hover:bg-[#fafafc] transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D0342A]"></span>
                      <span>{t.team}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                        {t.wonJobs}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-[#1A0A0C] bg-[#f6f6f9] px-2.5 py-0.5 rounded-full border border-slate-200/60">
                        {t.runningJobs}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-amber-700 font-bold">
                      {t.biddingJobs}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                      {t.failedJobs}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {t.revenue} Bil
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                      {t.gpAvg}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-black text-[#D0342A] bg-[#FDF2F2] border border-[#D0342A]/20 px-3 py-0.5 rounded-full">
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
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-[28px] border border-black/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
          <div>
            <span className="text-[10px] font-extrabold text-[#D0342A] bg-[#FDF2F2] px-3 py-1 rounded-full uppercase tracking-wider block mb-1">
              Service Breakdown
            </span>
            <h2 className="text-base font-black text-slate-900">Revenue by Discipline</h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1.5">
                <span className="text-slate-700">Events & Activations</span>
                <span className="text-[#D0342A]">45.0% (66.8 Bil ₫)</span>
              </div>
              <div className="w-full bg-[#f0eff4] h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#E5635B] to-[#D0342A] h-full rounded-full w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1.5">
                <span className="text-slate-700">Retail Experience & POSM</span>
                <span className="text-zinc-800">28.5% (42.3 Bil ₫)</span>
              </div>
              <div className="w-full bg-[#f0eff4] h-2 rounded-full overflow-hidden">
                <div className="bg-zinc-800 h-full rounded-full w-[28.5%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1.5">
                <span className="text-slate-700">Creative Campaign & Content</span>
                <span className="text-emerald-700">16.5% (24.5 Bil ₫)</span>
              </div>
              <div className="w-full bg-[#f0eff4] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[16.5%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1.5">
                <span className="text-slate-700">Digital Marketing & Social</span>
                <span className="text-amber-700">10.0% (14.9 Bil ₫)</span>
              </div>
              <div className="w-full bg-[#f0eff4] h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[10%]" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs space-y-2">
            <span className="font-bold text-slate-800 block">Overall Job Status (YTD):</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-3 bg-[#f6f6f9] border border-black/[0.02] rounded-[18px] flex justify-between items-center">
                <span className="text-slate-500 font-medium">Completed:</span>
                <strong className="text-emerald-700 font-black">54%</strong>
              </div>
              <div className="p-3 bg-[#f6f6f9] border border-black/[0.02] rounded-[18px] flex justify-between items-center">
                <span className="text-slate-500 font-medium">Running:</span>
                <strong className="text-[#D0342A] font-black">32%</strong>
              </div>
              <div className="p-3 bg-[#f6f6f9] border border-black/[0.02] rounded-[18px] flex justify-between items-center">
                <span className="text-slate-500 font-medium">Bidding:</span>
                <strong className="text-amber-700 font-black">9%</strong>
              </div>
              <div className="p-3 bg-[#f6f6f9] border border-black/[0.02] rounded-[18px] flex justify-between items-center">
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
