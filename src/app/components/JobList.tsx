'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Plus, Filter, Lock, 
  CheckCircle2, Clock, AlertCircle, 
  XCircle, RefreshCw, FileSpreadsheet, ChevronDown,
  Calendar, Check, X, ChevronLeft, ChevronRight
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
    badge: <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> 
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

  // Status badge config in English
  const getStatusBadge = (status: JobItem['status']) => {
    switch (status) {
      case 'Running':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Running
          </span>
        );
      case 'Done':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'Bidding':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Bidding
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <AlertCircle className="w-3 h-3 text-indigo-600" />
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3 h-3 text-slate-500" />
            Cancelled
          </span>
        );
      case 'Liquidation':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <RefreshCw className="w-3 h-3 text-purple-600" />
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
    <div className="space-y-5">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Jobs List
            <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => alert('Exporting jobs list to Excel (.xlsx)...')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-blue-200 hover:bg-blue-50/70 hover:border-blue-300 transition-all duration-200 active:scale-95 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          <button 
            type="button"
            onClick={onNavigateCreateJob}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm shadow-blue-500/25 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Job</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4.5 sm:p-5 rounded-2xl border border-blue-100 shadow-sm space-y-3">
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs pb-2 border-b border-blue-50">
            <span className="text-slate-500 font-medium">Active filters applied</span>
            <button 
              type="button" 
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3.5 items-end">
          {/* Search keyword */}
          <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4 min-w-0">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text"
                placeholder="Job code, name, client, brand..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm bg-blue-50/40 border border-blue-100 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 text-slate-700 font-semibold"
              />
            </div>
          </div>

          {/* Start Day */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 min-w-0">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
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
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
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
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
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
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
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

      {/* Main Data Grid */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/70 border-b border-blue-100 text-xs font-semibold text-blue-900/80 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 min-w-[150px]">Job Code</th>
                <th className="py-3.5 px-4 min-w-[260px]">Project</th>
                <th className="py-3.5 px-4 min-w-[150px]">Category</th>
                <th className="py-3.5 px-4 text-right min-w-[140px]">Budget</th>
                <th className="py-3.5 px-4 text-center min-w-[120px]">Status</th>
                <th className="py-3.5 px-4 min-w-[150px]">Account Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50 text-sm">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Filter className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                    <p className="font-medium">No projects match current filters</p>
                    <button 
                      onClick={resetFilters}
                      className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
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
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center text-xs text-slate-400 font-medium">
                      {idx + 1}
                    </td>

                    {/* Job Code & Lock state (Only locked when project is completed) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {job.status === 'Done' && (
                          <span title="Project Completed - Data Locked">
                            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          </span>
                        )}
                        <span className="font-bold text-blue-700 group-hover:text-blue-900 tracking-tight">
                          {job.jobCode}
                        </span>
                      </div>
                    </td>

                    {/* Project Name (Single Line, no subinfo/tags) */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                        {job.jobName}
                      </span>
                    </td>

                    {/* Category (Single Line) */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-slate-800">
                        {job.category}
                      </span>
                    </td>

                    {/* Potential Budget (Single Line) */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-extrabold text-slate-900">
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
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                          {job.accountLead.avatar}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 truncate">
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
        <div className="px-6 py-4 bg-blue-50/30 border-t border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-4">
            <span>Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong> jobs</span>
            <span className="hidden sm:inline text-blue-200">|</span>
            <span className="hidden sm:inline">Direct 2-way sync with Arito ERP</span>
          </div>

          <div className="flex items-center gap-1 font-semibold">
            <span className="mr-2">Page 1 of 1</span>
            <button disabled className="px-3 py-1 rounded-full border border-blue-100 bg-white text-slate-300 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 rounded-full border border-blue-600 bg-blue-600 text-white shadow-xs">1</button>
            <button disabled className="px-3 py-1 rounded-full border border-blue-100 bg-white text-slate-300 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
