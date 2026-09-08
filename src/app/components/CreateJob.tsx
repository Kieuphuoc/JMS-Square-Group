'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Check, Plus, Trash2, 
  Calendar, DollarSign, Users, FileText, Info, User, Building2
} from 'lucide-react';
import { 
  JobItem, CLIENT_LIST, CATEGORIES_LIST, INDUSTRIES_LIST, ALL_STAFF_MEMBERS 
} from '../data/mockJmsData';
import CustomSelect, { CustomSelectOption } from './CustomSelect';

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
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <button 
              type="button" 
              onClick={onCancel}
              className="hover:text-blue-600 inline-flex items-center gap-1 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Jobs List</span>
            </button>
            <span>/</span>
            <span>Initiation</span>
          </div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
            Project Workflow
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <span>Create New Job</span>
            <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              JMS → Finance
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Initialize project details, configure SQC incentive shares, and draft payment terms for Arito Accounting.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-blue-50 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Create Job</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ==================== CARD 1: CORE PROJECT INFO ==================== */}
        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-blue-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Part 1</span>
                <h2 className="text-base font-extrabold text-slate-900">Core Project Information</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Auto Generate Job Code */}
            <div className="md:col-span-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <label className="flex items-center gap-2 font-bold text-slate-800 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoGenCode}
                    onChange={(e) => setAutoGenCode(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Auto-generate Job Code</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Arito allows reusing or reassigning this job code if no accounting journals have been posted by Finance.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-sm bg-white px-3.5 py-1.5 rounded-full border border-blue-200 text-blue-700 shadow-2xs">
                  {autoGenCode ? 'SQUARE-026-455' : customJobCode}
                </span>
                {!autoGenCode && (
                  <input 
                    type="text" 
                    value={customJobCode}
                    onChange={(e) => setCustomJobCode(e.target.value)}
                    placeholder="Custom Code"
                    className="p-1.5 bg-white border border-blue-200 rounded-full font-mono text-xs w-36 px-3"
                  />
                )}
              </div>
            </div>

            {/* Job Name */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                Job Name <span className="text-red-500 font-black text-lg ml-1 inline-block leading-none">*</span>
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Close Up White Attraction Flagship Store 2026..."
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                className="w-full px-4 py-2.5 bg-blue-50/40 border border-blue-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-900 transition-all"
              />
            </div>

            {/* Job Description */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                Job Description
              </label>
              <textarea 
                rows={3}
                placeholder="Describe project scope, deliverables, target audience, venue or special notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-blue-50/40 border border-blue-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 transition-all resize-y"
              />
            </div>

            {/* ==================== CLIENT INFORMATION BLOCK ==================== */}
            <div className="md:col-span-2 p-5 bg-blue-50/40 rounded-2xl border border-blue-100 space-y-4">
              <div className="flex items-center gap-2 border-b border-blue-100 pb-3">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                  Client Information
                </h3>
              </div>

              {/* Row 1: Client, Contract Client, Client Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                    Client <span className="text-red-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                  </label>
                  <CustomSelect 
                    value={selectedClient}
                    onChange={handleClientChange}
                    options={CLIENT_OPTIONS}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                    Contract Client
                  </label>
                  <input 
                    type="text" 
                    value={contractClient}
                    onChange={(e) => setContractClient(e.target.value)}
                    placeholder="e.g. Công ty TNHH Quốc Tế Unilever Việt Nam"
                    className="w-full px-3.5 py-2.5 bg-white border border-blue-100 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 text-xs">
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
                  <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                    Brand <span className="text-red-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    placeholder="e.g. Close Up, OMO, Galaxy..."
                    className="w-full px-3.5 py-2.5 bg-white border border-blue-100 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                    Contact Person Name
                  </label>
                  <input 
                    type="text" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Mr. Nhân Mai (Procurement Manager)"
                    className="w-full px-3.5 py-2.5 bg-white border border-blue-100 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                    Phone
                  </label>
                  <input 
                    type="text" 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. 0903 123 456"
                    className="w-full px-3.5 py-2.5 bg-white border border-blue-100 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. nhan.mai@unilever.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-blue-100 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Category & Industry */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                Category / Job Type <span className="text-red-500 font-black text-lg ml-1 inline-block leading-none">*</span>
              </label>
              <CustomSelect 
                value={category}
                onChange={setCategory}
                options={CATEGORY_OPTIONS}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                Industry
              </label>
              <CustomSelect 
                value={industry}
                onChange={setIndustry}
                options={INDUSTRY_OPTIONS}
              />
            </div>

            {/* Timeline: Start & End required */}
            <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100 md:col-span-2">
              <span className="block font-extrabold text-slate-800 text-xs mb-2">
                Project Timeline (Both Start Date & End Date required)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-semibold">
                    Start Date <span className="text-red-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                  </label>
                  <input 
                    type="date" 
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-blue-100 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-semibold">Planned Kick-off Date</label>
                  <input 
                    type="date" 
                    value={kickoffDate}
                    onChange={(e) => setKickoffDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-blue-100 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-semibold">
                    End Date <span className="text-red-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                  </label>
                  <input 
                    type="date" 
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-blue-100 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Budget & Target GP */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                Potential Budget (VND) <span className="text-red-500 font-black text-lg ml-1 inline-block leading-none">*</span>
              </label>
              <div className="relative">
                <input 
                  type="number"
                  required
                  min="0"
                  step="1000000"
                  value={potentialBudget}
                  onChange={(e) => setPotentialBudget(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-blue-50/40 border border-blue-100 rounded-xl text-sm font-extrabold text-slate-900 focus:bg-white"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-blue-700">
                  {formatVND(potentialBudget)}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                Target Gross Profit (%)
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={targetGp}
                  onChange={(e) => setTargetGp(Number(e.target.value))}
                  className="w-28 px-4 py-2.5 bg-blue-50/40 border border-blue-100 rounded-xl text-sm font-extrabold text-emerald-700"
                />
                <span className="text-slate-500 font-bold">%</span>
                <span className="text-[11px] text-slate-400 ml-auto font-medium">Square Benchmark: 30% - 35%</span>
              </div>
            </div>

            {/* Team & Leader */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                Assigned Team
              </label>
              <CustomSelect 
                value={team}
                onChange={setTeam}
                options={TEAM_OPTIONS}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-xs">
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
        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Part 2</span>
                <h2 className="text-base font-extrabold text-slate-900">
                  Team Members & SQC Bonus % <span className="text-red-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs bg-blue-50/60 px-3.5 py-1.5 rounded-full border border-blue-100">
                <span className="text-slate-600 font-medium">Total Bonus Allocated:</span>
                <span className={`font-extrabold text-sm ${totalBonusPercent === 100 ? 'text-emerald-600' : 'text-blue-700'}`}>
                  {totalBonusPercent}%
                </span>
                <span className="text-slate-400">/ 100%</span>
              </div>
              <button
                type="button"
                onClick={handleAddMemberRow}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full active:scale-95 transition-all"
                title="Add Member"
                aria-label="Add Member"
              >
                <Plus className="w-3.5 h-3.5" />
                <User className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-blue-100 rounded-2xl custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-blue-50/70 text-blue-900/80 uppercase font-semibold border-b border-blue-100">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 min-w-[200px]">Assigned Member</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Project Role</th>
                  <th className="py-3 px-4 text-center min-w-[120px]">
                    Bonus Share (%) <span className="text-red-500 font-black text-lg ml-1 inline-block leading-none">*</span>
                  </th>
                  <th className="py-3 px-4 text-right min-w-[140px]">Incentive Amount</th>
                  <th className="py-3 px-4 text-center w-16">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {members.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4">
                      <input 
                        type="text"
                        value={m.department}
                        onChange={(e) => handleUpdateMember(m.id, 'department', e.target.value)}
                        className="w-full p-2 bg-blue-50/40 border border-blue-100 rounded-xl text-xs font-medium"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input 
                        type="text"
                        value={m.role}
                        onChange={(e) => handleUpdateMember(m.id, 'role', e.target.value)}
                        className="w-full p-2 bg-blue-50/40 border border-blue-100 rounded-xl text-xs font-medium"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          value={m.bonusPercent}
                          onChange={(e) => handleUpdateMember(m.id, 'bonusPercent', Number(e.target.value))}
                          className="w-16 p-1.5 text-center font-extrabold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl text-xs"
                        />
                        <span className="font-bold text-slate-500">%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {formatVND(Math.round((potentialBudget * m.bonusPercent) / 100))}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        type="button"
                        onClick={() => handleRemoveMember(m.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-full"
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
        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Part 3</span>
                <h2 className="text-base font-extrabold text-slate-900">Payment Terms Draft (Milestones)</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs bg-blue-50/60 px-3.5 py-1.5 rounded-full border border-blue-100">
                <span className="text-slate-600 font-medium">Total Milestone Share:</span>
                <span className={`font-extrabold text-sm ${totalPaymentPercent === 100 ? 'text-emerald-600' : 'text-blue-700'}`}>
                  {totalPaymentPercent}%
                </span>
                <span className="text-slate-400">/ 100%</span>
              </div>
              <button
                type="button"
                onClick={handleAddPaymentRow}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-blue-100 rounded-2xl custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-blue-50/70 text-blue-900/80 uppercase font-semibold border-b border-blue-100">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 min-w-[240px]">Milestone Name</th>
                  <th className="py-3 px-4 text-center min-w-[100px]">Share (%)</th>
                  <th className="py-3 px-4 text-right min-w-[150px]">Planned Amount (VND)</th>
                  <th className="py-3 px-4 text-center min-w-[140px]">Planned Date</th>
                  <th className="py-3 px-4 min-w-[200px]">Trigger Condition</th>
                  <th className="py-3 px-4 text-center w-16">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {paymentTerms.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <input 
                        type="text"
                        value={p.name}
                        onChange={(e) => handleUpdatePayment(p.id, 'name', e.target.value)}
                        className="w-full p-2 bg-blue-50/40 border border-blue-100 rounded-xl font-bold text-xs text-slate-900"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          value={p.percent}
                          onChange={(e) => handleUpdatePayment(p.id, 'percent', Number(e.target.value))}
                          className="w-16 p-1.5 text-center font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl text-xs"
                        />
                        <span className="font-bold text-slate-500">%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {formatVND(Math.round((potentialBudget * p.percent) / 100))}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input 
                        type="date"
                        value={p.date}
                        onChange={(e) => handleUpdatePayment(p.id, 'date', e.target.value)}
                        className="p-2 bg-blue-50/40 border border-blue-100 rounded-xl text-xs font-semibold"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input 
                        type="text"
                        value={p.condition}
                        onChange={(e) => handleUpdatePayment(p.id, 'condition', e.target.value)}
                        placeholder="Sign contract, stage acceptance..."
                        className="w-full p-2 bg-blue-50/40 border border-blue-100 rounded-xl text-xs text-slate-700 font-medium"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        type="button"
                        onClick={() => handleRemovePayment(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-full"
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
        <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Once created, this project will appear in Job List and automatically connect to Arito Receivable Accounting.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-blue-50 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
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
