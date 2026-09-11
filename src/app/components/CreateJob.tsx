'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Check, Plus, Trash2, 
  DollarSign, Users, FileText, Info, Building2
} from 'lucide-react';
import { 
  JobItem, CLIENT_LIST, CATEGORIES_LIST, INDUSTRIES_LIST, ALL_STAFF_MEMBERS 
} from '../data/mockJmsData';
import CustomSelect, { CustomSelectOption } from './CustomSelect';
import CustomDatePicker from './CustomDatePicker';

const CLIENT_OPTIONS: CustomSelectOption[] = CLIENT_LIST.map(c => ({
  value: c.name,
  label: c.name,
  sublabel: c.code,
}));

const CLIENT_TYPE_OPTIONS: CustomSelectOption[] = [
  { value: 'New', label: 'New Client' },
  { value: 'Existing', label: 'Existing Client' },
  { value: 'Key Account', label: 'Key Account' },
];

const CATEGORY_OPTIONS: CustomSelectOption[] = CATEGORIES_LIST.map(cat => ({
  value: cat,
  label: cat,
}));

const INDUSTRY_OPTIONS: CustomSelectOption[] = INDUSTRIES_LIST.map(ind => ({
  value: ind,
  label: ind,
}));

const TEAM_OPTIONS: CustomSelectOption[] = [
  { value: 'Team Nghi', label: 'Team Nghi', sublabel: 'Key Accounts' },
  { value: 'Team Ngân', label: 'Team Ngân', sublabel: 'FMCG & Tech' },
  { value: 'Team Thảo', label: 'Team Thảo', sublabel: 'Experiential' },
  { value: 'Team Huy', label: 'Team Huy', sublabel: 'Production Hub' },
];

const STAFF_OPTIONS: CustomSelectOption[] = ALL_STAFF_MEMBERS.map(s => ({
  value: s.name,
  label: s.name,
  sublabel: `${s.role} (${s.department})`,
}));

interface CreateJobProps {
  onCancel: () => void;
  onSubmit: (newJob: JobItem) => void;
}

interface TempMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bonusPercent: number;
}

interface TempPaymentTerm {
  id: string;
  name: string;
  percent: number;
  date: string;
  condition: string;
}

