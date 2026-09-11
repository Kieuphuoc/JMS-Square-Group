'use client';

import React from 'react';
import { TrendingUp, FileSpreadsheet } from 'lucide-react';
import { JobItem } from '../data/mockJmsData';

interface JobDetailPnlProps {
  job: JobItem;
  formatVND: (val: number) => string;
  onSyncArito?: () => void;
  isSyncing?: boolean;
}

export default function JobDetailPnl({ job, formatVND, onSyncArito, isSyncing }: JobDetailPnlProps) {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Streamlined Header with Modern Bento Aesthetic */}
      <div className="bg-white rounded-[28px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-[18px] bg-gradient-to-br from-[#FDF2F2] to-[#FDE8E8] text-[#D0342A] border border-[#D0342A]/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-black text-slate-900">
                P&L Statement (Báo cáo Lãi/Lỗ)
              </h2>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200/70">
                Chờ quyết toán Arito
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Mục tiêu GP: <strong className="text-slate-800 font-bold">{job.grossProfitPercent.toFixed(1)}%</strong>
              <span className="mx-1.5 text-slate-300">•</span>
              Doanh thu: <strong className="text-[#D0342A] font-black font-mono">{formatVND(job.potentialBudget)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Streamlined Table Container with Rounded Bento Frame */}
      <div className="bg-white rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f6f6f9] text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100 select-none">
                <th className="py-3.5 px-4 w-16 text-center">STT</th>
                <th className="py-3.5 px-4 w-32">Mã Khoản Mục</th>
                <th className="py-3.5 px-4 min-w-[220px]">Hạng Mục P&L</th>
                <th className="py-3.5 px-4 text-right min-w-[130px]">Dự Toán</th>
                <th className="py-3.5 px-4 text-right min-w-[130px]">Thực Tế Arito</th>
                <th className="py-3.5 px-4 text-right min-w-[120px]">Chênh Lệch</th>
                <th className="py-3.5 px-4 text-center w-28">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="py-14 px-4 text-center text-slate-400 bg-[#fafafc]">
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <FileSpreadsheet className="w-9 h-9 text-slate-300" />
                    <span className="text-xs font-semibold text-slate-500">
                      Chưa phát sinh dữ liệu giao dịch P&L từ Arito ERP cho dự án này.
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
