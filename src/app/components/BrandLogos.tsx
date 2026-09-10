import React from 'react';

export function ClientLogo({ client = '', className = 'w-9 h-9' }: { client?: string; className?: string }) {
  const norm = client.toLowerCase();

  if (norm.includes('unilever')) {
    return (
      <div className={`${className} rounded-lg bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 p-1 overflow-hidden`} title={client}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Logo-Unilever.webp" alt="Unilever" className="w-full h-full object-contain" />
      </div>
    );
  }

  if (norm.includes('samsung')) {
    return (
      <div className={`${className} rounded-lg bg-blue-50/50 border border-blue-100/80 shadow-2xs flex items-center justify-center shrink-0 p-1 overflow-hidden`} title={client}>
        <svg viewBox="0 0 100 50" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="25" rx="48" ry="22" fill="#034EA2" transform="rotate(-6 50 25)" />
          <text x="50" y="30" fontFamily="'Noto Sans', Arial, sans-serif" fontWeight="900" fontSize="14" fill="#ffffff" textAnchor="middle" letterSpacing="1">SAMSUNG</text>
        </svg>
      </div>
    );
  }

  if (norm.includes('shopee')) {
    return (
      <div className={`${className} rounded-lg bg-orange-50/50 border border-orange-100/80 shadow-2xs flex items-center justify-center shrink-0 p-1 overflow-hidden`} title={client}>
        <svg viewBox="0 0 64 64" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#EE4D2D"/>
          <path d="M22 22V18C22 12.5 26.5 8 32 8C37.5 8 42 12.5 42 18V22H47C48.1 22 49 22.9 49 24L46.5 50C46.3 52.2 44.5 54 42.3 54H21.7C19.5 54 17.7 52.2 17.5 50L15 24C15 22.9 15.9 22 17 22H22ZM26 22H38V18C38 14.7 35.3 12 32 12C28.7 12 26 14.7 26 18V22Z" fill="#ffffff"/>
          <path d="M35.5 32C35.5 29.8 33.7 28.5 31.5 28.5C29 28.5 27.5 29.8 27.5 31.8C27.5 35.5 36.5 34.5 36.5 40.5C36.5 43.8 33.8 45.5 31 45.5C27.8 45.5 26 43.5 26 41.2H29C29 42.2 30 43 31.2 43C32.8 43 33.8 42 33.8 40.5C33.8 37 25 36 25 31.5C25 28 27.8 26 31.5 26C34.8 26 37 28 37 31.2H35.5V32Z" fill="#EE4D2D"/>
        </svg>
      </div>
    );
  }

  if (norm.includes('nestle') || norm.includes('nestlé')) {
    return (
      <div className={`${className} rounded-lg bg-blue-50/50 border border-blue-100/80 shadow-2xs flex items-center justify-center shrink-0 p-1 overflow-hidden`} title={client}>
        <svg viewBox="0 0 64 64" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#005CA9"/>
          <path d="M14 24C18 19 28 17 38 18C44 19 49 22 51 25" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <text x="32" y="42" fontFamily="'Noto Sans', Arial, sans-serif" fontWeight="900" fontSize="14" fill="#ffffff" textAnchor="middle" letterSpacing="-0.5">Nestlé</text>
        </svg>
      </div>
    );
  }

  // Fallback monogram
  const initials = client.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || 'CL';
  return (
    <div className={`${className} rounded-lg bg-blue-600 text-white font-black text-xs shadow-2xs flex items-center justify-center shrink-0 tracking-wider`} title={client}>
      {initials}
    </div>
  );
}

