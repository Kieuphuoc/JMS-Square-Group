'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, Lock, 
  CheckCircle2, Clock, AlertCircle, 
  XCircle, RefreshCw, FileSpreadsheet
} from 'lucide-react';
import { JobItem } from '../data/mockJmsData';
import CustomSelect, { CustomSelectOption } from './CustomSelect';
import CustomDatePicker from './CustomDatePicker';

const TEAM_OPTIONS: CustomSelectOption[] = [
  { value: 'ALL', label: 'All Teams' },
  { value: 'Team Nghi', label: 'Team Nghi' },
  { value: 'Team Ngân', label: 'Team Ngân' },
  { value: 'Team Thảo', label: 'Team Thảo' },
  { value: 'Team Huy', label: 'Team Huy' },
];

const STATUS_OPTIONS: CustomSelectOption[] = [
  { 
    value: 'ALL', 
    label: 'All Statuses',
    badge: <span className="w-2 h-2 rounded-full bg-slate-300"></span> 
  },
  { 
    value: 'Running', 
    label: 'Running',
    badge: <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span> 
  },
  { 
    value: 'Done', 
    label: 'Completed',
    badge: <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 
  },
  { 
    value: 'Bidding', 
    label: 'Bidding',
    badge: <span className="w-2 h-2 rounded-full bg-amber-500"></span> 
  },
  { 
    value: 'Pending', 
    label: 'Pending',
    badge: <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 
  },
  { 
    value: 'Cancelled', 
    label: 'Cancelled',
    badge: <span className="w-2 h-2 rounded-full bg-rose-400"></span> 
  },
];

interface JobListProps {
  jobs: JobItem[];
  onSelectJob: (job: JobItem) => void;
  onNavigateCreateJob: () => void;
}

