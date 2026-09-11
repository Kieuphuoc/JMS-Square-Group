'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowLeft, ArrowDown, Lock, Unlock, Calendar, CheckCircle2, 
  Plus, FileText, Users, DollarSign, Building2, 
  RefreshCw, Download, Trash2, 
  Sparkles, Coins, ChevronDown, Loader2,
  TrendingUp, Package, GanttChart
} from 'lucide-react';
import { 
  JobItem, ProjectMember, PaymentTerm, ProgressLog, 
  ALL_STAFF_MEMBERS,
  getMonthlyRevenueAllocations, getJobMembers, getJobPaymentTerms, getJobProgressLogs
} from '../data/mockJmsData';
import CustomSelect, { CustomSelectOption } from './CustomSelect';
import CustomDatePicker from './CustomDatePicker';
import { ClientLogo, BrandLogo } from './BrandLogos';
import JobDetailPnl from './JobDetailPnl';
import JobDetailStock from './JobDetailStock';
import JobDetailTasks from './JobDetailTasks';

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

const ROW1_TAB_KEYS = ['general', 'client', 'members', 'payments'] as const;
const ROW2_TAB_KEYS = ['pnl', 'stock', 'tasks'] as const;
const ALL_TAB_KEYS = ['general', 'client', 'members', 'payments', 'pnl', 'stock', 'tasks'] as const;
type TabKey = typeof ALL_TAB_KEYS[number];

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
    const currentIdx = ALL_TAB_KEYS.indexOf(activeTab);
    const newIdx = ALL_TAB_KEYS.indexOf(newTab);
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
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-purple-400"></div>
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#18181b] text-white text-xs font-bold shadow-sm">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Project ({jobIndex + 1}/{totalJobs})</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-300 to-purple-400"></div>
          </div>
        </div>
      )}

      {/* ==================== TOP HERO PROJECT BANNER ==================== */}
      {/* Exact Match to the sample image's Lavender Gradient Top Banner */}
      <div className="relative overflow-hidden rounded-[32px] p-6 sm:p-8 bg-gradient-to-r from-[#e5dffa] via-[#ede9fe] to-[#ded6fa] border border-purple-200/50 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
        {/* Subtle decorative purple wave background element matching sample */}
        <div className="absolute -right-8 -bottom-10 w-64 h-64 opacity-25 pointer-events-none">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-purple-400">
            <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,41.9C64.8,54.7,53.8,65.7,40.7,72.8C27.6,79.8,13.8,82.9,-0.6,83.9C-15,84.9,-30,83.8,-43.3,77.1C-56.6,70.4,-68.2,58,-76.3,44C-84.4,30,-89,15,-88.4,0.3C-87.8,-14.3,-82,-28.7,-73.4,-41.6C-64.8,-54.5,-53.4,-66,-40,-73.5C-26.6,-81,-13.3,-84.5,0.7,-85.7C14.7,-86.9,29.4,-85.8,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        {/* Row 1: Code pill, Status, and Pill Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 1. Mã dự án (Job Code Pill) */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-[#18181b] px-3.5 py-1.5 rounded-full border border-purple-200/60 shadow-2xs shrink-0">
              {job.isLocked ? (
                <span title="Data posted and locked in Arito Accounting">
                  <Lock className="w-3.5 h-3.5 text-purple-700" />
                </span>
              ) : (
                <span title="Unposted job code - Editable">
                  <Unlock className="w-3.5 h-3.5 text-slate-400" />
                </span>
              )}
              <span className="font-extrabold text-xs sm:text-sm font-mono tracking-wider">{job.jobCode}</span>
            </div>

            {/* Status Pill Badge (Charcoal Black Capsule style from image) */}
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 shadow-2xs ${
              job.status === 'Running' ? 'bg-[#18181b] text-white' :
              job.status === 'Done' ? 'bg-emerald-600 text-white' :
              job.status === 'Bidding' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              <span>{job.status === 'Running' ? 'Running' : job.status === 'Done' ? 'Completed' : job.status}</span>
            </span>
          </div>

          {/* Action Buttons (Pill Capsule styling) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Sync Arito Button: Styled identically to "+ Add member" black pill button in reference image */}
            <button
              type="button"
              onClick={handleSyncArito}
              disabled={isSyncingArito}
              title="Đồng bộ 2 chiều Arito ERP"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#18181b] hover:bg-black rounded-full transition-all active:scale-95 shadow-sm cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingArito ? 'animate-spin text-purple-300' : 'text-white'}`} />
              <span>{isSyncingArito ? 'Syncing...' : 'Sync Arito'}</span>
            </button>

            {/* Export Report Button: Styled identically to white/lavender capsule pills */}
            <button
              type="button"
              onClick={() => alert(`Exporting project report ${job.jobCode} to Excel / PDF`)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-800 bg-white/90 hover:bg-white border border-purple-200/70 rounded-full transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Row 2: 2. Tên dự án (Job Name & Subtitle) */}
        <div className="space-y-1 relative z-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1e1938] tracking-tight">
            {job.jobName}
          </h1>
          {job.description && (
            <p className="text-xs sm:text-sm text-[#4c4763] max-w-3xl leading-relaxed font-medium">
              {job.description}
            </p>
          )}
        </div>

        {/* Sync Success Alert Floating Pill Banner */}
        {syncSuccessMessage && (
          <div className="px-4 py-2 bg-white/95 text-emerald-800 text-xs font-semibold flex items-center gap-2 rounded-full border border-emerald-200/80 shadow-2xs animate-fadeIn w-fit">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* ==================== 5 CORE FIELDS BENTO GRID ==================== */}
      {/* Styled as ultra-clean modern Bento Boxes with rounded-[24px] */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs">
        {/* 3. Client */}
        <div className="bg-white p-4 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
            Client
          </span>
          <div className="flex items-center gap-2.5">
            <ClientLogo client={job.client} className="w-9 h-9 rounded-[14px]" />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-black text-slate-900 block truncate" title={job.client}>
                {job.client}
              </span>
              <span className="text-[11px] font-mono text-[#6d28d9] font-bold block truncate">
                {job.clientCode || 'CLI-UNIL-01'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Contract Client */}
        <div className="bg-white p-4 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
            Contract Client
          </span>
          <div>
            <span className="text-xs font-black text-slate-900 block truncate" title={job.contractClient || job.client}>
              {job.contractClient || job.client}
            </span>
            <span className="text-[11px] text-slate-500 block truncate font-mono mt-0.5">
              {job.contractCode || 'Legal Entity'}
            </span>
          </div>
        </div>

        {/* 5. Category / Job Type */}
        <div className="bg-white p-4 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
            Category / Job Type
          </span>
          <div>
            <span className="text-xs font-black text-slate-900 block truncate" title={job.category}>
              {job.category}
            </span>
            <span className="text-[11px] text-slate-500 block truncate mt-0.5">
              {job.jobType || 'Production'}
            </span>
          </div>
        </div>

        {/* 6. Brand */}
        <div className="bg-white p-4 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
            Brand
          </span>
          <div className="flex items-center gap-2.5">
            <BrandLogo brand={job.brand} className="w-9 h-9 rounded-[14px]" />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-black text-slate-900 block truncate" title={job.brand}>
                {job.brand}
              </span>
              <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                Team: {job.team}
              </span>
            </div>
          </div>
        </div>

        {/* 7. Potential Budget & GP Target */}
        <div className="bg-gradient-to-br from-[#f5f2fe] to-[#ebe5fd] p-4 rounded-[24px] border border-purple-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] col-span-2 sm:col-span-1 flex flex-col justify-between hover:shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all">
          <span className="text-[10px] text-[#5b21b6] font-extrabold uppercase tracking-wider block mb-1">
            Potential Budget
          </span>
          <div>
            <span className="text-sm sm:text-base font-black text-[#1e1938] block truncate">
              {formatVND(job.potentialBudget)}
            </span>
            <span className="text-[11px] font-extrabold text-[#6d28d9] block truncate mt-0.5">
              GP Target: {job.grossProfitPercent.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* ==================== TABS NAVIGATION BAR (CAPSULE SEGMENTED CONTROL) ==================== */}
      {/* Matching the "Weekly | Monthly" and pill switchers in the sample design */}
      <div className="bg-white p-2 rounded-[28px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1.5">
        {/* Row 1: 4 Core Tabs */}
        <div className="flex items-center gap-1.5 w-full">
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
                className={`flex-1 min-w-0 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2 select-none cursor-pointer ${
                  isActive
                    ? 'bg-[#18181b] text-white shadow-xs font-bold scale-[1.01]'
                    : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f7]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'text-slate-400'}`} />
                <span className="truncate">
                  <span className="hidden md:inline">{tab.fullLabel}</span>
                  <span className="md:hidden">{tab.shortLabel}</span>
                </span>
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#f0eff4] text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Row 2: 3 Operational Tabs */}
        <div className="flex items-center gap-1.5 w-full">
          {[
            { id: 'pnl' as const, fullLabel: 'P&L (Profit & Loss)', shortLabel: 'P&L', icon: TrendingUp },
            { id: 'stock' as const, fullLabel: 'Stock Summary', shortLabel: 'Stock', icon: Package },
            { id: 'tasks' as const, fullLabel: 'Task Management (Gantt)', shortLabel: 'Tasks', icon: GanttChart, count: 5 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 min-w-0 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2 select-none cursor-pointer ${
                  isActive
                    ? 'bg-[#18181b] text-white shadow-xs font-bold scale-[1.01]'
                    : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f7]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'text-slate-400'}`} />
                <span className="truncate">
                  <span className="hidden md:inline">{tab.fullLabel}</span>
                  <span className="md:hidden">{tab.shortLabel}</span>
                </span>
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#f0eff4] text-slate-600'
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

      {/* ==================== TAB 1: GENERAL INFORMATION ==================== */}
      {activeTab === 'general' && (
        <div key="tab-general" className={`space-y-6 ${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 1. Project Milestones Timeline */}
            <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-black/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
              <span className="text-[10px] font-extrabold text-[#6d28d9] bg-[#f5f2fe] px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Execution Timeline
              </span>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Project Milestones (Timeline)</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-[#f6f6f9] rounded-[18px]">
                  <span className="text-slate-500 font-medium">Start Date:</span>
                  <span className="font-bold text-slate-800 font-mono">{job.startDate}</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-[#f5f2fe] to-[#ebe5fd] rounded-[18px] border border-purple-100/80">
                  <span className="text-[#5b21b6] font-semibold">Confirmed Kick-off:</span>
                  <span className="font-black text-[#1e1938] font-mono">{job.kickoffDate}</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-[#f6f6f9] rounded-[18px]">
                  <span className="text-slate-500 font-medium">End Date:</span>
                  <span className="font-bold text-slate-800 font-mono">{job.endDate}</span>
                </div>
              </div>
            </div>

            {/* 2. Venue & Scope */}
            <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-black/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
              <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Scope of Work
              </span>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Venue & Scope</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-[#f6f6f9] rounded-[18px]">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
                    Deployment Venue
                  </span>
                  <p className="font-semibold text-slate-800 leading-relaxed">
                    Chuỗi 120 siêu thị Co.opmart, BigC/GO, WinMart tại TP.HCM, Hà Nội và Đà Nẵng.
                  </p>
                </div>

                <div className="p-3.5 bg-[#f6f6f9] rounded-[18px]">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
                    Accounting Scope
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {job.description || 'Mua hàng và gia công bộ nhận diện POSM theo order khách hàng Unilever Việt Nam.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Allocated Revenue & Monthly Breakdown */}
            <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-black/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  Revenue
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f6f6f9] text-slate-600 border border-slate-200/50">
                  {monthlyRevenueList.length} Months
                </span>
              </div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>Allocated Revenue</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* Total Allocated Revenue Card */}
                <div className="p-4 bg-gradient-to-br from-[#f5f2fe] to-[#ebe5fd] rounded-[20px] border border-purple-100/70 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Total Allocated Revenue:</span>
                    <span className="font-black text-[#1e1938] text-sm">
                      {formatVND(job.allocatedBilling > 0 ? job.allocatedBilling : job.potentialBudget)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px] pt-1.5 border-t border-purple-200/50 font-medium">
                    <span>Execution Period:</span>
                    <span className="text-[#6d28d9] font-bold font-mono">{job.startDate} → {job.endDate}</span>
                  </div>
                </div>

                {/* Interactive Accordion for Monthly Revenue Breakdown */}
                <div className="rounded-[20px] border border-black/[0.04] overflow-hidden bg-[#f6f6f9]">
                  <button
                    type="button"
                    onClick={() => setIsRevenueBreakdownOpen(!isRevenueBreakdownOpen)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#edeafc] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="font-bold text-slate-800 text-xs">
                        Allocation Breakdown
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#6d28d9] font-bold">
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
                      <div className="px-4 pb-4 pt-1 border-t border-slate-200/60 space-y-2 bg-white">
                        <div className="divide-y divide-slate-100">
                          {monthlyRevenueList.map((m) => (
                            <div key={m.monthIndex} className="py-2.5 first:pt-1 last:pb-0 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 text-xs">{m.monthLabel}</span>
                                  {m.period && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f2fe] text-[#6d28d9] border border-purple-100">
                                      {m.period}
                                    </span>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-[#1e1938] text-xs">
                                    {formatVND(m.amount)}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium ml-1">
                                    ({m.percentage}%)
                                  </span>
                                </div>
                              </div>

                              {/* Mini Progress Bar with Pastel Purple / Charcoal Theme */}
                              <div className="w-full bg-[#f0eff4] rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(m.percentage, 100)}%` }}
                                />
                              </div>

                              {m.note && (
                                <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium" title={m.note}>
                                  {m.note}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Summary total */}
                        <div className="pt-2.5 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-500">Total Allocation</span>
                          <span className="text-emerald-700 text-xs font-black">
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
          <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-black/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold text-[#6d28d9] bg-[#f5f2fe] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                  Execution Status
                </span>
                <h2 className="text-base font-black text-slate-900">Project Progress Logs</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsAddProgressOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#18181b] hover:bg-black rounded-full shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Update Progress</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-[22px] border border-black/[0.04] bg-white custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f6f6f9] text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4 w-28">Date</th>
                    <th className="py-3.5 px-4">Activity / Status</th>
                    <th className="py-3.5 px-4">Next Step</th>
                    <th className="py-3.5 px-4 w-36">Updated By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {progressLogs.map((log, index) => (
                    <tr key={log.id} className="hover:bg-[#fafafc] transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{index + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-700 font-mono">{log.date}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{log.status}</td>
                      <td className="py-3.5 px-4 text-[#6d28d9] font-semibold">{log.nextStep}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{log.byStaff}</td>
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
            <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-black/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
              <span className="text-[10px] font-extrabold text-[#6d28d9] bg-[#f5f2fe] px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Customer Entity
              </span>
              <h2 className="text-base font-black text-slate-900">General Client Profile</h2>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="p-3.5 bg-[#f6f6f9] rounded-[18px] grid grid-cols-3 gap-2 items-center">
                  <span className="text-slate-400 text-xs font-semibold">Client Name:</span>
                  <div className="col-span-2 flex items-center gap-2.5">
                    <ClientLogo client={job.client} className="w-7 h-7 rounded-[10px]" />
                    <span className="font-black text-slate-900">{job.client}</span>
                  </div>
                </div>
                <div className="p-3.5 bg-[#f6f6f9] rounded-[18px] grid grid-cols-3 gap-2 items-center">
                  <span className="text-slate-400 text-xs font-semibold">Contracted Entity:</span>
                  <span className="col-span-2 font-bold text-slate-800">{job.contractClient}</span>
                </div>
                <div className="p-3.5 bg-[#f6f6f9] rounded-[18px] grid grid-cols-3 gap-2 items-center">
                  <span className="text-slate-400 text-xs font-semibold">Brand:</span>
                  <div className="col-span-2 flex items-center gap-2.5">
                    <BrandLogo brand={job.brand} className="w-7 h-7 rounded-[10px]" />
                    <span className="font-extrabold text-[#6d28d9]">{job.brand}</span>
                  </div>
                </div>
                <div className="p-3.5 bg-[#f6f6f9] rounded-[18px] grid grid-cols-3 gap-2">
                  <span className="text-slate-400 text-xs font-semibold">Contact Person:</span>
                  <div className="col-span-2 space-y-1">
                    <p className="font-bold text-slate-900">{job.contactPerson?.name || 'Mr. Nhân Mai (Procurement Manager)'}</p>
                    <p className="text-xs text-slate-500 font-mono">Phone: {job.contactPerson?.phone || '0903 123 456'}</p>
                    <p className="text-xs text-slate-500 font-mono">Email: {job.contactPerson?.email || 'nhan.mai@unilever.com'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-black/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
              <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Contract Legal Information
              </span>
              <h2 className="text-base font-black text-slate-900">Legal & Tax Identification</h2>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="p-3.5 bg-[#f6f6f9] rounded-[18px] grid grid-cols-3 gap-2 items-center">
                  <span className="text-slate-400 text-xs font-semibold">Client Code:</span>
                  <span className="col-span-2 font-mono font-black text-[#1e1938]">{job.clientCode}</span>
                </div>
                <div className="p-3.5 bg-[#f6f6f9] rounded-[18px] grid grid-cols-3 gap-2 items-center">
                  <span className="text-slate-400 text-xs font-semibold">Tax Identification:</span>
                  <span className="col-span-2 font-mono font-bold text-slate-800">0303123849-001</span>
                </div>
                <div className="p-3.5 bg-[#f6f6f9] rounded-[18px] grid grid-cols-3 gap-2">
                  <span className="text-slate-400 text-xs font-semibold">Registered Address:</span>
                  <span className="col-span-2 text-slate-700 font-medium leading-relaxed">Tòa nhà Unilever, 156 Nguyễn Lương Bằng, P. Tân Phú, Quận 7, TP.HCM</span>
                </div>
                <div className="p-3.5 bg-[#f6f6f9] rounded-[18px] grid grid-cols-3 gap-2 items-center">
                  <span className="text-slate-400 text-xs font-semibold">Framework Contract:</span>
                  <span className="col-span-2 text-[#6d28d9] font-mono font-bold">{job.contractCode || 'MSA-2025/ULV-SQC-MASTER'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: MEMBERS & BONUS ==================== */}
      {activeTab === 'members' && (
        <div key="tab-members" className={`space-y-6 ${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-black/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold text-[#6d28d9] bg-[#f5f2fe] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                  Project Human Capital
                </span>
                <h2 className="text-base font-black text-slate-900">Assigned Team Members & SQC Bonus Scheme</h2>
              </div>

              {/* Exact styling of "+ Add member" black pill button */}
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#18181b] hover:bg-black rounded-full shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            {/* 3 Summary Bento Cards (Matching "Data 10,4h", "Impact", "Statistics" aesthetic) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-gradient-to-br from-[#f4f0ff] to-[#eae4fd] rounded-[24px] border border-purple-100/70">
                <span className="text-xs text-slate-500 font-semibold block">Total Allocated Bonus</span>
                <span className="text-2xl font-black text-[#1e1938] mt-1 block">
                  {members.reduce((sum, m) => sum + m.bonusPercent, 0)}%
                </span>
                <span className="text-[11px] text-[#6d28d9] mt-1 block font-bold">
                  Equivalent to {formatVND(members.reduce((sum, m) => sum + m.assignedBudget, 0))}
                </span>
              </div>
              <div className="p-5 bg-[#f6f6f9] rounded-[24px] border border-black/[0.04]">
                <span className="text-xs text-slate-500 font-semibold block">Average KPI Target</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {Math.round(members.reduce((sum, m) => sum + m.kpiCompletion, 0) / (members.length || 1))}%
                </span>
                <span className="text-[11px] text-emerald-700 mt-1 block font-bold">Evaluated on monthly delivery</span>
              </div>
              <div className="p-5 bg-white rounded-[24px] border border-black/[0.04] shadow-2xs">
                <span className="text-xs text-slate-500 font-semibold block">CSAT Target Score</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {(members.reduce((sum, m) => sum + m.csatScore, 0) / (members.length || 1)).toFixed(1)} / 5.0
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block font-medium">Square Communications Quality Standard</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[22px] border border-black/[0.04] bg-white custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f6f6f9] text-slate-500 font-bold uppercase text-[11px] border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Member Name</th>
                    <th className="py-3.5 px-4">Department & Role</th>
                    <th className="py-3.5 px-4 text-center">Bonus Scheme (%)</th>
                    <th className="py-3.5 px-4 text-right">Assigned Budget</th>
                    <th className="py-3.5 px-4 text-center">KPI Score</th>
                    <th className="py-3.5 px-4 text-center">CSAT</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((mem) => (
                    <tr key={mem.id} className="hover:bg-[#fafafc] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e5dffa] to-[#d6cbfb] text-[#5b21b6] font-black flex items-center justify-center text-xs shadow-2xs">
                            {mem.avatar}
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{mem.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{mem.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{mem.role}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{mem.department}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-[#ede9fe] text-[#5b21b6] font-black text-[11px]">
                          {mem.bonusPercent}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900">
                        {formatVND(mem.assignedBudget)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[11px]">
                          {mem.kpiCompletion}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-[#6d28d9]">
                        ⭐ {mem.csatScore}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setMembers(members.filter(m => m.id !== mem.id))}
                          className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
          <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-black/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold text-[#6d28d9] bg-[#f5f2fe] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                  Cashflow & Arito Reconciliation
                </span>
                <h2 className="text-base font-black text-slate-900">Billing Milestones & Direct Project Costs</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsAddPaymentOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#18181b] hover:bg-black rounded-full shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            {/* Top 5 Financial Summary Boxes (Bento Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="p-4 bg-[#f6f6f9] rounded-[22px] border border-black/[0.04]">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Planned</span>
                <span className="text-base font-black text-slate-900 mt-1 block">{formatVND(totalPlannedPayment)}</span>
                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{totalPaymentPercent}% of contract</span>
              </div>
              <div className="p-4 bg-gradient-to-br from-[#f4f0ff] to-[#eae4fd] rounded-[22px] border border-purple-100/70">
                <span className="text-[10px] text-[#5b21b6] font-bold uppercase tracking-wider block">Total Invoiced</span>
                <span className="text-base font-black text-[#1e1938] mt-1 block">{formatVND(totalInvoiced)}</span>
                <span className="text-[10px] text-[#6d28d9] font-bold block mt-0.5">VAT Invoice Issued</span>
              </div>
              <div className="p-4 bg-[#f6f6f9] rounded-[22px] border border-black/[0.04]">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Actual Received</span>
                <span className="text-base font-black text-emerald-800 mt-1 block">{formatVND(totalActualReceived)}</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Collected on Bank Account</span>
              </div>
              <div className="p-4 bg-[#f6f6f9] rounded-[22px] border border-black/[0.04]">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Direct Cost Spent</span>
                <span className="text-base font-black text-slate-900 mt-1 block">{formatVND(totalCostSpent)}</span>
                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Remaining: {formatVND(totalCostRemaining)}</span>
              </div>
              <div className="p-4 bg-white rounded-[22px] border border-black/[0.04] shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Receivable Left</span>
                <span className="text-base font-black text-amber-900 mt-1 block">{formatVND(job.potentialBudget - totalActualReceived)}</span>
                <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Awaiting customer collection</span>
              </div>
            </div>

            {/* Milestones Table */}
            <div className="overflow-x-auto rounded-[22px] border border-black/[0.04] bg-white custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f6f6f9] text-slate-500 font-bold uppercase text-[11px] border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Milestone (Đợt)</th>
                    <th className="py-3.5 px-4 text-center">Tỷ lệ (%)</th>
                    <th className="py-3.5 px-4 text-right">Planned Amount</th>
                    <th className="py-3.5 px-4 text-center">Planned Date</th>
                    <th className="py-3.5 px-4 text-center">Due Date</th>
                    <th className="py-3.5 px-4 text-right">Invoiced / Received</th>
                    <th className="py-3.5 px-4 text-right">Cost Spent / Rem.</th>
                    <th className="py-3.5 px-4 text-center">Arito Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paymentTerms.map((term) => (
                    <tr key={term.id} className="hover:bg-[#fafafc] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-black text-slate-900">{term.termName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            {term.poNumber && <span className="bg-[#f6f6f9] px-2 py-0.5 rounded-md text-slate-600 font-semibold">PO: {term.poNumber}</span>}
                            {term.acceptanceDoc && <span>BB: {term.acceptanceDoc}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-black px-2.5 py-1 bg-[#ede9fe] text-[#5b21b6] rounded-full text-[11px]">
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
                        <p className="font-black text-[#6d28d9]">{formatVND(term.invoicedAmount)}</p>
                        <p className="text-[10px] text-emerald-600 font-bold">Thu: {formatVND(term.actualReceivedAmount)}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right text-[11px]">
                        <span className="font-bold text-slate-900">{formatVND(term.actualCostSpent)}</span>
                        <span className="text-slate-400 font-semibold block">{formatVND(term.actualCostRemaining)}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                          term.reconciliationStatus === 'Synced'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                            : term.reconciliationStatus === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200/70'
                            : 'bg-[#f6f6f9] text-slate-600'
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

      {/* ==================== TAB 5: P&L (PROFIT & LOSS) ==================== */}
      {activeTab === 'pnl' && (
        <div key="tab-pnl" className={`${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <JobDetailPnl 
            job={job} 
            formatVND={formatVND} 
            onSyncArito={handleSyncArito} 
            isSyncing={isSyncingArito} 
          />
        </div>
      )}

      {/* ==================== TAB 6: STOCK SUMMARY ==================== */}
      {activeTab === 'stock' && (
        <div key="tab-stock" className={`${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <JobDetailStock 
            job={job} 
            formatVND={formatVND} 
          />
        </div>
      )}

      {/* ==================== TAB 7: TASK MANAGEMENT & GANTT ==================== */}
      {activeTab === 'tasks' && (
        <div key="tab-tasks" className={`${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <JobDetailTasks 
            job={job} 
          />
        </div>
      )}

      {/* ==================== MODALS ==================== */}
      {/* Modal Add Member */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-black/[0.05] space-y-4 animate-scaleUp">
            <h3 className="text-base font-black text-slate-900">Add Project Member</h3>
            
            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff Member</label>
                <CustomSelect
                  options={STAFF_OPTIONS}
                  value={newMemberName}
                  onChange={(val) => setNewMemberName(val)}
                  placeholder="Select a colleague from Square Group"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role in Project</label>
                <input 
                  type="text" 
                  value={newMemberRole} 
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. Senior Project Manager"
                  className="w-full p-3 bg-[#f6f6f9] border border-black/[0.06] rounded-[16px] text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <CustomSelect
                  options={DEPT_OPTIONS}
                  value={newMemberDept}
                  onChange={(val) => setNewMemberDept(val)}
                  placeholder="Select Department"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">Bonus Percentage (%)</label>
                  <span className="font-black text-[#6d28d9]">{newMemberBonus}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={newMemberBonus} 
                  onChange={(e) => setNewMemberBonus(Number(e.target.value))}
                  className="w-full accent-[#18181b]"
                />
                <span className="text-[10px] text-slate-400 block mt-1 font-medium">
                  Equivalent: {formatVND(Math.round((job.potentialBudget * newMemberBonus) / 100))}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-[#f6f6f9] rounded-full font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#18181b] text-white rounded-full font-bold hover:bg-black shadow-sm active:scale-95 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-black/[0.05] space-y-4 animate-scaleUp">
            <h3 className="text-base font-black text-slate-900">Add Payment Milestone</h3>
            
            <form onSubmit={handleAddPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Milestone Name / Term</label>
                <input 
                  type="text" 
                  value={newTermName} 
                  onChange={(e) => setNewTermName(e.target.value)}
                  placeholder="e.g. Đợt 3: Nghiệm thu hoàn thành lắp đặt POSM"
                  required
                  className="w-full p-3 bg-[#f6f6f9] border border-black/[0.06] rounded-[16px] text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Percentage (%)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={newTermPercent} 
                    onChange={(e) => setNewTermPercent(Number(e.target.value))}
                    required
                    className="w-full p-3 bg-[#f6f6f9] border border-black/[0.06] rounded-[16px] text-xs font-black focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                    {formatVND(Math.round((job.potentialBudget * newTermPercent) / 100))}
                  </span>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Planned Date</label>
                  <CustomDatePicker 
                    value={newTermPlannedDate} 
                    onChange={setNewTermPlannedDate}
                    title="Planned Date"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <CustomDatePicker 
                    value={newTermDueDate} 
                    onChange={setNewTermDueDate}
                    title="Due Date"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer PO Code</label>
                  <input 
                    type="text" 
                    value={newTermPo} 
                    onChange={(e) => setNewTermPo(e.target.value)}
                    placeholder="PO-2026-xxx"
                    className="w-full p-3 bg-[#f6f6f9] border border-black/[0.06] rounded-[16px] text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Cost Spent</label>
                <input 
                  type="number" 
                  value={newTermCostSpent} 
                  onChange={(e) => setNewTermCostSpent(Number(e.target.value))}
                  placeholder="0"
                  className="w-full p-3 bg-[#f6f6f9] border border-black/[0.06] rounded-[16px] text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Acceptance Document</label>
                <input 
                  type="text" 
                  value={newTermAcceptance} 
                  onChange={(e) => setNewTermAcceptance(e.target.value)}
                  placeholder="e.g. BB-NT-Final-Handover"
                  className="w-full p-3 bg-[#f6f6f9] border border-black/[0.06] rounded-[16px] text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-[#f6f6f9] rounded-full font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#18181b] text-white rounded-full font-bold hover:bg-black shadow-sm active:scale-95 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-black/[0.05] space-y-4 animate-scaleUp">
            <h3 className="text-base font-black text-slate-900">Update Progress Log</h3>
            
            <form onSubmit={handleAddProgress} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Status / Activity Details <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea 
                  rows={3}
                  value={newProgressStatus} 
                  onChange={(e) => setNewProgressStatus(e.target.value)}
                  placeholder="Detail ongoing operations, venue inspection, production..."
                  required
                  className="w-full p-3 bg-[#f6f6f9] border border-black/[0.06] rounded-[16px] text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Next Action / Step</label>
                <input 
                  type="text" 
                  value={newProgressNextStep} 
                  onChange={(e) => setNewProgressNextStep(e.target.value)}
                  placeholder="e.g. Inspect setup and sign handover minutes"
                  className="w-full p-3 bg-[#f6f6f9] border border-black/[0.06] rounded-[16px] text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProgressOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-[#f6f6f9] rounded-full font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#18181b] text-white rounded-full font-bold hover:bg-black shadow-sm active:scale-95 transition-all cursor-pointer"
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

  // When selected job prop changes, reset visible count and ensure scroll is at the very top
  useEffect(() => {
    setVisibleCount(1);
    setIsLoadingMore(false);
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }

    const resetScroll = () => {
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    };

    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    return () => cancelAnimationFrame(rafId);
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
    <div className="space-y-10 pb-24 relative">
      {orderedJobs.slice(0, visibleCount).map((j, idx) => {
        const isFirst = idx === 0;

        return (
          <div 
            key={j.id} 
            id={`job-card-${j.id}`} 
            className={`scroll-mt-4 ${isFirst ? 'animate-fadeIn' : 'animate-job-card-entrance'}`}
          >
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

      {/* Elegant Loading Skeleton Preview while loading next project */}
      {isLoadingMore && (
        <div className="rounded-[28px] border border-black/[0.04] bg-white/80 backdrop-blur-xs p-6 sm:p-7 shadow-sm space-y-5 animate-pulse">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-28 bg-[#ede9fe] rounded-full" />
              <div className="h-6 w-48 sm:w-64 bg-slate-200 rounded-xl" />
              <div className="h-6 w-20 bg-slate-100 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 bg-[#18181b]/20 rounded-full" />
              <div className="h-8 w-28 bg-slate-100 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-1">
            {[1, 2, 3, 4, 5].map((k) => (
              <div key={k} className="h-16 bg-[#f6f6f9] border border-black/[0.02] rounded-[20px]" />
            ))}
          </div>
        </div>
      )}

      {/* Lazy Loading Sentinel & Indicator */}
      {hasMore && (
        <div ref={sentinelRef} className="py-6 flex flex-col items-center justify-center">
          {isLoadingMore ? (
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-black/[0.06] shadow-sm text-[#18181b] text-xs font-bold animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-[#6d28d9]" />
              <span>Loading next project ({orderedJobs[visibleCount]?.jobCode})...</span>
            </div>
          ) : (
            <div className="h-6 w-full flex items-center justify-center">
              <div className="w-8 h-1 bg-slate-300 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      )}

      {/* End of list confirmation */}
      {!hasMore && orderedJobs.length > 1 && (
        <div className="py-8 flex flex-col items-center justify-center text-center gap-1.5 animate-fadeIn">
          <div className="w-12 h-0.5 bg-slate-300 rounded-full mb-1" />
          <span className="text-xs font-semibold text-slate-400">
            ✓ All {orderedJobs.length} projects loaded
          </span>
        </div>
      )}
    </div>
  );
}
