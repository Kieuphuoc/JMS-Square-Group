'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, Briefcase, FileText, 
  Menu, X, ChevronRight, ChevronLeft, CheckCircle
} from 'lucide-react';
import { INITIAL_JOBS, JobItem } from './data/mockJmsData';
import JobList from './components/JobList';
import JobDetail from './components/JobDetail';
import CreateJob from './components/CreateJob';
import Dashboard from './components/Dashboard';

type ViewMode = 'dashboard' | 'job-list' | 'job-detail' | 'create-job';

export default function JmsPage() {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [jobs, setJobs] = useState<JobItem[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobItem>(INITIAL_JOBS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Trigger toast
  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Switch view with responsive auto-close for mobile
  const handleViewChange = (view: ViewMode) => {
    setActiveView(view);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Switch to job detail
  const handleSelectJob = (job: JobItem) => {
    setSelectedJob(job);
    handleViewChange('job-detail');
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
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f5fc] text-slate-800 relative">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ==================== LEFT SIDEBAR ==================== */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white/95 backdrop-blur-md border-r border-blue-100/90 shadow-xl lg:shadow-xs transition-all duration-300 ease-in-out lg:static shrink-0 ${
          isSidebarOpen 
            ? 'w-64 translate-x-0' 
            : 'max-lg:-translate-x-full lg:w-20'
        }`}
      >
        {/* Brand & Platform Header */}
        <div className="h-16 flex items-center border-b border-blue-100/80 bg-white">
          {isSidebarOpen ? (
            <div className="w-full flex items-center justify-between px-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brands/logo_square.png"
                    alt="Square Communications"
                    className="h-7 w-auto max-w-[125px] object-contain"
                  />
                </div>
                <span className="text-[10px] text-blue-700 font-extrabold tracking-wider uppercase bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                  JMS
                </span>
              </div>

              {/* Desktop collapse button */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                title="Thu gọn sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Mobile close button */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 cursor-pointer"
                title="Đóng sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center px-2">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="w-11 h-11 rounded-2xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 flex items-center justify-center transition-all duration-200 cursor-pointer group relative shadow-2xs"
                title="Mở rộng sidebar"
              >
                {/* Square favicon brand icon */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/favicon.png"
                  alt="Square Group"
                  className="w-6 h-6 object-contain group-hover:scale-90 transition-transform"
                />
                {/* Hover reveal ChevronRight icon */}
                <div className="absolute inset-0 bg-blue-600 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-150 shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div id="sidebar-nav" className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1.5">
          {/* 1. Dashboard */}
          <button
            type="button"
            onClick={() => handleViewChange('dashboard')}
            className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isSidebarOpen ? 'gap-3 px-3.5 py-2.5 justify-start' : 'h-11 justify-center px-0'
            } ${
              activeView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 active:scale-95'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
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
            className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isSidebarOpen ? 'gap-3 px-3.5 py-2.5 justify-start' : 'h-11 justify-center px-0'
            } ${
              activeView === 'job-list'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 active:scale-95'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
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
            className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isSidebarOpen ? 'gap-3 px-3.5 py-2.5 justify-start' : 'h-11 justify-center px-0'
            } ${
              activeView === 'job-detail'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 active:scale-95'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
            title={`Job Details: ${selectedJob.jobCode}`}
          >
            <FileText className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Job Details</span>}
          </button>
        </div>

        {/* Sidebar Footer: User Profile */}
        <div className="p-3 border-t border-blue-100/80 bg-white">
          <div 
            className={`flex items-center rounded-xl hover:bg-blue-50/70 transition-colors cursor-pointer ${
              isSidebarOpen ? 'gap-3 p-2' : 'justify-center p-1.5'
            }`}
            title={!isSidebarOpen ? "Trần Minh Quang (Senior Account Lead · SQC)" : undefined}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-xs">
              Q
            </div>
            {isSidebarOpen && (
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">Trần Minh Quang</p>
                <p className="text-[10px] text-slate-500 truncate">Senior Account Lead · SQC</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile menu toggle button (floating, small screens only when sidebar closed) */}
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed top-3.5 left-3.5 z-30 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-blue-600 shadow-md border border-blue-200 hover:bg-blue-50 transition-all active:scale-95 cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 text-blue-600" />
          </button>
        )}

        {/* Global Toast Notification */}
        {notificationToast && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4.5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-medium animate-fadeIn border border-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationToast}</span>
            <button 
              onClick={() => setNotificationToast(null)}
              className="text-slate-400 hover:text-white ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Dynamic View Scroll Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-[#f0f5fc]">
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
    </div>
  );
}
