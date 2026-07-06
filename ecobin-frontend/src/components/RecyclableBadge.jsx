import React from 'react';
import { Recycle } from 'lucide-react';

export default function RecyclableBadge({ className = '' }) {
  return (
    <span 
      className={`inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${className}`}
      title="This category is fully recyclable"
    >
      <Recycle className="w-3 h-3" />
      Recyclable
    </span>
  );
}
