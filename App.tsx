import React, { useState } from 'react';
import { PenTool, Sparkles, AlertCircle, ArrowRight, Hash, Tag, Image as ImageIcon, Search, Globe, Languages, Camera, RefreshCw } from 'lucide-react';
import { APP_TITLE, APP_SUBTITLE } from './constants';
import { TitleState, PRESET_PURPOSES } from './types';
import { generateTitles } from './services/geminiService';
import { TitleCard } from './components/TitleCard';

const App: React.FC = () => {
  const [state, setState] = useState<TitleState>({
    content: '',
    purpose: '',
    additionalRequirements: '',
    isGenerating: false,
    results: [],
    keywordsCn: [],
    keywordsEn: [],
    selectedKeywords: [],
    error: null,
  });

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!state.content.trim() || !state.purpose.trim()) return;

    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      error: null, 
      results: [],
      keywordsCn: [],
      keywordsEn: [],
      selectedKeywords: []
    }));

    try {
      const { titles, keywordsCn, keywordsEn } = await generateTitles(
        state.content, 
        state.purpose,
        state.additionalRequirements
      );
      setState(prev => ({
        ...prev,
        isGenerating: false,
        results: titles,
        keywordsCn: keywordsCn,
        keywordsEn: keywordsEn
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message || "发生了一些错误，请稍后重试。"
      }));
    }
  };

  const toggleKeyword = (keyword: string) => {
    setState(prev => {
      const isSelected = prev.selectedKeywords.includes(keyword);
      if (isSelected) {
        return { ...prev, selectedKeywords: prev.selectedKeywords.filter(k => k !== keyword) };
      } else {
        return { ...prev, selectedKeywords: [...prev.selectedKeywords, keyword] };
      }
    });
  };

  const handleSearch = (provider: 'google' | 'pixabay' | 'vcg') => {
    if (state.selectedKeywords.length === 0) return;
    
    // Combine selected keywords for search query
    const query = state.selectedKeywords.join(' ');
    let url = '';

    switch (provider) {
      case 'google':
        url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
        break;
      case 'pixabay':
        url = `https://pixabay.com/images/search/${encodeURIComponent(query)}/`;
        break;
      case 'vcg':
        url = `https://www.vcg.com/creative/search?phrase=${encodeURIComponent(query)}`;
        break;
    }
    
    window.open(url, '_blank');
  };

  const renderKeywordBadge = (keyword: string, isEn: boolean = false) => {
    const isSelected = state.selectedKeywords.includes(keyword);
    return (
      <button 
        key={keyword}
        onClick={() => toggleKeyword(keyword)}
        className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
          isSelected 
            ? 'bg-[#95C146] border-[#95C146] text-white shadow-md shadow-[#95C146]/20' 
            : isEn 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300'
              : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200 hover:border-stone-300'
        }`}
      >
        <Tag size={12} className={isSelected ? 'text-white' : isEn ? 'text-emerald-500' : 'text-stone-400'} />
        {keyword}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F9E8] text-stone-800">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="p-2 bg-[#95C146] rounded-xl shadow-lg shadow-[#95C146]/20">
            <PenTool size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-800 leading-none tracking-tight">{APP_TITLE}</h1>
            <p className="text-xs text-stone-500 mt-0.5">{APP_SUBTITLE}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Input Section */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-stone-200/50 border border-white">
          <form onSubmit={handleGenerate} className="space-y-6">
            
            {/* Context Input */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                使用场景 / 用途
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="purposes"
                  placeholder="例如：小红书笔记标题、公众号文章、短视频文案..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-[#95C146] focus:border-transparent outline-none transition-all hover:bg-stone-50/80"
                  value={state.purpose}
                  onChange={(e) => setState(prev => ({ ...prev, purpose: e.target.value }))}
                  disabled={state.isGenerating}
                />
                <datalist id="purposes">
                  {PRESET_PURPOSES.map(p => <option key={p} value={p} />)}
                </datalist>
              </div>
            </div>

            {/* Additional Requirements Input */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                额外要求 / 风格偏好 <span className="text-stone-400 font-normal text-xs ml-1">(可选)</span>
              </label>
              <input
                type="text"
                placeholder="例如：幽默风趣、专业严谨、加入Emoji、制造悬念..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-[#95C146] focus:border-transparent outline-none transition-all hover:bg-stone-50/80"
                value={state.additionalRequirements}
                onChange={(e) => setState(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                disabled={state.isGenerating}
              />
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                粘贴内容或输入摘要
              </label>
              <textarea
                rows={6}
                placeholder="在此处粘贴您需要生成标题的文本内容..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-[#95C146] focus:border-transparent outline-none transition-all resize-none hover:bg-stone-50/80"
                value={state.content}
                onChange={(e) => setState(prev => ({ ...prev, content: e.target.value }))}
                disabled={state.isGenerating}
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={state.isGenerating || !state.content || !state.purpose}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                state.isGenerating || !state.content || !state.purpose
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-[#95C146] hover:bg-[#86B03B] text-white shadow-lg shadow-[#95C146]/30 hover:-translate-y-0.5'
              }`}
            >
              {state.isGenerating ? (
                <>
                  <Sparkles className="animate-spin" /> 正在生成灵感...
                </>
              ) : (
                <>
                  生成标题 & 关键词 <ArrowRight size={20} />
                </>
              )}
            </button>

            {state.error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 flex items-center gap-2 text-sm">
                <AlertCircle size={16} /> {state.error}
              </div>
            )}
          </form>
        </section>

        {/* Results Section */}
        {state.results.length > 0 && (
          <section className="mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Keywords Display & Search */}
            {(state.keywordsCn.length > 0 || state.keywordsEn.length > 0) && (
              <div className="mb-8 p-6 bg-white border border-stone-100 rounded-2xl shadow-lg shadow-stone-200/40">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Hash size={18} className="text-[#95C146]" />
                    <h3 className="font-bold text-sm uppercase tracking-wide">
                      关键词配图助手 ({state.selectedKeywords.length})
                    </h3>
                  </div>
                  
                  {state.selectedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in zoom-in duration-200">
                      <button 
                        id="google-search-button"
                        onClick={() => handleSearch('google')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-all shadow-md shadow-blue-500/20"
                        title="在 Google 图片中搜索"
                      >
                        <Search size={14} />
                        Google
                      </button>
                      <button 
                        id="pixabay-search-button"
                        onClick={() => handleSearch('pixabay')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-all shadow-md shadow-emerald-500/20"
                        title="在 Pixabay 中搜索免费素材"
                      >
                        <Camera size={14} />
                        Pixabay
                      </button>
                      <button 
                        id="vcg-search-button"
                        onClick={() => handleSearch('vcg')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all shadow-md shadow-red-500/20"
                        title="在视觉中国中搜索"
                      >
                        <ImageIcon size={14} />
                        视觉中国
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  {/* Chinese Keywords */}
                  {state.keywordsCn.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2.5 text-stone-400">
                        <Languages size={14} />
                        <span className="text-xs font-medium uppercase tracking-wider">中文标签</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {state.keywordsCn.map((k) => renderKeywordBadge(k, false))}
                      </div>
                    </div>
                  )}

                  {/* English Keywords */}
                  {state.keywordsEn.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2.5 text-stone-400">
                        <Globe size={14} />
                        <span className="text-xs font-medium uppercase tracking-wider">英文标签 (更适合搜索素材)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {state.keywordsEn.map((k) => renderKeywordBadge(k, true))}
                      </div>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-xs text-stone-500 flex items-center gap-1.5 bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <Search size={12} className="text-[#95C146]" /> 
                  <span>选择关键词（支持多选），点击右上角按钮即可跳转搜索。</span>
                </p>
              </div>
            )}

            <div className="space-y-5">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-[#95C146]" size={20} />
                  <h2 className="text-xl font-bold text-stone-800">生成方案</h2>
                </div>
                <button 
                  onClick={() => handleGenerate()}
                  disabled={state.isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-stone-500 hover:text-[#95C146] hover:bg-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <RefreshCw size={16} className={`group-hover:rotate-180 transition-transform duration-500 ${state.isGenerating ? 'animate-spin' : ''}`} />
                  <span>不满意？重新生成</span>
                </button>
              </div>
              
              <div className="grid gap-4">
                {state.results.map((item, idx) => (
                  <TitleCard key={idx} item={item} index={idx} />
                ))}
              </div>
              
              <p className="text-center text-stone-400 text-xs mt-8">
                内容由 AI 生成，仅供参考
              </p>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default App;