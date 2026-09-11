'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
  badge?: React.ReactNode;
  sublabel?: string;
}

export interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  variant?: 'pill' | 'rounded';
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  variant = 'rounded',
  size = 'md',
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const heightClass = size === 'sm' ? 'h-8 text-xs' : 'h-10 text-xs sm:text-sm';
  const radiusClass = variant === 'pill' ? 'rounded-full' : 'rounded-[16px]';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full ${heightClass} ${radiusClass} pl-3.5 pr-9 bg-[#f6f6f9] border border-black/[0.06] text-zinc-800 font-semibold cursor-pointer transition-all flex items-center justify-between hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#D0342A]/20 focus:border-[#D0342A] text-left ${
          isOpen ? 'bg-white ring-2 ring-[#D0342A]/20 border-[#D0342A] shadow-2xs' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {selectedOption?.badge}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.sublabel && (
            <span className="text-[11px] text-zinc-400 font-normal truncate">
              {selectedOption.sublabel}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#1A0A0C]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-[20px] border border-black/[0.06] shadow-xl shadow-black/5 p-1.5 animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
        >
          <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-[12px] text-left flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FDF2F2] text-[#D0342A] font-bold'
                      : 'text-zinc-700 hover:bg-[#f6f6f9] hover:text-[#1A0A0C]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    {opt.badge}
                    <div className="truncate">
                      <span className="truncate block">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="text-[10px] text-zinc-400 font-normal block truncate">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#D0342A] shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
