'use client';

import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, Briefcase, FileText, 
  Menu, X, ChevronRight, ChevronLeft, CheckCircle,
  Building2, ChevronDown, Check, ArrowLeft
} from 'lucide-react';
import { INITIAL_JOBS, JobItem } from './data/mockJmsData';
import JobList from './components/JobList';
import JobDetail from './components/JobDetail';
import CreateJob from './components/CreateJob';
import Dashboard from './components/Dashboard';
import AritoChatbotWidget from './components/AritoChatbotWidget';

export interface WorkingEntity {
  code: string;
  name: string;
}

const WORKING_ENTITIES: WorkingEntity[] = [
  {
    code: 'SQUARE-VN',
    name: 'SQUARE-VN',
  },
  {
    code: 'DELTA',
    name: 'DELTA',
  },
  {
    code: 'BIZ-EYES',
    name: 'BIZ-EYES',
  },
];

type ViewMode = 'dashboard' | 'job-list' | 'job-detail' | 'create-job';

export default function JmsPage() {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [jobs, setJobs] = useState<JobItem[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobItem>(INITIAL_JOBS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<string>('SQUARE-VN');
  const [isEntityDropdownOpen, setIsEntityDropdownOpen] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const mainContainerRef = useRef<HTMLElement>(null);

  // Select entity handler
  const handleSelectEntity = (entityCode: string) => {
    setSelectedEntity(entityCode);
    setIsEntityDropdownOpen(false);
    showToast(`Đã chọn đơn vị làm việc: ${entityCode}`);
  };

  // Trigger toast
  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Switch view with responsive auto-close for mobile and instant scroll-to-top
  const handleViewChange = (view: ViewMode) => {
    setActiveView(view);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = 0;
    }
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  // Switch to job detail
  const handleSelectJob = (job: JobItem) => {
    setSelectedJob(job);
    handleViewChange('job-detail');
    // Ensure scroll position resets to top on the next animation frame
    requestAnimationFrame(() => {
      if (mainContainerRef.current) {
        mainContainerRef.current.scrollTop = 0;
      }
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    });
  };

  // Switch to create job
  const handleNavigateCreateJob = () => {
    handleViewChange('create-job');
  };

  // Submit new job
  const handleCreateJobSubmit = (newJob: JobItem) => {
    setJobs([newJob, ...jobs]);
    setSelectedJob(newJob);
    handleViewChange('job-detail');
    showToast(`Successfully created Job ${newJob.jobCode} and synced with Arito!`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f2f1f6] text-slate-800 relative">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ==================== LEFT SIDEBAR ==================== */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1A0A0C] text-white shadow-2xl lg:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out lg:static shrink-0 lg:my-3 lg:ml-3 lg:h-[calc(100vh-24px)] lg:rounded-[32px] overflow-hidden border border-white/5 ${
          isSidebarOpen 
            ? 'w-64 translate-x-0' 
            : 'max-lg:-translate-x-full lg:w-20'
        }`}
      >
        {/* Brand & Platform Header */}
        <div className="h-16 flex items-center border-b border-white/10 bg-[#1A0A0C] px-4">
          {isSidebarOpen ? (
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex items-center justify-center bg-white px-2.5 py-1 rounded-full shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brands/logo_square.png"
                    alt="Square Communications"
                    className="h-[24px] w-auto max-w-[125px] object-contain"
                  />
                </div>
                <span className="text-[10px] text-[#D0342A] font-black tracking-wider uppercase bg-white/10 px-2.5 py-0.5 rounded-full border border-[#D0342A]/30 shrink-0">
                  JMS
                </span>
              </div>

              {/* Desktop collapse button */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="hidden lg:flex p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                title="Thu gọn sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Mobile close button */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                title="Đóng sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center px-1">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="w-12 h-12 rounded-[18px] bg-white/10 hover:bg-white/15 border border-white/5 flex items-center justify-center transition-all duration-200 cursor-pointer group relative shadow-2xs"
                title="Mở rộng sidebar"
              >
                {/* Square favicon brand icon */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/favicon.png"
                  alt="Square Group"
                  className="w-7 h-7 object-contain group-hover:scale-90 transition-transform"
                />
                {/* Hover reveal ChevronRight icon */}
                <div className="absolute inset-0 bg-[#D0342A] text-white rounded-[18px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-150 shadow-sm font-bold">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div id="sidebar-nav" className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {/* 1. Dashboard */}
          <button
            type="button"
            onClick={() => handleViewChange('dashboard')}
            className={`w-full flex items-center text-sm font-bold transition-all duration-200 cursor-pointer ${
              isSidebarOpen ? 'gap-3 px-4 py-3 rounded-[20px] justify-start' : 'h-12 w-12 mx-auto justify-center px-0 rounded-[18px]'
            } ${
              activeView === 'dashboard'
                ? 'bg-[#D0342A] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Executive Dashboard"
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Dashboard</span>}
          </button>

          {/* 2. Job List */}
          <button
            type="button"
            onClick={() => handleViewChange('job-list')}
            className={`w-full flex items-center text-sm font-bold transition-all duration-200 cursor-pointer ${
              isSidebarOpen ? 'gap-3 px-4 py-3 rounded-[20px] justify-start' : 'h-12 w-12 mx-auto justify-center px-0 rounded-[18px]'
            } ${
              activeView === 'job-list'
                ? 'bg-[#D0342A] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Jobs List"
          >
            <Briefcase className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Jobs List</span>}
          </button>

          {/* 3. Job Detail */}
          <button
            type="button"
            onClick={() => handleViewChange('job-detail')}
            className={`w-full flex items-center text-sm font-bold transition-all duration-200 cursor-pointer ${
              isSidebarOpen ? 'gap-3 px-4 py-3 rounded-[20px] justify-start' : 'h-12 w-12 mx-auto justify-center px-0 rounded-[18px]'
            } ${
              activeView === 'job-detail'
                ? 'bg-[#D0342A] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={`Job Details: ${selectedJob.jobCode}`}
          >
            <FileText className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Job Details</span>}
          </button>
        </div>

        {/* Sidebar Footer: Mini Banner & User Profile */}
        <div className="p-3 border-t border-white/10 bg-[#1A0A0C] shrink-0 space-y-2">
          {/* Square 20 Years Celebration Mini Banner */}
          {isSidebarOpen && (
            <div 
              className="overflow-hidden rounded-[18px] border border-white/10 shadow-2xs hover:shadow-xs transition-all duration-200 group"
              title="Square Communications - 20 Years of Boundless Tomorrows"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mini-banner.jpg"
                alt="Square Communications - 20 Years of Boundless Tomorrows"
                className="w-full h-auto block object-cover group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          )}

          <div 
            className={`flex items-center rounded-[20px] hover:bg-white/10 transition-colors cursor-pointer ${
              isSidebarOpen ? 'gap-3 p-2' : 'justify-center p-1'
            }`}
            title={!isSidebarOpen ? "Trần Minh Quang (Senior Account Lead · SQC)" : undefined}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D0342A] to-[#E5635B] text-white font-black flex items-center justify-center shrink-0 shadow-sm text-xs">
              Q
            </div>
            {isSidebarOpen && (
              <div className="truncate">
                <p className="text-xs font-black text-white truncate">Trần Minh Quang</p>
                <p className="text-[10px] text-slate-400 truncate font-medium">Senior Account Lead · SQC</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Global Web Top Header */}
        <header className="h-16 bg-white border-b border-black/[0.04] px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-20 shadow-[0_2px_12px_rgba(0,0,0,0.02)] lg:mr-3 lg:mt-3 lg:rounded-[24px] border lg:border-black/[0.04]">
          {/* Left: Mobile menu toggle button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full text-slate-600 hover:text-black hover:bg-[#f4f4f7] transition-all cursor-pointer lg:hidden"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            {activeView === 'dashboard' && (
              <span className="font-black text-slate-900 text-sm hidden sm:inline-block">Dashboard Overview</span>
            )}
            {activeView === 'job-list' && (
              <span className="font-black text-slate-900 text-sm hidden sm:inline-block">Jobs Management</span>
            )}
            {activeView === 'create-job' && (
              <span className="font-black text-slate-900 text-sm hidden sm:inline-block">Create New Job</span>
            )}
            {activeView === 'job-detail' && (
              <div className="flex items-center gap-2 text-xs">
                <button 
                  type="button"
                  onClick={() => handleViewChange('job-list')}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-black bg-[#f6f6f9] hover:bg-[#FDF2F2] transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                  <span>Back to Jobs List</span>
                </button>
                <span className="text-slate-300 font-bold">/</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black font-mono bg-[#FDF2F2] text-[#D0342A] border border-[#D0342A]/20 tracking-wider shadow-2xs">
                  {selectedJob.jobCode}
                </span>
              </div>
            )}
          </div>

          {/* Right: Simplified Working Entity Selector (Đơn vị làm việc) */}
          <div className="flex items-center gap-3">
            {/* Backdrop to close dropdown on click outside */}
            {isEntityDropdownOpen && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsEntityDropdownOpen(false)} 
              />
            )}

            {/* Entity Switcher Dropdown */}
            <div className="relative z-50">
              <button
                type="button"
                onClick={() => setIsEntityDropdownOpen(!isEntityDropdownOpen)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#f6f6f9] hover:bg-[#FDF2F2] border border-black/[0.04] transition-all cursor-pointer shadow-2xs group"
                title="Chọn đơn vị làm việc"
              >
                <Building2 className="w-4 h-4 text-[#D0342A] shrink-0" />
                <span className="text-xs font-black text-slate-900 group-hover:text-[#D0342A]">
                  {selectedEntity}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#D0342A] transition-transform duration-200 ${isEntityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              {isEntityDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-[24px] shadow-2xl border border-black/[0.05] p-2 z-50 animate-scaleUp">
                  <div className="p-1 space-y-1">
                    {WORKING_ENTITIES.map((ent) => {
                      const isSelected = ent.code === selectedEntity;
                      return (
                        <button
                          key={ent.code}
                          type="button"
                          onClick={() => handleSelectEntity(ent.code)}
                          className={`w-full px-4 py-2.5 rounded-full text-left flex items-center justify-between gap-2 text-xs font-bold transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#1A0A0C] text-white shadow-xs' 
                              : 'hover:bg-[#f6f6f9] text-slate-700'
                          }`}
                        >
                          <span className="tracking-wide">
                            {ent.name}
                          </span>

                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-white shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Global Toast Notification */}
        {notificationToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1A0A0C] text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 text-xs font-bold animate-fadeIn border border-white/10">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationToast}</span>
            <button 
              onClick={() => setNotificationToast(null)}
              className="text-slate-400 hover:text-white ml-2 rounded-full p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Dynamic View Scroll Container */}
        <main ref={mainContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-6 bg-[#f2f1f6] lg:mr-3">
          {activeView === 'dashboard' && (
            <Dashboard onNavigateJobList={() => handleViewChange('job-list')} />
          )}

          {activeView === 'job-list' && (
            <JobList 
              jobs={jobs} 
              onSelectJob={handleSelectJob}
              onNavigateCreateJob={handleNavigateCreateJob}
            />
          )}

          {activeView === 'job-detail' && (
            <JobDetail 
              job={selectedJob} 
              allJobs={jobs}
              onBack={() => handleViewChange('job-list')}
              onUpdateJob={(updated) => {
                setJobs(jobs.map(j => j.id === updated.id ? updated : j));
                setSelectedJob(updated);
                showToast(`Saved changes for project ${updated.jobCode}`);
              }}
            />
          )}

          {activeView === 'create-job' && (
            <CreateJob 
              onCancel={() => handleViewChange('job-list')}
              onSubmit={handleCreateJobSubmit}
            />
          )}
        </main>
      </div>

      {/* Floating Bottom-Right Arito Chatbot Widget */}
      <AritoChatbotWidget />
    </div>
  );
}