export function BrandLogo({ brand = '', className = 'h-9 w-20' }: { brand?: string; className?: string }) {
  const norm = brand.toLowerCase();

  if (norm.includes('close up') || norm.includes('closeup')) {
    // Close Up is an ultra-wide logo (~3:1 aspect ratio), needs horizontal space rather than a square box
    const cleanClass = className.replace(/\bw-[0-9.]+\b/g, '').replace(/\bh-[0-9.]+\b/g, '').trim();
    return (
      <div className={`${cleanClass} h-9 min-w-[72px] max-w-[96px] px-2 py-1 rounded-lg bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden`} title={brand}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Close_Up_logo.webp" alt="Close Up" className="w-full h-full object-contain scale-105" />
      </div>
    );
  }

  if (norm.includes('galaxy')) {
    return (
      <div className={`${className} rounded-lg bg-indigo-50/50 border border-indigo-100/80 shadow-2xs flex items-center justify-center shrink-0 p-1 overflow-hidden`} title={brand}>
        <svg viewBox="0 0 64 64" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="galG_react" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB"/>
              <stop offset="50%" stopColor="#7C3AED"/>
              <stop offset="100%" stopColor="#DB2777"/>
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="12" fill="url(#galG_react)"/>
          <text x="32" y="40" fontFamily="'Noto Sans', Arial, sans-serif" fontWeight="900" fontSize="24" fill="#ffffff" textAnchor="middle">G</text>
          <path d="M42 16L44 20L48 22L44 24L42 28L40 24L36 22L40 20Z" fill="#FDE047"/>
        </svg>
      </div>
    );
  }

  if (norm.includes('display') || norm.includes('ai')) {
    return (
      <div className={`${className} rounded-lg bg-slate-900 border border-cyan-500/30 shadow-2xs flex items-center justify-center shrink-0 p-1 overflow-hidden`} title={brand}>
        <svg viewBox="0 0 64 64" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#0F172A"/>
          <circle cx="32" cy="32" r="22" stroke="#06B6D4" strokeWidth="2.5" strokeDasharray="5 3" fill="none"/>
          <text x="32" y="38" fontFamily="'Noto Sans', Arial, sans-serif" fontWeight="900" fontSize="16" fill="#38BDF8" textAnchor="middle">AI</text>
        </svg>
      </div>
    );
  }

  if (norm.includes('omo')) {
    return (
      <div className={`${className} rounded-lg bg-blue-900/10 border border-blue-200/80 shadow-2xs flex items-center justify-center shrink-0 p-1 overflow-hidden`} title={brand}>
        <svg viewBox="0 0 64 64" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#1E3A8A"/>
          <path d="M32 10L36 20L46 22L38 28L40 38L32 32L24 38L26 28L18 22L28 20Z" fill="#EF4444" opacity="0.3"/>
          <text x="32" y="36" fontFamily="'Noto Sans', Arial, sans-serif" fontWeight="900" fontSize="18" fill="#ffffff" textAnchor="middle" letterSpacing="1">OMO</text>
          <text x="32" y="48" fontFamily="'Noto Sans', Arial, sans-serif" fontWeight="800" fontSize="9" fill="#FACC15" textAnchor="middle">matic</text>
        </svg>
      </div>
    );
  }

  if (norm.includes('lifebuoy')) {
    return (
      <div className={`${className} rounded-lg bg-rose-50/50 border border-rose-100/80 shadow-2xs flex items-center justify-center shrink-0 p-1 overflow-hidden`} title={brand}>
        <svg viewBox="0 0 64 64" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#DC2626"/>
          <rect x="28" y="14" width="8" height="36" rx="2" fill="#ffffff" opacity="0.25"/>
          <rect x="14" y="28" width="36" height="8" rx="2" fill="#ffffff" opacity="0.25"/>
          <text x="32" y="37" fontFamily="'Noto Sans', Arial, sans-serif" fontWeight="900" fontSize="9.5" fill="#ffffff" textAnchor="middle" letterSpacing="0.5">LIFEBUOY</text>
        </svg>
      </div>
    );
  }

  if (norm.includes('milo')) {
    return (
      <div className={`${className} rounded-lg bg-emerald-50/50 border border-emerald-100/80 shadow-2xs flex items-center justify-center shrink-0 p-1 overflow-hidden`} title={brand}>
        <svg viewBox="0 0 64 64" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#047857"/>
          <circle cx="32" cy="32" r="24" stroke="#F59E0B" strokeWidth="2" fill="none" opacity="0.4"/>
          <text x="32" y="39" fontFamily="'Noto Sans', Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="16" fill="#ffffff" textAnchor="middle">MILO</text>
        </svg>
      </div>
    );
  }

  if (norm.includes('shopee')) {
    return (
      <div className={`${className} rounded-lg bg-red-50/50 border border-red-100/80 shadow-2xs flex items-center justify-center shrink-0 p-1 overflow-hidden`} title={brand}>
        <svg viewBox="0 0 64 64" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#B91C1C"/>
          <text x="32" y="30" fontFamily="'Noto Sans', Arial, sans-serif" fontWeight="900" fontSize="11" fill="#ffffff" textAnchor="middle">Shopee</text>
          <rect x="15" y="36" width="34" height="14" rx="3" fill="#ffffff"/>
          <text x="32" y="47" fontFamily="'Noto Sans', Arial, sans-serif" fontWeight="900" fontSize="10" fill="#B91C1C" textAnchor="middle">MALL</text>
        </svg>
      </div>
    );
  }

  // Fallback monogram
  const initials = brand.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || 'BR';
  return (
    <div className={`${className} rounded-lg bg-teal-600 text-white font-black text-xs shadow-2xs flex items-center justify-center shrink-0 tracking-wider`} title={brand}>
      {initials}
    </div>
  );
}
