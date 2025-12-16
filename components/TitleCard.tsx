import React, { useState } from 'react';
import { GeneratedTitle } from '../types';
import { Copy, Check } from 'lucide-react';

interface TitleCardProps {
  item: GeneratedTitle;
  index: number;
}

export const TitleCard: React.FC<TitleCardProps> = ({ item, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="bg-white rounded-xl p-6 border border-stone-100 shadow-lg shadow-stone-200/40 hover:border-[#95C146] hover:shadow-[#95C146]/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 group"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-2 leading-snug group-hover:text-[#6A8B30] transition-colors">
            {item.title}
          </h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            <span className="inline-block bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mr-2 align-middle">推荐理由</span>
            {item.reasoning}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className={`p-2 rounded-lg transition-all ${
            copied 
              ? 'bg-[#EAF4D3] text-[#6A8B30]' 
              : 'bg-stone-50 text-stone-400 hover:bg-stone-100 hover:text-stone-600'
          }`}
          title="复制到剪贴板"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
};