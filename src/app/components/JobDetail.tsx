'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowLeft, ArrowDown, Lock, Unlock, Calendar, CheckCircle2, 
  Plus, FileText, Users, DollarSign, Building2, 
  RefreshCw, Download, Trash2, 
  Sparkles, Coins, ChevronDown, Loader2
} from 'lucide-react';
import { 
  JobItem, ProjectMember, PaymentTerm, ProgressLog, 
  ALL_STAFF_MEMBERS,
  getMonthlyRevenueAllocations, getJobMembers, getJobPaymentTerms, getJobProgressLogs
} from '../data/mockJmsData';
import CustomSelect, { CustomSelectOption } from './CustomSelect';
import { ClientLogo, BrandLogo } from './BrandLogos';

const STAFF_OPTIONS: CustomSelectOption[] = ALL_STAFF_MEMBERS.map(s => ({
  value: s.name,
  label: s.name,
  sublabel: `${s.role} (${s.department})`,
}));

const DEPT_OPTIONS: CustomSelectOption[] = [
  { value: 'Account Department', label: 'Account Department' },
  { value: 'Events & Activation', label: 'Events & Activation' },
  { value: 'Production & Logistics', label: 'Production & Logistics' },
  { value: 'Creative Studio', label: 'Creative Studio' },
];

const TAB_KEYS = ['general', 'client', 'members', 'payments'] as const;
type TabKey = typeof TAB_KEYS[number];

interface SingleJobDetailCardProps {
  job: JobItem;
  jobIndex: number;
  totalJobs: number;
  isFirst: boolean;
  onBack: () => void;
  onUpdateJob?: (updatedJob: JobItem) => void;
}