export default function JobList({ jobs, onSelectJob, onNavigateCreateJob }: JobListProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const hasActiveFilters = Boolean(
    searchKeyword.trim() || selectedTeam !== 'ALL' || selectedStatus !== 'ALL' || startDate || endDate
  );

  // Format currency VND
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  // Status badge config with Capsule Pill styling from reference image
  const getStatusBadge = (status: JobItem['status']) => {
    switch (status) {
      case 'Running':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#18181b] text-white shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ded8fc] animate-pulse"></span>
            Running
          </span>
        );
      case 'Done':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case 'Bidding':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/70 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Bidding
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200/70 shadow-2xs">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f6f6f9] text-slate-600 border border-slate-200/60 shadow-2xs">
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            Cancelled
          </span>
        );
      case 'Liquidation':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ede9fe] text-[#5b21b6] border border-purple-200/70 shadow-2xs">
            <RefreshCw className="w-3.5 h-3.5 text-[#6d28d9]" />
            Settled
          </span>
        );
      default:
        return null;
    }
  };

  // Filter jobs logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const kw = searchKeyword.toLowerCase().trim();
      const matchKeyword = !kw || 
        job.jobCode.toLowerCase().includes(kw) ||
        job.jobName.toLowerCase().includes(kw) ||
        job.client.toLowerCase().includes(kw) ||
        job.brand.toLowerCase().includes(kw) ||
        (job.contractCode && job.contractCode.toLowerCase().includes(kw));

      const matchTeam = selectedTeam === 'ALL' || job.team === selectedTeam;
      const matchStatus = selectedStatus === 'ALL' || job.status === selectedStatus;
      const matchCategory = selectedCategory === 'ALL' || job.category === selectedCategory;

      let matchDates = true;
      if (startDate && job.startDate < startDate) matchDates = false;
      if (endDate && job.endDate > endDate) matchDates = false;

      return matchKeyword && matchTeam && matchStatus && matchCategory && matchDates;
    });
  }, [jobs, searchKeyword, selectedTeam, selectedStatus, selectedCategory, startDate, endDate]);

  const resetFilters = () => {
    setSearchKeyword('');
    setSelectedTeam('ALL');
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions with Signature Frosted Glass & Square Red Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            Jobs List
            <span className="px-3.5 py-1 text-xs font-black rounded-full bg-red-500/10 text-[#e11d24] border border-red-200/80 shadow-2xs backdrop-blur-xs">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Excel Button: Frosted Glass Capsule Pill */}
          <button 
            type="button"
            onClick={() => alert('Exporting jobs list to Excel (.xlsx)...')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-zinc-800 bg-white/80 hover:bg-white border border-white/60 transition-all duration-200 active:scale-95 shadow-2xs backdrop-blur-md cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          {/* New Job Button: Square Red Brand Pill Button */}
          <button 
            type="button"
            onClick={onNavigateCreateJob}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black text-white bg-[#e11d24] hover:bg-[#b91c1c] transition-all duration-200 shadow-lg shadow-red-600/25 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Job</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar (Frosted Bento Container) */}
      <div className="bg-white/80 backdrop-blur-2xl p-5 sm:p-6 rounded-[28px] border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] space-y-3.5">
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs pb-2 border-b border-black/[0.04]">
            <span className="text-zinc-500 font-semibold">Active filters applied</span>
            <button 
              type="button" 
              onClick={resetFilters}
              className="text-[#e11d24] hover:text-[#b91c1c] font-black hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3.5 items-end">
          {/* Search keyword */}
          <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4 min-w-0">
            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text"
                placeholder="Job code, name, client, brand..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full h-11 pl-11 pr-4 text-xs sm:text-sm bg-[#f6f6f9] border border-black/[0.06] rounded-full focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400 transition-all duration-200 placeholder:text-slate-400 text-slate-900 font-semibold"
              />
            </div>
          </div>

          {/* Start Day */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 min-w-0">
            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Start Day
            </label>
            <CustomDatePicker 
              value={startDate} 
              onChange={setStartDate} 
              title="Start Day" 
              variant="pill"
              align="left"
            />
          </div>

          {/* End Day */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 min-w-0">
            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              End Day
            </label>
            <CustomDatePicker 
              value={endDate} 
              onChange={setEndDate} 
              title="End Day" 
              variant="pill"
              align="right"
            />
          </div>

          {/* Assigned Team */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 min-w-0">
            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Assigned Team
            </label>
            <CustomSelect 
              variant="pill"
              value={selectedTeam} 
              onChange={setSelectedTeam} 
              options={TEAM_OPTIONS} 
            />
          </div>

          {/* Status - Compact */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 min-w-0">
            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Status
            </label>
            <CustomSelect 
              variant="pill"
              value={selectedStatus} 
              onChange={setSelectedStatus} 
              options={STATUS_OPTIONS} 
            />
          </div>
        </div>
      </div>

      {/* Main Data Grid (Frosted Glass Container) */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-[28px] border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/60 text-zinc-500 uppercase font-black text-[11px] border-b border-black/[0.04]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 min-w-[150px]">Job Code</th>
                <th className="py-3.5 px-4 min-w-[260px]">Project</th>
                <th className="py-3.5 px-4 min-w-[150px]">Category</th>
                <th className="py-3.5 px-4 text-right min-w-[140px]">Budget</th>
                <th className="py-3.5 px-4 text-center min-w-[120px]">Status</th>
                <th className="py-3.5 px-4 min-w-[150px]">Account Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-sm">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400 bg-[#fafafc]">
                    <Filter className="w-8 h-8 mx-auto mb-2 text-purple-300" />
                    <p className="font-bold text-slate-700">No projects match current filters</p>
                    <button 
                      onClick={resetFilters}
                      className="mt-2 text-xs text-[#6d28d9] font-bold hover:underline cursor-pointer"
                    >
                      Clear filters to view all jobs
                    </button>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job, idx) => (
                  <tr 
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className="hover:bg-[#fafafc] transition-colors cursor-pointer group"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center text-xs text-slate-400 font-medium">
                      {idx + 1}
                    </td>

                    {/* Job Code & Lock state (Only locked when project is completed) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {job.status === 'Done' && (
                          <span title="Project Completed - Data Locked">
                            <Lock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          </span>
                        )}
                        <span className="font-black text-[#1e1938] group-hover:text-[#6d28d9] tracking-wider font-mono">
                          {job.jobCode}
                        </span>
                      </div>
                    </td>

                    {/* Project Name (Single Line) */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 group-hover:text-[#6d28d9] transition-colors line-clamp-1">
                        {job.jobName}
                      </span>
                    </td>

                    {/* Category (Single Line) */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-slate-700">
                        {job.category}
                      </span>
                    </td>

                    {/* Potential Budget (Single Line) */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-black text-slate-900">
                        {formatVND(job.potentialBudget)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(job.status)}
                    </td>

                    {/* Account Lead (Single Line) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#c4b5fd] text-[#18181b] font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                          {job.accountLead.avatar}
                        </div>
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {job.accountLead.name}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-[#f6f6f9] border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-4">
            <span className="font-medium">Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong> jobs</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline font-medium">Direct 2-way sync with Arito ERP</span>
          </div>

          <div className="flex items-center gap-1 font-bold">
            <span className="mr-2 text-slate-400">Page 1 of 1</span>
            <button disabled className="px-3.5 py-1.5 rounded-full border border-black/[0.04] bg-white text-slate-300 cursor-not-allowed">Previous</button>
            <button className="px-3.5 py-1.5 rounded-full bg-[#18181b] text-white shadow-xs">1</button>
            <button disabled className="px-3.5 py-1.5 rounded-full border border-black/[0.04] bg-white text-slate-300 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
