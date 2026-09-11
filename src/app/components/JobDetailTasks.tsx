'use client';

import React, { useState } from 'react';
import { GanttChart, CheckCircle2 } from 'lucide-react';
import { JobItem } from '../data/mockJmsData';

interface TaskRow {
  id: string;
  name: string;
  assignee: string;
  timeRange: string;
  startDay: number; // 1-20
  duration: number; // in days
  progress: number;
  status: 'Done' | 'In Progress' | 'Pending';
}

interface JobDetailTasksProps {
  job: JobItem;
}

export default function JobDetailTasks({ job }: JobDetailTasksProps) {
  const totalDays = 20;
  const currentDay = 14; // Today marker

  const [tasks, setTasks] = useState<TaskRow[]>([
    {
      id: '1',
      name: '1. Khảo sát & Chốt Brief',
      assignee: job.accountLead?.name || 'Trần Minh Quang',
      timeRange: '27/08 - 30/08',
      startDay: 1,
      duration: 4,
      progress: 100,
      status: 'Done',
    },
    {
      id: '2',
      name: '2. Thiết kế 3D Key Visual',
      assignee: 'Creative Studio',
      timeRange: '30/08 - 04/09',
      startDay: 4,
      duration: 5,
      progress: 100,
      status: 'Done',
    },
    {
      id: '3',
      name: '3. Sản xuất & Gia công POSM',
      assignee: job.projectLeader?.name || 'Lê Thị Mỹ Duyên',
      timeRange: '04/09 - 09/09',
      startDay: 8,
      duration: 6,
      progress: 75,
      status: 'In Progress',
    },
    {
      id: '4',
      name: '4. Vận chuyển & Lắp đặt',
      assignee: 'Logistics & Field',
      timeRange: '09/09 - 13/09',
      startDay: 13,
      duration: 4,
      progress: 30,
      status: 'In Progress',
    },
    {
      id: '5',
      name: '5. Nghiệm thu & Quyết toán',
      assignee: job.accountLead?.name || 'Trần Minh Quang',
      timeRange: '13/09 - 15/09',
      startDay: 16,
      duration: 5,
      progress: 0,
      status: 'Pending',
    },
  ]);

  const handleToggle = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const isDone = t.status === 'Done';
          return {
            ...t,
            status: isDone ? 'In Progress' : 'Done',
            progress: isDone ? 50 : 100,
          };
        }
        return t;
      })
    );
  };

  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const overallProgress = Math.round(
    tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length
  );

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Streamlined Header with Modern Bento Aesthetic */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-[28px] border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-[18px] bg-gradient-to-br from-white/90 to-[#fee2e2]/60 text-[#e11d24] border border-red-100/80 shadow-2xs">
            <GanttChart className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-black text-zinc-900">
                Task Management (Gantt Chart)
              </h2>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-[#e11d24] to-[#b91c1c] text-white shadow-xs">
                Tiến độ: {overallProgress}%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {doneCount}/{tasks.length} công việc hoàn thành ({job.startDate} → {job.endDate})
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-medium">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hoàn thành</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#f87171] to-[#e11d24]" /> Đang làm</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-zinc-300" /> Chờ xử lý</span>
        </div>
      </div>

      {/* Gantt Chart with Clear Grid Lines & Ticks */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-[24px] border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Timeline Header (4 Weeks & 20 Day Ticks) */}
            <div className="grid grid-cols-10 border-b border-zinc-100 bg-white/60 select-none text-[11px]">
              {/* Left Column: Task Name Header */}
              <div className="col-span-4 px-4 py-2.5 border-r border-zinc-200/80 font-bold text-zinc-700 flex items-center justify-between">
                <span>Đầu việc ({tasks.length})</span>
                <span className="text-[10px] text-zinc-400 font-mono">Thời gian</span>
              </div>

              {/* Right Column: Weeks & Ruler Ticks */}
              <div className="col-span-6 flex flex-col">
                {/* 4 Week Headers */}
                <div className="grid grid-cols-4 divide-x divide-zinc-200/80 text-center font-bold text-zinc-700 py-1.5 border-b border-zinc-200/60">
                  <div>Tuần 1</div>
                  <div>Tuần 2</div>
                  <div>Tuần 3</div>
                  <div>Tuần 4</div>
                </div>

                {/* Day Ticks Ruler */}
                <div className="flex text-center text-[9px] font-mono text-zinc-400">
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const isWeekEnd = (i + 1) % 5 === 0;
                    const isToday = i + 1 === currentDay;
                    return (
                      <div
                        key={i}
                        className={`flex-1 py-1 relative ${
                          isWeekEnd ? 'border-r border-zinc-300 font-bold text-zinc-600' : 'border-r border-dashed border-zinc-200/80'
                        } ${isToday ? 'bg-[#e11d24] text-white font-bold rounded-sm shadow-xs' : ''}`}
                      >
                        {/* Vertical tick mark */}
                        <div className={`h-1.5 w-[1px] mx-auto -mt-1 mb-0.5 ${isToday ? 'bg-white' : isWeekEnd ? 'bg-zinc-400' : 'bg-zinc-300'}`} />
                        <span>D{i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Task Rows with Vertical Grid Lines */}
            <div className="divide-y divide-zinc-100 relative">
              {tasks.map((task) => {
                const leftPct = ((task.startDay - 1) / totalDays) * 100;
                const widthPct = (task.duration / totalDays) * 100;

                return (
                  <div
                    key={task.id}
                    className="grid grid-cols-10 items-center px-4 py-3.5 hover:bg-white/90 transition-colors text-xs relative"
                  >
                    {/* Left: Task info with toggle checkbox */}
                    <div className="col-span-4 flex items-center gap-2.5 pr-4 z-5">
                      <button
                        type="button"
                        onClick={() => handleToggle(task.id)}
                        className="cursor-pointer shrink-0 text-zinc-300 hover:text-[#e11d24] transition-colors"
                        title={task.status === 'Done' ? 'Đã hoàn thành' : 'Đang xử lý'}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            task.status === 'Done' ? 'text-emerald-600 fill-emerald-100' : 'text-zinc-300'
                          }`}
                        />
                      </button>

                      <div className="min-w-0">
                        <span
                          className={`font-bold truncate block ${
                            task.status === 'Done' ? 'line-through text-zinc-400' : 'text-zinc-900'
                          }`}
                        >
                          {task.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 block font-mono">
                          {task.assignee} • {task.timeRange}
                        </span>
                      </div>
                    </div>

                    {/* Right: Gantt Bar with Grid Lines */}
                    <div className="col-span-6 relative h-7 flex items-center">
                      {/* Background Vertical Grid Lines */}
                      <div className="absolute inset-0 flex pointer-events-none">
                        {Array.from({ length: totalDays }).map((_, idx) => {
                          const isWeekEnd = (idx + 1) % 5 === 0;
                          return (
                            <div
                              key={idx}
                              className={`flex-1 h-full ${
                                isWeekEnd
                                  ? 'border-r border-zinc-200/90'
                                  : 'border-r border-dashed border-zinc-100'
                              }`}
                            />
                          );
                        })}
                      </div>

                      {/* Today vertical indicator line */}
                      <div
                        className="absolute top-0 bottom-0 pointer-events-none z-10"
                        style={{ left: `${((currentDay - 0.5) / totalDays) * 100}%` }}
                      >
                        <div className="w-[1.5px] h-full bg-[#e11d24]/80 border-l border-dashed border-[#e11d24]" />
                      </div>

                      {/* Gantt Bar */}
                      <div
                        className="absolute h-5 rounded-full transition-all flex items-center px-2 z-20 overflow-hidden shadow-2xs hover:shadow-xs cursor-pointer"
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                        }}
                        title={`${task.name}: ${task.progress}% (${task.timeRange})`}
                      >
                        {/* Background Color */}
                        <div
                          className={`absolute inset-0 ${
                            task.status === 'Done'
                              ? 'bg-emerald-500'
                              : task.status === 'In Progress'
                              ? 'bg-gradient-to-r from-[#f87171] to-[#e11d24]'
                              : 'bg-zinc-300'
                          }`}
                        />

                        {/* Progress Overlay */}
                        <div
                          className="absolute top-0 bottom-0 left-0 bg-white/20"
                          style={{ width: `${task.progress}%` }}
                        />

                        {/* Label */}
                        <span className="relative z-10 text-[9px] font-black text-white truncate drop-shadow-2xs">
                          {task.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-4 py-2.5 bg-white/60 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-0.5 bg-[#e11d24] border-t border-dashed border-[#e11d24]" />
            <span>Đường kẻ đứt màu đỏ chỉ báo mốc ngày hôm nay (Day {currentDay}).</span>
          </div>
          <span>Các vạch dọc phân định ranh giới ngày và tuần.</span>
        </div>
      </div>
    </div>
  );
}
