'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Lock, Unlock, Calendar, CheckCircle2, Clock, 
  AlertCircle, Plus, FileText, Users, DollarSign, Building2, 
  RefreshCw, ExternalLink, Download, Edit3, Trash2, 
  Check, Info, Sparkles, Receipt, FileSpreadsheet, User
} from 'lucide-react';
import { 
  JobItem, ProjectMember, PaymentTerm, ProgressLog, 
  INITIAL_JOB_DETAIL_MEMBERS, INITIAL_PAYMENT_TERMS, INITIAL_PROGRESS_LOGS, ALL_STAFF_MEMBERS 
} from '../data/mockJmsData';
import CustomSelect, { CustomSelectOption } from './CustomSelect';

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

interface JobDetailProps {
  job: JobItem;
  onBack: () => void;
  onUpdateJob?: (updatedJob: JobItem) => void;
}

const TAB_KEYS = ['general', 'client', 'members', 'payments'] as const;
type TabKey = typeof TAB_KEYS[number];

export default function JobDetail({ job, onBack, onUpdateJob }: JobDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [tabDirection, setTabDirection] = useState<'left' | 'right'>('right');
  const [members, setMembers] = useState<ProjectMember[]>(INITIAL_JOB_DETAIL_MEMBERS);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(INITIAL_PAYMENT_TERMS);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>(INITIAL_PROGRESS_LOGS);

  const handleTabChange = (newTab: TabKey) => {
    if (newTab === activeTab) return;
    const currentIdx = TAB_KEYS.indexOf(activeTab);
    const nextIdx = TAB_KEYS.indexOf(newTab);
    setTabDirection(nextIdx > currentIdx ? 'right' : 'left');
    setActiveTab(newTab);
  };

  // Modals state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddProgressOpen, setIsAddProgressOpen] = useState(false);
  const [isSyncingArito, setIsSyncingArito] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // New Member Form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Account Executive');
  const [newMemberDept, setNewMemberDept] = useState('Account Department');
  const [newMemberBonus, setNewMemberBonus] = useState<number>(10);

  // New Payment Term Form state
  const [newTermName, setNewTermName] = useState('');
  const [newTermPercent, setNewTermPercent] = useState<number>(20);
  const [newTermPlannedDate, setNewTermPlannedDate] = useState('');
  const [newTermDueDate, setNewTermDueDate] = useState('');
  const [newTermPo, setNewTermPo] = useState('');
  const [newTermAcceptance, setNewTermAcceptance] = useState('');
  const [newTermCostSpent, setNewTermCostSpent] = useState<number>(0);

  // New Progress Log Form state
  const [newProgressStatus, setNewProgressStatus] = useState('');
  const [newProgressNextStep, setNewProgressNextStep] = useState('');

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
  };

  const totalPaymentPercent = paymentTerms.reduce((sum, p) => sum + p.percentage, 0);
  const totalPlannedPayment = paymentTerms.reduce((sum, p) => sum + p.plannedAmount, 0);
  const totalActualReceived = paymentTerms.reduce((sum, p) => sum + p.actualReceivedAmount, 0);
  const totalInvoiced = paymentTerms.reduce((sum, p) => sum + p.invoicedAmount, 0);
  const totalCostSpent = paymentTerms.reduce((sum, p) => sum + (p.actualCostSpent || 0), 0);
  const totalCostRemaining = paymentTerms.reduce((sum, p) => sum + (p.actualCostRemaining || 0), 0);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;
    const staff = ALL_STAFF_MEMBERS.find(s => s.name === newMemberName) || {
      name: newMemberName,
      email: `${newMemberName.toLowerCase().replace(/\s+/g, '.')}@squaregroup.com.vn`,
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
      bonusPercent: Number(newMemberBonus),
      assignedBudget: Math.round((job.potentialBudget * Number(newMemberBonus)) / 100),
      kpiCompletion: 90,
      csatScore: 4.8
    };

    setMembers([...members, newMem]);
    setIsAddMemberOpen(false);
    setNewMemberName('');
    setNewMemberBonus(10);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const plannedAmt = Math.round((job.potentialBudget * Number(newTermPercent)) / 100);
    const spentAmt = Number(newTermCostSpent) || 0;
    const newTerm: PaymentTerm = {
      id: `term-${Date.now()}`,
      termCode: `TERM-0${paymentTerms.length + 1}`,
      termName: newTermName || `Milestone ${paymentTerms.length + 1}`,
      percentage: Number(newTermPercent),
      plannedAmount: plannedAmt,
      plannedDate: newTermPlannedDate || new Date().toISOString().split('T')[0],
      dueDate: newTermDueDate || '2026-10-15',
      invoicedAmount: 0,
      actualReceivedAmount: 0,
      actualCostSpent: spentAmt,
      actualCostRemaining: Math.max(0, plannedAmt - spentAmt),
      reconciliationStatus: newTermPo ? 'Synced' : 'Pending_PO',
      poNumber: newTermPo || 'Awaiting PO',
      acceptanceDoc: newTermAcceptance || 'Pending acceptance',
      notes: 'Drafted from JMS, awaiting Arito accounting sync.'
    };
    setPaymentTerms([...paymentTerms, newTerm]);
    setIsAddPaymentOpen(false);
    setNewTermName('');
    setNewTermPo('');
    setNewTermAcceptance('');
    setNewTermCostSpent(0);
  };

  const handleAddProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgressStatus) return;
    const newLog: ProgressLog = {
      id: `prog-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: newProgressStatus,
      nextStep: newProgressNextStep || 'Follow up on delivery',
      byStaff: 'Lê Hải Minh',
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
      setSyncSuccessMessage('2-way sync completed successfully with Arito ERP! Updated 3 accounting entries.');
      setTimeout(() => setSyncSuccessMessage(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ==================== HEADER (7 CORE FIELDS) ==================== */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm transition-all overflow-hidden">
        {/* Tier 1: Breadcrumb & Actions */}
        <div className="px-6 py-3 border-b border-blue-100/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <button 
              onClick={onBack}
              className="hover:text-blue-600 inline-flex items-center gap-1 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Jobs List</span>
            </button>
            <span>/</span>
            <span className="text-blue-700 font-bold">{job.jobCode}</span>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => alert(`Exporting project report ${job.jobCode} to Excel / PDF`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-full transition-all active:scale-95 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Sync alert banner if synced */}
        {syncSuccessMessage && (
          <div className="px-6 py-2.5 bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 border-b border-emerald-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}

        {/* Tier 2: The 7 Core Fields Header */}
        <div className="px-6 py-3.5 space-y-3">
          {/* Row 1: 1. Mã dự án (Job Code), 2. Tên dự án (Job Name), Status */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Mã dự án */}
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200">
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
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex-1 min-w-[200px]">
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

          {/* Row 2: 5 Core Fields Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
            {/* 3. Client */}
            <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                Client
              </span>
              <span className="text-xs font-bold text-slate-900 block truncate" title={job.client}>
                {job.client}
              </span>
              <span className="text-[11px] font-mono text-blue-600 font-semibold block truncate">
                {job.clientCode || 'CLI-UNIL-01'}
              </span>
            </div>

            {/* 4. Contract Client */}
            <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                Contract Client
              </span>
              <span className="text-xs font-bold text-slate-900 block truncate" title={job.contractClient || job.client}>
                {job.contractClient || job.client}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                Legal Entity
              </span>
            </div>

            {/* 5. Category / Job Type */}
            <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
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
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                Brand
              </span>
              <span className="text-xs font-bold text-slate-900 block truncate" title={job.brand}>
                {job.brand}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                Team: {job.team}
              </span>
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
              { id: 'payments' as const, fullLabel: 'Payment Terms & Financials', shortLabel: 'Payments', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 min-w-0 relative z-10 py-3 sm:py-3.5 px-2 sm:px-4 text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 select-none rounded-xl ${
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

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Accounting & Contract</span>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Allocated Cost & C&C Notes</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/60 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Allocated Billing:</span>
                    <span className="font-bold text-slate-900">{formatVND(job.allocatedBilling)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Monthly Cost Smoothing:</span>
                    <span className="text-emerald-600 font-semibold">100% Automated</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/60 space-y-1">
                  <span className="text-slate-500 font-medium block">Contract Notes (C&C):</span>
                  <span className="text-slate-700 block">
                    Đã ký phụ lục hợp đồng thương mại đợt 3. Cam kết giao hàng đủ số lượng kèm biên bản có xác nhận.
                  </span>
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
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs active:scale-95 transition-all"
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

      {/* ==================== TAB 2: CLIENT & TEAM ==================== */}
      {activeTab === 'client' && (
        <div key="tab-client" className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-blue-50 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Partner Profile</span>
                  <h2 className="text-base font-extrabold text-slate-900">Client Profile</h2>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-400 text-xs font-medium">Client Name:</span>
                <span className="col-span-2 font-bold text-slate-900">{job.client}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-400 text-xs font-medium">Contracted Entity:</span>
                <span className="col-span-2 text-slate-700">{job.contractClient}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-400 text-xs font-medium">Brand:</span>
                <span className="col-span-2 font-extrabold text-blue-600">{job.brand}</span>
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
            <div className="flex items-center justify-between border-b border-blue-50 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Delivery Personnel</span>
                  <h2 className="text-base font-extrabold text-slate-900">Department & Assigned Team</h2>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100">
                <div>
                  <span className="text-xs text-slate-400 block">Project Leader:</span>
                  <span className="font-extrabold text-slate-900">{job.projectLeader.name}</span>
                  <span className="text-xs text-slate-500 block">{job.projectLeader.role}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-xs">
                  {job.projectLeader.avatar}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Project Assistants:</span>
                <div className="grid grid-cols-2 gap-2">
                  {job.assistants.map((ast, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-blue-50/30 rounded-xl border border-blue-100">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {ast.avatar}
                      </div>
                      <span className="text-xs font-semibold text-slate-800">{ast.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: MEMBERS ==================== */}
      {activeTab === 'members' && (
        <div key="tab-members" className={`space-y-5 ${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Assigned Personnel</span>
                <h2 className="text-base font-extrabold text-slate-900">Project Team & KPI Evaluation</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsAddMemberOpen(true)}
                className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs active:scale-95 transition-all"
                title="Add Member"
                aria-label="Add Member"
              >
                <Plus className="w-4 h-4" />
                <User className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto border border-blue-100 rounded-2xl custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-blue-50/70 text-blue-900/80 uppercase font-semibold border-b border-blue-100 text-[11px] tracking-wider">
                    <th className="py-3.5 px-4 w-12 text-center whitespace-nowrap">#</th>
                    <th className="py-3.5 px-4 min-w-[200px] whitespace-nowrap">Member</th>
                    <th className="py-3.5 px-4 min-w-[160px] whitespace-nowrap">Department</th>
                    <th className="py-3.5 px-4 min-w-[170px] whitespace-nowrap">Project Role</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap min-w-[110px]">Bonus Share (%)</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[120px]">Assigned Budget</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap min-w-[100px]">KPI Progress</th>
                    <th className="py-3.5 px-4 text-center w-20 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {members.map((mem, idx) => (
                    <tr key={mem.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-xs shrink-0">
                            {mem.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 whitespace-nowrap">{mem.name}</p>
                            <p className="text-[11px] text-slate-400 whitespace-nowrap">{mem.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">{mem.department}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px] whitespace-nowrap inline-block">
                          {mem.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="font-extrabold text-blue-700 text-sm bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          {mem.bonusPercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                        {formatVND(mem.assignedBudget)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="font-bold text-emerald-600 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {mem.kpiCompletion}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setMembers(members.filter(m => m.id !== mem.id))}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
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

      {/* ==================== TAB 4: BILLING & ARITO SYNC ==================== */}
      {activeTab === 'payments' && (
        <div key="tab-payments" className={`space-y-6 ${tabDirection === 'right' ? 'animate-tab-glide-right' : 'animate-tab-glide-left'}`}>
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-50">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Receivable Sync</span>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-blue-600" />
                  <span>Financial Sync: JMS Receivable</span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncArito}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingArito ? 'animate-spin' : ''}`} />
                  <span>{isSyncingArito ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>

            {/* 5-Metric Financial Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 text-xs">
              <div className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100">
                <span className="text-slate-400 block font-bold uppercase text-[10px] tracking-wider">Total Planned (JMS)</span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{formatVND(totalPlannedPayment)}</span>
                <span className="text-[11px] text-blue-600 font-semibold block mt-0.5">Share: {totalPaymentPercent}%</span>
              </div>
              <div className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100">
                <span className="text-indigo-600 block font-bold uppercase text-[10px] tracking-wider">Accounted Amount</span>
                <span className="text-base font-extrabold text-indigo-900 mt-0.5 block">{formatVND(totalInvoiced)}</span>
                <span className="text-[11px] text-indigo-500 font-semibold block mt-0.5">VAT Invoiced</span>
              </div>
              <div className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100">
                <span className="text-emerald-700 block font-bold uppercase text-[10px] tracking-wider">Actual Received</span>
                <span className="text-base font-extrabold text-emerald-800 mt-0.5 block">{formatVND(totalActualReceived)}</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Cash Inflow Matched</span>
              </div>
              <div className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100">
                <span className="text-slate-600 block font-bold uppercase text-[10px] tracking-wider">Cost (Spent / Remaining)</span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{formatVND(totalCostSpent)}</span>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">Remaining: {formatVND(totalCostRemaining)}</span>
              </div>
              <div className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100 col-span-2 sm:col-span-1">
                <span className="text-amber-700 block font-bold uppercase text-[10px] tracking-wider">Receivables</span>
                <span className="text-base font-extrabold text-amber-900 mt-0.5 block">{formatVND(job.potentialBudget - totalActualReceived)}</span>
                <span className="text-[11px] text-amber-600 font-semibold block mt-0.5">Within Payment Term</span>
              </div>
            </div>
          </div>

          {/* Detailed Payment Terms & Financials Table */}
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Payment Milestones & Actual Accounting Tracking
              </h2>
            </div>

            <div className="overflow-x-auto border border-blue-100 rounded-2xl custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-blue-50/70 text-blue-900/80 uppercase font-semibold border-b border-blue-100 text-[11px] tracking-wider">
                    <th className="py-3 px-3 w-8 text-center">#</th>
                    <th className="py-3 px-3 min-w-[90px]">Term Code</th>
                    <th className="py-3 px-4 min-w-[220px]">Term Name</th>
                    <th className="py-3 px-3 text-center min-w-[75px]">Share (%)</th>
                    <th className="py-3 px-3 text-right min-w-[110px]">Value</th>
                    <th className="py-3 px-3 text-center min-w-[100px]">Payment Date</th>
                    <th className="py-3 px-3 text-center min-w-[100px]">Due Date</th>
                    <th className="py-3 px-3 text-right min-w-[120px]">Accounted Amount</th>
                    <th className="py-3 px-3 min-w-[170px]">Cost (Spent / Remaining)</th>
                    <th className="py-3 px-3 min-w-[130px]">Actual Receipt Time</th>
                    <th className="py-3 px-3 min-w-[170px]">Documents (PO / Acceptance)</th>
                    <th className="py-3 px-3 text-center min-w-[100px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50 bg-white">
                  {paymentTerms.map((term, idx) => (
                    <tr key={term.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 text-xs inline-block">
                          {term.termCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {term.termName}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          {term.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-slate-900 whitespace-nowrap">
                        {formatVND(term.plannedAmount)}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap font-medium text-slate-800">
                        {term.plannedDate}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md inline-block text-[11px]">
                          {term.dueDate}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap font-extrabold text-indigo-700">
                        {formatVND(term.invoicedAmount)}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-slate-900">{formatVND(term.actualCostSpent)}</span>
                        <span className="text-slate-400 font-normal mx-1">/</span>
                        <span className="text-slate-500 font-semibold">{formatVND(term.actualCostRemaining)}</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {term.actualReceiptDate ? (
                          <span className="font-semibold text-slate-800 flex items-center gap-1 text-xs">
                            <Clock className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{term.actualReceiptDate}</span>
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px]">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-mono font-semibold text-blue-700">{term.poNumber || '-'}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-medium truncate max-w-[140px]" title={term.acceptanceDoc}>{term.acceptanceDoc || 'Pending'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {term.reconciliationStatus === 'Synced' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Synced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Clock className="w-3 h-3 text-blue-600" />
                            Pending Invoice
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals with rounded-2xl style */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-blue-100 space-y-4 animate-scaleUp">
            <h3 className="text-base font-extrabold text-slate-900">Add Member & SQC Bonus Allocation</h3>
            
            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Employee <span className="text-red-500 font-bold">*</span>
                </label>
                <CustomSelect 
                  value={newMemberName} 
                  onChange={(val) => {
                    setNewMemberName(val);
                    const staff = ALL_STAFF_MEMBERS.find(s => s.name === val);
                    if (staff) {
                      setNewMemberRole(staff.role);
                      setNewMemberDept(staff.department);
                    }
                  }}
                  options={STAFF_OPTIONS}
                  placeholder="-- Choose employee from Square directory --"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <CustomSelect 
                    value={newMemberDept} 
                    onChange={(val) => setNewMemberDept(val)}
                    options={DEPT_OPTIONS}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Role</label>
                  <input 
                    type="text" 
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    placeholder="e.g. Senior Planner"
                    className="w-full p-2 bg-blue-50/40 border border-blue-100 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  SQC Bonus Share (%) <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={newMemberBonus}
                    onChange={(e) => setNewMemberBonus(Number(e.target.value))}
                    required
                    className="w-24 p-2 bg-blue-50 border border-blue-200 rounded-xl font-bold text-sm text-blue-700"
                  />
                  <span className="text-slate-500 font-medium">%</span>
                  <span className="text-slate-400 text-[11px] ml-auto">
                    Equivalent: {formatVND(Math.round((job.potentialBudget * newMemberBonus) / 100))}
                  </span>
                </div>
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
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Payment */}
      {isAddPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-blue-100 space-y-4 animate-scaleUp">
            <h3 className="text-base font-extrabold text-slate-900">Add Payment Milestone</h3>
            
            <form onSubmit={handleAddPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Milestone Name <span className="text-red-500 font-bold">*</span>
                </label>
                <input 
                  type="text" 
                  value={newTermName} 
                  onChange={(e) => setNewTermName(e.target.value)}
                  placeholder="e.g. Milestone 4: Final Acceptance & Retention"
                  required
                  className="w-full p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Payment Share (%) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={newTermPercent}
                    onChange={(e) => setNewTermPercent(Number(e.target.value))}
                    required
                    className="w-full p-2 bg-blue-50 border border-blue-200 rounded-xl font-bold text-sm text-blue-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Calculated Amount</label>
                  <div className="p-2 bg-blue-50/50 rounded-xl font-bold text-slate-800 text-sm">
                    {formatVND(Math.round((job.potentialBudget * newTermPercent) / 100))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Planned Date</label>
                  <input 
                    type="date" 
                    value={newTermPlannedDate}
                    onChange={(e) => setNewTermPlannedDate(e.target.value)}
                    className="w-full p-2 bg-blue-50/40 border border-blue-100 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={newTermDueDate}
                    onChange={(e) => setNewTermDueDate(e.target.value)}
                    className="w-full p-2 bg-blue-50/40 border border-blue-100 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PO Number</label>
                  <input 
                    type="text" 
                    value={newTermPo} 
                    onChange={(e) => setNewTermPo(e.target.value)}
                    placeholder="e.g. PO-UNI-2026-452D"
                    className="w-full p-2 bg-blue-50/40 border border-blue-100 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Cost Spent</label>
                  <input 
                    type="number" 
                    value={newTermCostSpent} 
                    onChange={(e) => setNewTermCostSpent(Number(e.target.value))}
                    placeholder="0"
                    className="w-full p-2 bg-blue-50/40 border border-blue-100 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Acceptance Document</label>
                <input 
                  type="text" 
                  value={newTermAcceptance} 
                  onChange={(e) => setNewTermAcceptance(e.target.value)}
                  placeholder="e.g. BB-NT-Final-Handover"
                  className="w-full p-2 bg-blue-50/40 border border-blue-100 rounded-xl"
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
