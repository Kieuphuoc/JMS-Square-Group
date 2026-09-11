'use client';

import React from 'react';
import { Package } from 'lucide-react';
import { JobItem } from '../data/mockJmsData';

interface JobDetailStockProps {
  job: JobItem;
  formatVND?: (val: number) => string;
}

export default function JobDetailStock({ job }: JobDetailStockProps) {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Streamlined Header with Modern Bento Aesthetic */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-[28px] border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-[18px] bg-gradient-to-br from-white/90 to-[#fee2e2]/60 text-[#e11d24] border border-red-100/80 shadow-2xs">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-black text-zinc-900">
                Stock Summary (Kho Vật tư & Thiết bị)
              </h2>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/70 text-zinc-600 border border-zinc-200/60">
                Chưa có phiếu kho
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Quản lý xuất nhập tồn vật tư POSM và thiết bị dự án: <strong className="text-[#e11d24] font-bold font-mono">{job.jobCode}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Streamlined Table Container with Rounded Bento Frame */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-[24px] border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/60 text-zinc-500 font-bold uppercase tracking-wider text-[11px] border-b border-zinc-100 select-none">
                <th className="py-3.5 px-4 w-16 text-center">STT</th>
                <th className="py-3.5 px-4 w-32">Mã SKU</th>
                <th className="py-3.5 px-4 min-w-[220px]">Tên Vật Tư / Thiết Bị</th>
                <th className="py-3.5 px-3 text-center w-20">ĐVT</th>
                <th className="py-3.5 px-3 text-right w-28">Số Lượng Nhập</th>
                <th className="py-3.5 px-3 text-right w-24">Đã Xuất</th>
                <th className="py-3.5 px-3 text-right w-24">Tồn Kho</th>
                <th className="py-3.5 px-4 text-center w-28">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="py-14 px-4 text-center text-zinc-400 bg-white/40">
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <Package className="w-9 h-9 text-zinc-300" />
                    <span className="text-xs font-semibold text-zinc-500">
                      Chưa có dữ liệu vật tư kho cho dự án này.
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