export default function CreateJob({ onCancel, onSubmit }: CreateJobProps) {
  // Card 1: Core Info state
  const [autoGenCode, setAutoGenCode] = useState(true);
  const [customJobCode, setCustomJobCode] = useState('SQUARE-026-455');
  const [jobName, setJobName] = useState('');
  const [selectedClient, setSelectedClient] = useState(CLIENT_LIST[0]?.name || '');
  const [selectedBrand, setSelectedBrand] = useState(CLIENT_LIST[0]?.brands[0] || '');
  const [contractClient, setContractClient] = useState('Công ty TNHH Quốc Tế Unilever Việt Nam');
  const [clientType, setClientType] = useState('New');
  const [contactName, setContactName] = useState('Mr. Nhân Mai (Procurement Manager)');
  const [contactPhone, setContactPhone] = useState('0903 123 456');
  const [contactEmail, setContactEmail] = useState('nhan.mai@unilever.com');
  const [category, setCategory] = useState(CATEGORIES_LIST[0]);
  const [industry, setIndustry] = useState(INDUSTRIES_LIST[0]);
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-10-15');
  const [kickoffDate, setKickoffDate] = useState('2026-09-18');
  const [potentialBudget, setPotentialBudget] = useState<number>(350000000);
  const [targetGp, setTargetGp] = useState<number>(32);
  const [team, setTeam] = useState('Team Nghi');
  const [projectLeaderName, setProjectLeaderName] = useState('Lê Thị Mỹ Duyên');
  const [description, setDescription] = useState('');

  // Card 2: Members & Bonus % state (SQC mandatory)
  const [members, setMembers] = useState<TempMember[]>([
    { id: '1', name: 'Lê Thị Mỹ Duyên', role: 'Project Leader', department: 'Account', bonusPercent: 50 },
    { id: '2', name: 'Lê Hải Minh', role: 'Account Executive', department: 'Account', bonusPercent: 30 },
    { id: '3', name: 'Bùi Gia Huy', role: 'Production Lead', department: 'Production', bonusPercent: 20 },
  ]);

  // Card 3: Payment terms draft state
  const [paymentTerms, setPaymentTerms] = useState<TempPaymentTerm[]>([
    { id: 'p1', name: 'Đợt 1: Tạm ứng 50% sau khi ký hợp đồng', percent: 50, date: '2026-09-20', condition: 'Ký HĐ & Nhận PO' },
    { id: 'p2', name: 'Đợt 2: Thanh toán 30% khi hoàn thành 50% khối lượng', percent: 30, date: '2026-10-05', condition: 'Nghiệm thu giai đoạn 1' },
    { id: 'p3', name: 'Đợt 3: Quyết toán 20% còn lại', percent: 20, date: '2026-10-25', condition: 'Biên bản nghiệm thu tổng kết' },
  ]);

  const totalBonusPercent = members.reduce((sum, m) => sum + m.bonusPercent, 0);
  const totalPaymentPercent = paymentTerms.reduce((sum, p) => sum + p.percent, 0);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
  };

  const handleClientChange = (clientName: string) => {
    setSelectedClient(clientName);
    const found = CLIENT_LIST.find(c => c.name === clientName);
    if (found && found.brands.length > 0) {
      setSelectedBrand(found.brands[0]);
    }
    if (clientName === 'Unilever Việt Nam') {
      setContractClient('Công ty TNHH Quốc Tế Unilever Việt Nam');
      setContactName('Mr. Nhân Mai (Procurement Manager)');
      setContactPhone('0903 123 456');
      setContactEmail('nhan.mai@unilever.com');
    } else if (clientName === 'Samsung Electronics Vina') {
      setContractClient('Công ty TNHH Điện Tử Samsung Vina');
      setContactName('Ms. Thu Trang (Brand Director)');
      setContactPhone('0912 888 999');
      setContactEmail('thu.trang@samsung.com');
    } else if (clientName === 'Shopee Việt Nam') {
      setContractClient('Công ty TNHH Shopee Việt Nam');
      setContactName('Mr. Tuấn Anh (Marketing Lead)');
      setContactPhone('0988 555 666');
      setContactEmail('tuan.anh@shopee.com');
    } else if (clientName === 'Nestle Việt Nam') {
      setContractClient('Công ty TNHH Nestlé Việt Nam');
      setContactName('Ms. Mai Lan (Trade MKT)');
      setContactPhone('0908 777 888');
      setContactEmail('mai.lan@nestle.com');
    } else {
      setContractClient(`Công ty TNHH ${clientName}`);
    }
  };

  const handleAddMemberRow = () => {
    const defaultStaff = ALL_STAFF_MEMBERS[members.length % ALL_STAFF_MEMBERS.length];
    const newM: TempMember = {
      id: String(Date.now()),
      name: defaultStaff.name,
      role: defaultStaff.role,
      department: defaultStaff.department,
      bonusPercent: 10,
    };
    setMembers([...members, newM]);
  };

  const handleUpdateMember = (id: string, field: keyof TempMember, value: any) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleAddPaymentRow = () => {
    const newP: TempPaymentTerm = {
      id: String(Date.now()),
      name: `Đợt ${paymentTerms.length + 1}: Thanh toán tiếp theo`,
      percent: 10,
      date: '2026-10-30',
      condition: 'Nghiệm thu giai đoạn',
    };
    setPaymentTerms([...paymentTerms, newP]);
  };

  const handleUpdatePayment = (id: string, field: keyof TempPaymentTerm, value: any) => {
    setPaymentTerms(paymentTerms.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleRemovePayment = (id: string) => {
    setPaymentTerms(paymentTerms.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobName.trim()) {
      alert('Please enter the Job Name!');
      return;
    }
    if (!startDate || !endDate) {
      alert('Please select both Start Date and End Date!');
      return;
    }
    if (totalBonusPercent !== 100) {
      const confirmSubmit = window.confirm(
        `Warning: Total SQC bonus allocation is ${totalBonusPercent}% (not 100%). Do you wish to proceed?`
      );
      if (!confirmSubmit) return;
    }

    const newJob: JobItem = {
      id: `job-${Date.now()}`,
      jobCode: autoGenCode ? customJobCode : customJobCode,
      contractCode: '',
      isLocked: false,
      jobName,
      client: selectedClient,
      clientCode: CLIENT_LIST.find(c => c.name === selectedClient)?.code || 'CLI-NEW',
      contractClient,
      clientType,
      contactPerson: {
        name: contactName,
        phone: contactPhone,
        email: contactEmail,
      },
      brand: selectedBrand,
      category,
      jobType: category,
      industry,
      potentialBudget: Number(potentialBudget),
      allocatedBilling: 0,
      grossProfitPercent: Number(targetGp),
      startDate,
      endDate,
      kickoffDate: kickoffDate || startDate,
      status: 'Running',
      team,
      projectLeader: {
        name: projectLeaderName,
        avatar: projectLeaderName[0] || 'L',
        role: 'Project Leader',
      },
      assistants: [],
      accountLead: {
        name: 'Trần Minh Quang',
        avatar: 'Q',
      },
      description,
      briefedBilling: Number(potentialBudget),
      contractBilling: Number(potentialBudget),
      invoicedBilling: 0,
      receivableBilling: Number(potentialBudget),
      actualReceived: 0,
      remindersCount: 0,
      membersCount: members.length,
    };

    onSubmit(newJob);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header Card - Frosted Glass & Square Red Gradient */}
      <div className="relative overflow-hidden rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-white/85 via-[#fff5f5]/80 to-[#fee2e2]/75 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Soft ambient blur effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-400/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-red-300/15 rounded-full blur-2xl pointer-events-none -mb-10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs text-zinc-600 mb-2 font-semibold">
            <button 
              type="button" 
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 hover:bg-white text-zinc-700 rounded-full border border-white/60 shadow-2xs backdrop-blur-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Jobs List</span>
            </button>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-500 font-medium">Initiation</span>
          </div>

          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-[#e11d24] mb-1">
            Project Workflow
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-3">
            <span>Create New Job</span>
            <span className="text-xs font-black px-3.5 py-1 rounded-full bg-red-500/10 text-[#e11d24] border border-red-200/80 shadow-2xs backdrop-blur-xs">
              JMS → Finance
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 font-medium mt-1 max-w-2xl leading-relaxed">
            Initialize project details, configure SQC incentive shares, and draft payment terms for Arito Accounting.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0 relative z-10">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-zinc-700 bg-white/80 hover:bg-white rounded-full border border-white/60 shadow-2xs backdrop-blur-md transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-black text-white bg-[#e11d24] hover:bg-[#b91c1c] rounded-full shadow-lg shadow-red-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Create Job</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ==================== CARD 1: CORE PROJECT INFO ==================== */}
        <div className="bg-white/80 backdrop-blur-2xl p-6 sm:p-8 rounded-[28px] border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] space-y-6">
          <div className="flex items-center justify-between border-b border-black/[0.04] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[16px] bg-red-500/10 text-[#e11d24] flex items-center justify-center font-bold shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-black text-[#e11d24] uppercase tracking-wider block">Part 1</span>
                <h2 className="text-base sm:text-lg font-black text-[#18181b]">Core Project Information</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Auto Generate Job Code */}
            <div className="md:col-span-2 p-4 sm:p-5 bg-[#f6f6f9] rounded-[22px] border border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <label className="flex items-center gap-2.5 font-bold text-[#18181b] text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoGenCode}
                    onChange={(e) => setAutoGenCode(e.target.checked)}
                    className="w-4 h-4 rounded text-[#18181b] focus:ring-[#18181b] accent-[#18181b]"
                  />
                  <span>Auto-generate Job Code</span>
                </label>
                <p className="text-[11px] text-zinc-500 font-medium">
                  Arito allows reusing or reassigning this job code if no accounting journals have been posted by Finance.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-mono font-black text-sm bg-white px-4 py-2 rounded-full border border-black/[0.06] text-[#18181b] shadow-2xs">
                  {autoGenCode ? 'SQUARE-026-455' : customJobCode}
                </span>
                {!autoGenCode && (
                  <input 
                    type="text" 
                    value={customJobCode}
                    onChange={(e) => setCustomJobCode(e.target.value)}
                    placeholder="Custom Code"
                    className="px-3.5 py-1.5 bg-white border border-black/[0.08] rounded-full font-mono text-xs w-36 focus:border-[#18181b] outline-none"
                  />
                )}
              </div>
            </div>

            {/* Job Name */}
            <div className="md:col-span-2">
              <label className="block font-bold text-zinc-700 mb-2 text-xs">
                Job Name <span className="text-rose-500 font-black text-lg ml-1 inline-block leading-none">*</span>
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Close Up White Attraction Flagship Store 2026..."
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                className="w-full px-4 py-3 bg-[#f6f6f9] border border-black/[0.05] rounded-[18px] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-[#18181b] font-semibold text-[#18181b] transition-all placeholder:text-zinc-400"
              />
            </div>

            {/* Job Description */}
            <div className="md:col-span-2">
              <label className="block font-bold text-zinc-700 mb-2 text-xs">
                Job Description
              </label>
              <textarea 
                rows={3}
                placeholder="Describe project scope, deliverables, target audience, venue or special notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-[#f6f6f9] border border-black/[0.05] rounded-[18px] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-[#18181b] font-medium text-[#18181b] transition-all placeholder:text-zinc-400 resize-y"
              />
            </div>

            {/* ==================== CLIENT INFORMATION BLOCK ==================== */}
            <div className="md:col-span-2 p-5 sm:p-6 bg-[#f6f6f9] rounded-[24px] border border-black/[0.04] space-y-4">
              <div className="flex items-center gap-2 border-b border-black/[0.05] pb-3">
                <Building2 className="w-4 h-4 text-[#6d28d9]" />
                <h3 className="font-black text-[#18181b] text-xs uppercase tracking-wider">
                  Client Information
                </h3>
              </div>

              {/* Row 1: Client, Contract Client, Client Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
                    Client <span className="text-rose-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                  </label>
                  <CustomSelect 
                    value={selectedClient}
                    onChange={handleClientChange}
                    options={CLIENT_OPTIONS}
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
                    Contract Client
                  </label>
                  <input 
                    type="text" 
                    value={contractClient}
                    onChange={(e) => setContractClient(e.target.value)}
                    placeholder="e.g. Công ty TNHH Quốc Tế Unilever Việt Nam"
                    className="w-full px-3.5 py-2.5 bg-white border border-black/[0.06] rounded-[16px] text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-[#18181b] transition-all placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
                    Client Type
                  </label>
                  <CustomSelect 
                    value={clientType}
                    onChange={setClientType}
                    options={CLIENT_TYPE_OPTIONS}
                  />
                </div>
              </div>

              {/* Row 2: Brand, Contact Name, Phone, Email */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
                    Brand <span className="text-rose-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    placeholder="e.g. Close Up, OMO, Galaxy..."
                    className="w-full px-3.5 py-2.5 bg-white border border-black/[0.06] rounded-[16px] text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-[#18181b] transition-all placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
                    Contact Person Name
                  </label>
                  <input 
                    type="text" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Mr. Nhân Mai (Procurement Manager)"
                    className="w-full px-3.5 py-2.5 bg-white border border-black/[0.06] rounded-[16px] text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-[#18181b] transition-all placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
                    Phone
                  </label>
                  <input 
                    type="text" 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. 0903 123 456"
                    className="w-full px-3.5 py-2.5 bg-white border border-black/[0.06] rounded-[16px] text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-[#18181b] transition-all placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. nhan.mai@unilever.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-black/[0.06] rounded-[16px] text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-[#18181b] transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>
            </div>

            {/* Category & Industry */}
            <div>
              <label className="block font-bold text-zinc-700 mb-2 text-xs">
                Category / Job Type <span className="text-rose-500 font-black text-lg ml-1 inline-block leading-none">*</span>
              </label>
              <CustomSelect 
                value={category}
                onChange={setCategory}
                options={CATEGORY_OPTIONS}
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-2 text-xs">
                Industry
              </label>
              <CustomSelect 
                value={industry}
                onChange={setIndustry}
                options={INDUSTRY_OPTIONS}
              />
            </div>

            {/* Timeline: Start & End required */}
            <div className="p-5 bg-[#f6f6f9] rounded-[24px] border border-black/[0.04] md:col-span-2 space-y-3">
              <span className="block font-black text-[#18181b] text-xs uppercase tracking-wider">
                Project Timeline (Both Start Date & End Date required)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1.5 font-bold">
                    Start Date <span className="text-rose-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                  </label>
                  <CustomDatePicker 
                    value={startDate}
                    onChange={setStartDate}
                    title="Start Date"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1.5 font-bold">Planned Kick-off Date</label>
                  <CustomDatePicker 
                    value={kickoffDate}
                    onChange={setKickoffDate}
                    title="Planned Kick-off Date"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1.5 font-bold">
                    End Date <span className="text-rose-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                  </label>
                  <CustomDatePicker 
                    value={endDate}
                    onChange={setEndDate}
                    title="End Date"
                    align="right"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Budget & Target GP */}
            <div>
              <label className="block font-bold text-zinc-700 mb-2 text-xs">
                Potential Budget (VND) <span className="text-rose-500 font-black text-lg ml-1 inline-block leading-none">*</span>
              </label>
              <div className="relative">
                <input 
                  type="number"
                  required
                  min="0"
                  step="1000000"
                  value={potentialBudget}
                  onChange={(e) => setPotentialBudget(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-[#f6f6f9] border border-black/[0.05] rounded-[18px] text-sm font-black text-[#18181b] focus:bg-white focus:outline-none focus:border-[#18181b] transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-[#6d28d9] bg-white px-3 py-1 rounded-full border border-purple-200 shadow-2xs">
                  {formatVND(potentialBudget)}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-2 text-xs">
                Target Gross Profit (%)
              </label>
              <div className="flex items-center gap-2.5">
                <input 
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={targetGp}
                  onChange={(e) => setTargetGp(Number(e.target.value))}
                  className="w-28 px-4 py-3 bg-[#f6f6f9] border border-black/[0.05] rounded-[18px] text-sm font-black text-emerald-700 focus:bg-white focus:outline-none focus:border-emerald-600 transition-all"
                />
                <span className="text-zinc-600 font-bold">%</span>
                <span className="text-[11px] text-zinc-400 ml-auto font-medium">Square Benchmark: 30% - 35%</span>
              </div>
            </div>

            {/* Team & Leader */}
            <div>
              <label className="block font-bold text-zinc-700 mb-2 text-xs">
                Assigned Team
              </label>
              <CustomSelect 
                value={team}
                onChange={setTeam}
                options={TEAM_OPTIONS}
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-2 text-xs">
                Project Leader
              </label>
              <CustomSelect 
                value={projectLeaderName}
                onChange={setProjectLeaderName}
                options={STAFF_OPTIONS}
              />
            </div>
          </div>
        </div>

        {/* ==================== CARD 2: MEMBERS & SQC BONUS % ==================== */}
        <div className="bg-white/80 backdrop-blur-2xl p-6 sm:p-8 rounded-[28px] border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.04] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[16px] bg-red-500/10 text-[#e11d24] flex items-center justify-center font-bold shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-black text-[#e11d24] uppercase tracking-wider block">Part 2</span>
                <h2 className="text-base sm:text-lg font-black text-[#18181b]">
                  Team Members & SQC Bonus % <span className="text-rose-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-black/[0.04]">
                <span className="text-zinc-500 font-semibold">Total Bonus:</span>
                <span className={`font-black text-sm ${totalBonusPercent === 100 ? 'text-emerald-600' : 'text-[#e11d24]'}`}>
                  {totalBonusPercent}%
                </span>
                <span className="text-zinc-400">/ 100%</span>
              </div>
              <button
                type="button"
                onClick={handleAddMemberRow}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#e11d24] hover:bg-[#b91c1c] rounded-full active:scale-95 shadow-md shadow-red-600/25 transition-all cursor-pointer"
                title="Add Member"
                aria-label="Add Member"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-white/60 rounded-[24px] bg-white/60 backdrop-blur-md custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/60 text-zinc-500 uppercase font-black text-[11px] tracking-wider border-b border-black/[0.04]">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 min-w-[200px]">Assigned Member</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Project Role</th>
                  <th className="py-3 px-4 text-center min-w-[120px]">
                    Bonus Share (%) <span className="text-rose-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                  </th>
                  <th className="py-3 px-4 text-right min-w-[140px]">Incentive Amount</th>
                  <th className="py-3 px-4 text-center w-16">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {members.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-white/70 transition-colors">
                    <td className="py-3.5 px-4 text-center text-zinc-400 font-bold">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <CustomSelect 
                        value={m.name}
                        onChange={(val) => {
                          const staff = ALL_STAFF_MEMBERS.find(s => s.name === val);
                          if (staff) {
                            setMembers(members.map(member => member.id === m.id ? {
                              ...member,
                              name: staff.name,
                              department: staff.department,
                              role: staff.role
                            } : member));
                          } else {
                            handleUpdateMember(m.id, 'name', val);
                          }
                        }}
                        options={STAFF_OPTIONS}
                        size="sm"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <input 
                        type="text"
                        value={m.department}
                        onChange={(e) => handleUpdateMember(m.id, 'department', e.target.value)}
                        className="w-full px-3 py-2 bg-white/70 border border-black/[0.04] rounded-[14px] text-xs font-semibold text-zinc-800 focus:bg-white focus:border-[#e11d24] outline-none transition-all"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <input 
                        type="text"
                        value={m.role}
                        onChange={(e) => handleUpdateMember(m.id, 'role', e.target.value)}
                        className="w-full px-3 py-2 bg-white/70 border border-black/[0.04] rounded-[14px] text-xs font-semibold text-zinc-800 focus:bg-white focus:border-[#e11d24] outline-none transition-all"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          value={m.bonusPercent}
                          onChange={(e) => handleUpdateMember(m.id, 'bonusPercent', Number(e.target.value))}
                          className="w-16 py-1.5 px-2 text-center font-black text-[#e11d24] bg-red-50 border border-red-200/80 rounded-[12px] text-xs focus:bg-white focus:border-[#e11d24] outline-none transition-all"
                        />
                        <span className="font-bold text-zinc-500">%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-zinc-900">
                      {formatVND(Math.round((potentialBudget * m.bonusPercent) / 100))}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        type="button"
                        onClick={() => handleRemoveMember(m.id)}
                        className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
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

        {/* ==================== CARD 3: PAYMENT TERMS DRAFT ==================== */}
        <div className="bg-white/80 backdrop-blur-2xl p-6 sm:p-8 rounded-[28px] border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.04] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[16px] bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider block">Part 3</span>
                <h2 className="text-base sm:text-lg font-black text-[#18181b]">Payment Terms Draft (Milestones)</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-black/[0.04]">
                <span className="text-zinc-500 font-semibold">Total Share:</span>
                <span className={`font-black text-sm ${totalPaymentPercent === 100 ? 'text-emerald-600' : 'text-[#e11d24]'}`}>
                  {totalPaymentPercent}%
                </span>
                <span className="text-zinc-400">/ 100%</span>
              </div>
              <button
                type="button"
                onClick={handleAddPaymentRow}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#e11d24] hover:bg-[#b91c1c] rounded-full active:scale-95 shadow-md shadow-red-600/25 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-white/60 rounded-[24px] bg-white/60 backdrop-blur-md custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/60 text-zinc-500 uppercase font-black text-[11px] tracking-wider border-b border-black/[0.04]">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 min-w-[240px]">Milestone Name</th>
                  <th className="py-3 px-4 text-center min-w-[100px]">Share (%)</th>
                  <th className="py-3 px-4 text-right min-w-[150px]">Planned Amount (VND)</th>
                  <th className="py-3 px-4 text-center min-w-[140px]">Planned Date</th>
                  <th className="py-3 px-4 min-w-[200px]">Trigger Condition</th>
                  <th className="py-3 px-4 text-center w-16">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {paymentTerms.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-white/70 transition-colors">
                    <td className="py-3.5 px-4 text-center text-zinc-400 font-bold">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <input 
                        type="text"
                        value={p.name}
                        onChange={(e) => handleUpdatePayment(p.id, 'name', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white/70 border border-black/[0.04] rounded-[14px] font-black text-xs text-[#18181b] focus:bg-white focus:border-[#e11d24] outline-none transition-all"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          value={p.percent}
                          onChange={(e) => handleUpdatePayment(p.id, 'percent', Number(e.target.value))}
                          className="w-16 py-1.5 px-2 text-center font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-[12px] text-xs focus:bg-white focus:border-emerald-500 outline-none transition-all"
                        />
                        <span className="font-bold text-zinc-500">%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-zinc-900">
                      {formatVND(Math.round((potentialBudget * p.percent) / 100))}
                    </td>
                    <td className="py-3.5 px-4 text-center min-w-[150px]">
                      <CustomDatePicker 
                        value={p.date}
                        onChange={(val) => handleUpdatePayment(p.id, 'date', val)}
                        title="Planned Date"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <input 
                        type="text"
                        value={p.condition}
                        onChange={(e) => handleUpdatePayment(p.id, 'condition', e.target.value)}
                        placeholder="Sign contract, stage acceptance..."
                        className="w-full px-3.5 py-2 bg-white/70 border border-black/[0.04] rounded-[14px] text-xs text-zinc-700 font-medium focus:bg-white focus:border-[#e11d24] outline-none transition-all"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        type="button"
                        onClick={() => handleRemovePayment(p.id)}
                        className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                        title="Remove milestone"
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

        {/* Bottom Submission Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-7 bg-white/80 backdrop-blur-2xl rounded-[28px] border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] gap-4">
          <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
            <div className="w-7 h-7 rounded-full bg-red-500/10 text-[#e11d24] flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <span>Once created, this project will appear in Job List and automatically connect to Arito Receivable Accounting.</span>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-zinc-600 hover:text-zinc-900 bg-white/80 hover:bg-white rounded-full border border-white/60 shadow-2xs backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-2.5 text-xs sm:text-sm font-black text-white bg-[#e11d24] hover:bg-[#b91c1c] rounded-full shadow-lg shadow-red-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Create Job</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