function SingleJobDetailCard({
  job,
  jobIndex,
  totalJobs,
  isFirst,
  onBack,
  onUpdateJob,
}: SingleJobDetailCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [tabDirection, setTabDirection] = useState<'left' | 'right'>('right');
  const [members, setMembers] = useState<ProjectMember[]>(() => getJobMembers(job));
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(() => getJobPaymentTerms(job));
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>(() => getJobProgressLogs(job));

  const handleTabChange = (newTab: TabKey) => {
    if (newTab === activeTab) return;
    const currentIdx = TAB_KEYS.indexOf(activeTab);
    const newIdx = TAB_KEYS.indexOf(newTab);
    setTabDirection(newIdx > currentIdx ? 'right' : 'left');
    setActiveTab(newTab);
  };

  // Sync state
  const [isSyncingArito, setIsSyncingArito] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Modals state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddProgressOpen, setIsAddProgressOpen] = useState(false);

  // New Member Form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Senior Account Executive');
  const [newMemberDept, setNewMemberDept] = useState('Account Department');
  const [newMemberBonus, setNewMemberBonus] = useState(15);

  // New Payment Form state
  const [newTermName, setNewTermName] = useState('');
  const [newTermPercent, setNewTermPercent] = useState(20);
  const [newTermPlannedDate, setNewTermPlannedDate] = useState('');
  const [newTermDueDate, setNewTermDueDate] = useState('');
  const [newTermPo, setNewTermPo] = useState('');
  const [newTermAcceptance, setNewTermAcceptance] = useState('');
  const [newTermCostSpent, setNewTermCostSpent] = useState(0);

  // New Progress Log Form state
  const [newProgressStatus, setNewProgressStatus] = useState('');
  const [newProgressNextStep, setNewProgressNextStep] = useState('');
  const [isRevenueBreakdownOpen, setIsRevenueBreakdownOpen] = useState(false);

  const monthlyRevenueList = getMonthlyRevenueAllocations(job);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
  };

  // Calculations
  const totalPlannedPayment = paymentTerms.reduce((sum, item) => sum + item.plannedAmount, 0);
  const totalPaymentPercent = paymentTerms.reduce((sum, item) => sum + item.percentage, 0);
  const totalInvoiced = paymentTerms.reduce((sum, item) => sum + item.invoicedAmount, 0);
  const totalActualReceived = paymentTerms.reduce((sum, item) => sum + item.actualReceivedAmount, 0);
  const totalCostSpent = paymentTerms.reduce((sum, item) => sum + item.actualCostSpent, 0);
  const totalCostRemaining = paymentTerms.reduce((sum, item) => sum + item.actualCostRemaining, 0);

  // Handlers
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;
    const staff = ALL_STAFF_MEMBERS.find(s => s.name === newMemberName) || {
      name: newMemberName,
      email: `${newMemberName.toLowerCase().replace(/[\s\u00C0-\u024F\u1E00-\u1EFF]+/g, '.')}@squaregroup.com.vn`,
      role: newMemberRole,
      department: newMemberDept,
      avatar: newMemberName[0]?.toUpperCase() || 'U'
    };
    const newMem: ProjectMember = {
      id: `mem-${Date.now()}`,
      name: staff.name,
      email: staff.email,
      avatar: staff.avatar,
      department: newMemberDept,
      role: newMemberRole,
      bonusPercent: newMemberBonus,
      assignedBudget: Math.round((job.potentialBudget * newMemberBonus) / 100),
      kpiCompletion: 90,
      csatScore: 4.8
    };
    setMembers([...members, newMem]);
    setIsAddMemberOpen(false);
    setNewMemberName('');
    setNewMemberBonus(15);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTermName || newTermPercent <= 0) return;
    const plannedAmt = Math.round((job.potentialBudget * newTermPercent) / 100);
    const spentAmt = Number(newTermCostSpent) || 0;
    const newTerm: PaymentTerm = {
      id: `term-${Date.now()}`,
      termCode: `TERM-0${paymentTerms.length + 1}`,
      termName: newTermName,
      percentage: newTermPercent,
      plannedAmount: plannedAmt,
      plannedDate: newTermPlannedDate || job.startDate,
      dueDate: newTermDueDate || job.endDate,
      invoicedAmount: 0,
      actualReceivedAmount: 0,
      actualCostSpent: spentAmt,
      actualCostRemaining: Math.max(0, plannedAmt - spentAmt),
      reconciliationStatus: 'Draft',
      poNumber: newTermPo || `PO-${job.clientCode}-${paymentTerms.length + 1}`,
      acceptanceDoc: newTermAcceptance || `BBTN-${job.jobCode}-${paymentTerms.length + 1}`,
      notes: 'Tạo mới từ bảng điều khiển tiến độ thanh toán'
    };

    setPaymentTerms([...paymentTerms, newTerm]);
    setIsAddPaymentOpen(false);
    setNewTermName('');
    setNewTermPercent(20);
    setNewTermPlannedDate('');
    setNewTermDueDate('');
    setNewTermPo('');
    setNewTermAcceptance('');
    setNewTermCostSpent(0);
  };

  const handleAddProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgressStatus) return;
    const newLog: ProgressLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: newProgressStatus,
      nextStep: newProgressNextStep || 'Follow up on delivery',
      byStaff: job.projectLeader?.name || 'Lê Hải Minh',
      tagType: 'info'
    };
    setProgressLogs([newLog, ...progressLogs]);
    setIsAddProgressOpen(false);
    setNewProgressStatus('');
    setNewProgressNextStep('');
  };

  const handleSyncArito = () => {
    setIsSyncingArito(true);
    setTimeout(() => {
      setIsSyncingArito(false);
      setSyncSuccessMessage(`Đã đồng bộ 2 chiều thành công với Arito ERP cho dự án ${job.jobCode}!`);
      setTimeout(() => setSyncSuccessMessage(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* ==================== TRANSITION DIVIDER FOR SUBSEQUENT JOBS ==================== */}
      {!isFirst && (
        <div className="pt-6 pb-2 flex items-center justify-center">
          <div className="w-full flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-blue-300"></div>
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-sm">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Project ({jobIndex + 1}/{totalJobs})</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-blue-200 to-blue-300"></div>
          </div>
        </div>
      )}

      {/* ==================== HEADER (7 CORE FIELDS) ==================== */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm transition-all overflow-hidden">
        {/* Sync alert banner if synced */}
        {syncSuccessMessage && (
          <div className="px-6 py-2.5 bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 border-b border-emerald-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}

        {/* The 7 Core Fields Header */}
        <div className="px-6 py-4 space-y-4">
          {/* Row 1: 1. Mã dự án (Job Code), 2. Tên dự án (Job Name), Status, and Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
              {/* 1. Mã dự án */}
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200 shrink-0">
                {job.isLocked ? (
                  <span title="Data posted and locked in Arito Accounting">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                  </span>
                ) : (
                  <span title="Unposted job code - Editable">
                    <Unlock className="w-3.5 h-3.5 text-blue-400" />
                  </span>
                )}
                <span className="font-extrabold text-sm font-mono tracking-wide">{job.jobCode}</span>
              </div>

              {/* 2. Tên dự án */}
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {job.jobName}
              </h1>

              {/* Status Badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                job.status === 'Running' ? 'bg-blue-100 text-blue-800' :
                job.status === 'Done' ? 'bg-emerald-100 text-emerald-800' :
                job.status === 'Bidding' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {job.status === 'Running' ? 'Running' : job.status === 'Done' ? 'Completed' : job.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSyncArito}
                disabled={isSyncingArito}
                title="Đồng bộ 2 chiều Arito ERP"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-full transition-all active:scale-95 shadow-2xs cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingArito ? 'animate-spin text-blue-600' : 'text-blue-600'}`} />
                <span>{isSyncingArito ? 'Syncing...' : 'Sync Arito'}</span>
              </button>

              <button
                type="button"
                onClick={() => alert(`Exporting project report ${job.jobCode} to Excel / PDF`)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-full transition-all active:scale-95 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Row 2: 5 Core Fields Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
            {/* 3. Client */}
            <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Client
              </span>
              <div className="flex items-center gap-2">
                <ClientLogo client={job.client} className="w-8 h-8" />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 block truncate" title={job.client}>
                    {job.client}
                  </span>
                  <span className="text-[11px] font-mono text-blue-600 font-semibold block truncate">
                    {job.clientCode || 'CLI-UNIL-01'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Contract Client */}
            <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Contract Client
              </span>
              <span className="text-xs font-bold text-slate-900 block truncate" title={job.contractClient || job.client}>
                {job.contractClient || job.client}
              </span>
              <span className="text-[11px] text-slate-500 block truncate font-mono">
                {job.contractCode || 'Legal Entity'}
              </span>
            </div>

            {/* 5. Category / Job Type */}
            <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Category / Job Type
              </span>
              <span className="text-xs font-bold text-slate-900 block truncate" title={job.category}>
                {job.category}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {job.jobType || 'Production'}
              </span>
            </div>

            {/* 6. Brand */}
            <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Brand
              </span>
              <div className="flex items-center gap-2">
                <BrandLogo brand={job.brand} className="w-8 h-8" />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 block truncate" title={job.brand}>
                    {job.brand}
                  </span>
                  <span className="text-[11px] text-slate-500 block truncate">
                    Team: {job.team}
                  </span>
                </div>
              </div>
            </div>

            {/* 7. Potential Budget */}
            <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block mb-0.5">
                Potential Budget
              </span>
              <span className="text-sm font-extrabold text-blue-900 block truncate">
                {formatVND(job.potentialBudget)}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 block truncate">
                GP Target: {job.grossProfitPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Tier 3: Tabs Navigation Bar (Borderless flat layout + Sliding Underline Indicator) */}
        <div className="border-t border-slate-200/80 bg-white">
          <div className="relative flex items-center w-full">
            {/* Sliding Bottom Active Underline Indicator (GPU-accelerated translate3d) */}
            <div
              className="absolute bottom-0 left-0 h-[3px] w-1/4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
              style={{
                transform: `translate3d(${TAB_KEYS.indexOf(activeTab) * 100}%, 0, 0)`,
              }}
            >
              <div className="w-3/5 max-w-[120px] mx-auto h-[3px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-full shadow-sm shadow-blue-500/30" />
            </div>

            {/* 4 Equal Tabs */}
            {[
              { id: 'general' as const, fullLabel: 'General Information', shortLabel: 'General', icon: FileText },
              { id: 'client' as const, fullLabel: 'Client Information', shortLabel: 'Client', icon: Building2 },
              { id: 'members' as const, fullLabel: 'Project Members', shortLabel: 'Members', icon: Users, count: members.length },
              { id: 'payments' as const, fullLabel: 'Payment Terms & Financials', shortLabel: 'Payments', icon: DollarSign, count: paymentTerms.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 min-w-0 relative z-10 py-3 sm:py-3.5 px-2 sm:px-4 text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 select-none cursor-pointer ${
                    isActive
                      ? 'text-blue-600 font-bold bg-blue-50/50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-blue-600' : 'text-slate-400'}`} />
                  <span className="truncate">
                    <span className="hidden md:inline">{tab.fullLabel}</span>
                    <span className="md:hidden">{tab.shortLabel}</span>
                  </span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================== TAB 1: GENERAL INFORMATION ==================== */}
      {activeTab === 'general' && (
        <div key="tab-general" className={`space-y-6 ${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 1. Project Milestones Timeline */}
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Execution Timeline</span>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Project Milestones (Timeline)</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-blue-50/40 rounded-xl border border-blue-100/60">
                  <span className="text-slate-500 font-medium">Start Date:</span>
                  <span className="font-bold text-slate-800">{job.startDate}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-blue-700 font-medium">Confirmed Kick-off:</span>
                  <span className="font-bold text-blue-900">{job.kickoffDate}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50/40 rounded-xl border border-blue-100/60">
                  <span className="text-slate-500 font-medium">End Date:</span>
                  <span className="font-bold text-slate-800">{job.endDate}</span>
                </div>
              </div>
            </div>

            {/* 2. Venue & Scope */}
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Scope of Work</span>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Venue & Scope</span>
              </h2>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Deployment Venue:</span>
                  <p className="font-semibold text-slate-800 mt-1">
                    Chuỗi 120 siêu thị Co.opmart, BigC/GO, WinMart tại TP.HCM, Hà Nội và Đà Nẵng.
                  </p>
                </div>

                <div className="pt-2 border-t border-blue-50">
                  <span className="text-slate-400 font-medium block">Accounting Scope:</span>
                  <p className="text-slate-600 leading-relaxed mt-1">
                    {job.description || 'Mua hàng và gia công bộ nhận diện POSM theo order khách hàng Unilever Việt Nam.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Allocated Revenue & Monthly Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Revenue</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {monthlyRevenueList.length} Months
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>Allocated Revenue</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* Total Allocated Revenue Card */}
                <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Total Allocated Revenue:</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatVND(job.allocatedBilling > 0 ? job.allocatedBilling : job.potentialBudget)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-emerald-100/60">
                    <span>Execution Period:</span>
                    <span className="text-emerald-700 font-semibold">{job.startDate} → {job.endDate}</span>
                  </div>
                </div>

                {/* Interactive Accordion for Monthly Revenue Breakdown */}
                <div className="rounded-xl border border-blue-100/80 overflow-hidden bg-slate-50/40">
                  <button
                    type="button"
                    onClick={() => setIsRevenueBreakdownOpen(!isRevenueBreakdownOpen)}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-blue-50/80 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-bold text-slate-800 text-xs">
                        Allocation Breakdown
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold">
                      <span>{isRevenueBreakdownOpen ? 'Collapse' : 'View'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isRevenueBreakdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      gridTemplateRows: isRevenueBreakdownOpen ? '1fr' : '0fr',
                      opacity: isRevenueBreakdownOpen ? 1 : 0,
                    }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="px-3 pb-3 pt-1 border-t border-blue-100/60 space-y-2 bg-white">
                        <div className="divide-y divide-slate-100">
                          {monthlyRevenueList.map((m) => (
                            <div key={m.monthIndex} className="py-2 first:pt-1 last:pb-0 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900 text-xs">{m.monthLabel}</span>
                                  {m.period && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                      {m.period}
                                    </span>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className="font-extrabold text-blue-700 text-xs">
                                    {formatVND(m.amount)}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium ml-1">
                                    ({m.percentage}%)
                                  </span>
                                </div>
                              </div>

                              {/* Mini Progress Bar */}
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(m.percentage, 100)}%` }}
                                />
                              </div>

                              {m.note && (
                                <p className="text-[10px] text-slate-400 truncate mt-0.5" title={m.note}>
                                  {m.note}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Summary total */}
                        <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-500">Total Monthly Allocation:</span>
                          <span className="text-emerald-700 text-xs">
                            {formatVND(monthlyRevenueList.reduce((sum, m) => sum + m.amount, 0))} (100%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Logs Section */}
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Execution Status</span>
                <h2 className="text-base font-extrabold text-slate-900">Project Progress Logs</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsAddProgressOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Update Progress</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-blue-100 rounded-2xl custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-blue-50/70 text-blue-900/80 uppercase font-semibold border-b border-blue-100">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4 w-28">Date</th>
                    <th className="py-3 px-4">Activity / Status</th>
                    <th className="py-3 px-4">Next Step</th>
                    <th className="py-3 px-4 w-36">Updated By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {progressLogs.map((log, index) => (
                    <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{index + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{log.date}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{log.status}</td>
                      <td className="py-3.5 px-4 text-blue-700 font-semibold">{log.nextStep}</td>
                      <td className="py-3.5 px-4 text-slate-600">{log.byStaff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: CLIENT INFORMATION ==================== */}
      {activeTab === 'client' && (
        <div key="tab-client" className={`space-y-6 ${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Customer Entity</span>
              <h2 className="text-base font-extrabold text-slate-900">General Client Profile</h2>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-slate-400 text-xs font-medium">Client Name:</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <ClientLogo client={job.client} className="w-6 h-6" />
                    <span className="font-bold text-slate-900">{job.client}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 text-xs font-medium">Contracted Entity:</span>
                  <span className="col-span-2 text-slate-700">{job.contractClient}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-slate-400 text-xs font-medium">Brand:</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <BrandLogo brand={job.brand} className="w-6 h-6" />
                    <span className="font-extrabold text-blue-600">{job.brand}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 text-xs font-medium">Contact Person:</span>
                  <div className="col-span-2 space-y-0.5">
                    <p className="font-bold text-slate-800">{job.contactPerson?.name || 'Mr. Nhân Mai (Procurement Manager)'}</p>
                    <p className="text-xs text-slate-500">Phone: {job.contactPerson?.phone || '0903 123 456'}</p>
                    <p className="text-xs text-slate-500">Email: {job.contactPerson?.email || 'nhan.mai@unilever.com'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Contract Legal Information</span>
              <h2 className="text-base font-extrabold text-slate-900">Legal & Tax Identification</h2>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 text-xs font-medium">Client Code:</span>
                  <span className="col-span-2 font-mono font-bold text-blue-800">{job.clientCode}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 text-xs font-medium">Tax Identification:</span>
                  <span className="col-span-2 font-mono font-semibold text-slate-800">0303123849-001</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 text-xs font-medium">Registered Address:</span>
                  <span className="col-span-2 text-slate-700">Tòa nhà Unilever, 156 Nguyễn Lương Bằng, P. Tân Phú, Quận 7, TP.HCM</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 text-xs font-medium">Framework Contract:</span>
                  <span className="col-span-2 text-blue-700 font-mono font-semibold">{job.contractCode || 'MSA-2025/ULV-SQC-MASTER'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: MEMBERS & BONUS ==================== */}
      {activeTab === 'members' && (
        <div key="tab-members" className={`space-y-6 ${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Project Human Capital</span>
                <h2 className="text-base font-extrabold text-slate-900">Assigned Team Members & SQC Bonus Scheme</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsAddMemberOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/70">
                <span className="text-xs text-slate-500 font-medium block">Total Allocated Bonus</span>
                <span className="text-lg font-black text-blue-900 mt-1 block">
                  {members.reduce((sum, m) => sum + m.bonusPercent, 0)}%
                </span>
                <span className="text-[11px] text-blue-600 mt-0.5 block font-semibold">
                  Equivalent to {formatVND(members.reduce((sum, m) => sum + m.assignedBudget, 0))}
                </span>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/70">
                <span className="text-xs text-slate-500 font-medium block">Average KPI Target</span>
                <span className="text-lg font-black text-emerald-900 mt-1 block">
                  {Math.round(members.reduce((sum, m) => sum + m.kpiCompletion, 0) / (members.length || 1))}%
                </span>
                <span className="text-[11px] text-emerald-600 mt-0.5 block font-semibold">Evaluated on monthly delivery</span>
              </div>
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/70">
                <span className="text-xs text-slate-500 font-medium block">CSAT Target Score</span>
                <span className="text-lg font-black text-indigo-900 mt-1 block">
                  {(members.reduce((sum, m) => sum + m.csatScore, 0) / (members.length || 1)).toFixed(1)} / 5.0
                </span>
                <span className="text-[11px] text-indigo-600 mt-0.5 block font-semibold">Square Communications Quality Standard</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-blue-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fbfe] text-slate-500 font-bold uppercase text-[11px] border-b border-blue-100">
                  <tr>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Department & Role</th>
                    <th className="py-3 px-4 text-center">Bonus Scheme (%)</th>
                    <th className="py-3 px-4 text-right">Assigned Budget</th>
                    <th className="py-3 px-4 text-center">KPI Score</th>
                    <th className="py-3 px-4 text-center">CSAT</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {members.map((mem) => (
                    <tr key={mem.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                            {mem.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{mem.name}</p>
                            <p className="text-[10px] text-slate-400">{mem.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{mem.role}</p>
                        <p className="text-[10px] text-slate-500">{mem.department}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[11px]">
                          {mem.bonusPercent}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {formatVND(mem.assignedBudget)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          {mem.kpiCompletion}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-indigo-700">
                        ⭐ {mem.csatScore}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setMembers(members.filter(m => m.id !== mem.id))}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: PAYMENT TERMS & COSTS ==================== */}
      {activeTab === 'payments' && (
        <div key="tab-payments" className={`space-y-6 ${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Cashflow & Arito Reconciliation</span>
                <h2 className="text-base font-extrabold text-slate-900">Billing Milestones & Direct Project Costs</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsAddPaymentOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            {/* Top 5 Financial Summary Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Planned</span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{formatVND(totalPlannedPayment)}</span>
                <span className="text-[10px] text-slate-500 font-semibold block">{totalPaymentPercent}% of contract</span>
              </div>
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/70">
                <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">Total Invoiced</span>
                <span className="text-base font-extrabold text-indigo-900 mt-0.5 block">{formatVND(totalInvoiced)}</span>
                <span className="text-[10px] text-indigo-600 font-semibold block">VAT Invoice Issued</span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70">
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Actual Received</span>
                <span className="text-base font-extrabold text-emerald-800 mt-0.5 block">{formatVND(totalActualReceived)}</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Collected on Bank Account</span>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Direct Cost Spent</span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{formatVND(totalCostSpent)}</span>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">Remaining: {formatVND(totalCostRemaining)}</span>
              </div>
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Receivable Left</span>
                <span className="text-base font-extrabold text-amber-900 mt-0.5 block">{formatVND(job.potentialBudget - totalActualReceived)}</span>
                <span className="text-[10px] text-amber-700 font-semibold block">Awaiting customer collection</span>
              </div>
            </div>

            {/* Milestones Table */}
            <div className="overflow-x-auto rounded-xl border border-blue-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fbfe] text-slate-500 font-bold uppercase text-[11px] border-b border-blue-100">
                  <tr>
                    <th className="py-3 px-4">Milestone (Đợt)</th>
                    <th className="py-3 px-4 text-center">Tỷ lệ (%)</th>
                    <th className="py-3 px-4 text-right">Planned Amount</th>
                    <th className="py-3 px-4 text-center">Planned Date</th>
                    <th className="py-3 px-4 text-center">Due Date</th>
                    <th className="py-3 px-4 text-right">Invoiced / Received</th>
                    <th className="py-3 px-4 text-right">Cost Spent / Rem.</th>
                    <th className="py-3 px-4 text-center">Arito Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {paymentTerms.map((term) => (
                    <tr key={term.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-slate-900">{term.termName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            {term.poNumber && <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">PO: {term.poNumber}</span>}
                            {term.acceptanceDoc && <span>BB: {term.acceptanceDoc}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[11px]">
                          {term.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900">
                        {formatVND(term.plannedAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-600 font-mono text-[11px]">
                        {term.plannedDate}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-600 font-mono text-[11px]">
                        {term.dueDate}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <p className="font-extrabold text-indigo-700">{formatVND(term.invoicedAmount)}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold">Thu: {formatVND(term.actualReceivedAmount)}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right text-[11px]">
                        <span className="font-bold text-slate-900">{formatVND(term.actualCostSpent)}</span>
                        <span className="text-slate-500 font-semibold block">{formatVND(term.actualCostRemaining)}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          term.reconciliationStatus === 'Synced'
                            ? 'bg-emerald-100 text-emerald-800'
                            : term.reconciliationStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {term.reconciliationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODALS ==================== */}
      {/* Modal Add Member */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-blue-100 space-y-4 animate-scaleUp">
            <h3 className="text-base font-extrabold text-slate-900">Add Project Member</h3>
            
            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Staff Member</label>
                <CustomSelect
                  options={STAFF_OPTIONS}
                  value={newMemberName}
                  onChange={(val) => setNewMemberName(val)}
                  placeholder="Select a colleague from Square Group"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role in Project</label>
                <input 
                  type="text" 
                  value={newMemberRole} 
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. Senior Project Manager"
                  className="w-full p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <CustomSelect
                  options={DEPT_OPTIONS}
                  value={newMemberDept}
                  onChange={(val) => setNewMemberDept(val)}
                  placeholder="Select Department"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700">Bonus Percentage (%)</label>
                  <span className="font-extrabold text-blue-600">{newMemberBonus}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={newMemberBonus} 
                  onChange={(e) => setNewMemberBonus(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Equivalent: {formatVND(Math.round((job.potentialBudget * newMemberBonus) / 100))}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-50">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-blue-50 rounded-full font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 shadow-sm active:scale-95"
                >
                  Assign to Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Payment Milestone */}
      {isAddPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-blue-100 space-y-4 animate-scaleUp">
            <h3 className="text-base font-extrabold text-slate-900">Add Payment Milestone</h3>
            
            <form onSubmit={handleAddPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Milestone Name / Term</label>
                <input 
                  type="text" 
                  value={newTermName} 
                  onChange={(e) => setNewTermName(e.target.value)}
                  placeholder="e.g. Đợt 3: Nghiệm thu hoàn thành lắp đặt POSM"
                  required
                  className="w-full p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Percentage (%)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={newTermPercent} 
                    onChange={(e) => setNewTermPercent(Number(e.target.value))}
                    required
                    className="w-full p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {formatVND(Math.round((job.potentialBudget * newTermPercent) / 100))}
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Planned Date</label>
                  <input 
                    type="date" 
                    value={newTermPlannedDate} 
                    onChange={(e) => setNewTermPlannedDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={newTermDueDate} 
                    onChange={(e) => setNewTermDueDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer PO Code</label>
                  <input 
                    type="text" 
                    value={newTermPo} 
                    onChange={(e) => setNewTermPo(e.target.value)}
                    placeholder="PO-2026-xxx"
                    className="w-full p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Cost Spent</label>
                <input 
                  type="number" 
                  value={newTermCostSpent} 
                  onChange={(e) => setNewTermCostSpent(Number(e.target.value))}
                  placeholder="0"
                  className="w-full p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Acceptance Document</label>
                <input 
                  type="text" 
                  value={newTermAcceptance} 
                  onChange={(e) => setNewTermAcceptance(e.target.value)}
                  placeholder="e.g. BB-NT-Final-Handover"
                  className="w-full p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-50">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-blue-50 rounded-full font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 shadow-sm active:scale-95"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Progress */}
      {isAddProgressOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-blue-100 space-y-4 animate-scaleUp">
            <h3 className="text-base font-extrabold text-slate-900">Update Progress Log</h3>
            
            <form onSubmit={handleAddProgress} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Status / Activity Details <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea 
                  rows={3}
                  value={newProgressStatus} 
                  onChange={(e) => setNewProgressStatus(e.target.value)}
                  placeholder="Detail ongoing operations, venue inspection, production..."
                  required
                  className="w-full p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Next Action / Step</label>
                <input 
                  type="text" 
                  value={newProgressNextStep} 
                  onChange={(e) => setNewProgressNextStep(e.target.value)}
                  placeholder="e.g. Inspect setup and sign handover minutes"
                  className="w-full p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-50">
                <button
                  type="button"
                  onClick={() => setIsAddProgressOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-blue-50 rounded-full font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 shadow-sm active:scale-95"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export interface JobDetailProps {
  job: JobItem;
  allJobs?: JobItem[];
  onBack: () => void;
  onUpdateJob?: (updatedJob: JobItem) => void;
}

export default function JobDetail({ 
  job, 
  allJobs = [], 
  onBack, 
  onUpdateJob 
}: JobDetailProps) {
  const list = allJobs.length > 0 ? allJobs : [job];
  const startIdx = list.findIndex(j => j.id === job.id);
  const safeIdx = startIdx >= 0 ? startIdx : 0;

  // Order of jobs: starts with the selected job, then following jobs in list, then previous jobs
  const orderedJobs = [
    list[safeIdx],
    ...list.slice(safeIdx + 1),
    ...list.slice(0, safeIdx)
  ];

  // Lazy loading state: initially show 1 job
  const [visibleCount, setVisibleCount] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // When selected job prop changes, reset visible count
  useEffect(() => {
    setVisibleCount(1);
    setIsLoadingMore(false);
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
  }, [job.id]);

  const hasMore = visibleCount < orderedJobs.length;

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    loadingTimerRef.current = setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 1, orderedJobs.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore, orderedJobs.length]);

  // IntersectionObserver to auto-load when sentinel is approaching viewport
  useEffect(() => {
    if (!hasMore) return;
    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '300px',
        threshold: 0.05,
      }
    );

    observer.observe(currentSentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, handleLoadMore]);

  // Scroll listener on main container and window as smooth fallback
  useEffect(() => {
    if (!hasMore) return;

    const onScroll = () => {
      const mainEl = document.querySelector('main');
      if (mainEl) {
        const { scrollTop, scrollHeight, clientHeight } = mainEl;
        if (scrollHeight - scrollTop - clientHeight < 350) {
          handleLoadMore();
        }
      }
    };

    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (mainEl) {
        mainEl.removeEventListener('scroll', onScroll);
      }
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMore, handleLoadMore]);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-12 pb-24 relative">
      {orderedJobs.slice(0, visibleCount).map((j, idx) => {
        const isFirst = idx === 0;

        return (
          <div key={j.id} id={`job-card-${j.id}`} className="scroll-mt-4 animate-fadeIn">
            <SingleJobDetailCard
              job={j}
              jobIndex={idx}
              totalJobs={orderedJobs.length}
              isFirst={isFirst}
              onBack={onBack}
              onUpdateJob={onUpdateJob}
            />
          </div>
        );
      })}

      {/* Lazy Loading Sentinel & Indicator */}
      {hasMore && (
        <div ref={sentinelRef} className="py-6 flex flex-col items-center justify-center">
          {isLoadingMore ? (
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-blue-200 shadow-sm text-blue-600 text-xs font-bold animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Loading next project ({orderedJobs[visibleCount]?.jobCode})...</span>
            </div>
          ) : (
            <div className="h-6 w-full flex items-center justify-center">
              <div className="w-8 h-1 bg-slate-200 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      )}

      {/* End of list confirmation */}
      {!hasMore && orderedJobs.length > 1 && (
        <div className="py-8 flex flex-col items-center justify-center text-center gap-1.5">
          <div className="w-12 h-0.5 bg-slate-200 rounded-full mb-1" />
          <span className="text-xs font-semibold text-slate-400">
            ✓ All {orderedJobs.length} projects loaded
          </span>
        </div>
      )}
    </div>
  );
}
