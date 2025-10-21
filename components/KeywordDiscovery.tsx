import React, { useState, useMemo, useEffect } from 'react';
import { Keyword, CategorizedKeywords } from '../types';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { TagIcon } from './icons/TagIcon';
import { UsersIcon } from './icons/UsersIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { SearchIcon } from './icons/SearchIcon';

interface KeywordDiscoveryProps {
  categorizedKeywords: CategorizedKeywords;
  loading: boolean;
  customLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  onFetchKeywords: () => void;
  onKeywordSelect: (keyword: Keyword) => void;
  selectedKeyword: Keyword | null;
  customSearchTerm: string;
  onCustomSearchTermChange: (term: string) => void;
  onDiscoverForTerm: () => void;
}

const KeywordDiscovery: React.FC<KeywordDiscoveryProps> = ({ 
  categorizedKeywords,
  loading,
  customLoading,
  error,
  hasSearched,
  onFetchKeywords,
  onKeywordSelect,
  selectedKeyword,
  customSearchTerm,
  onCustomSearchTermChange,
  onDiscoverForTerm
}) => {
  const [filter, setFilter] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const isAnythingLoading = loading || customLoading;

  useEffect(() => {
    if (categorizedKeywords.customSearchKeywords && categorizedKeywords.customSearchKeywords.length > 0 && !loading) {
      setExpandedCategories(prev => ({ ...prev, "Custom Search Results": true }));
    }
  }, [categorizedKeywords.customSearchKeywords, loading]);

  const handleToggleCategory = (title: string) => {
    setExpandedCategories(prev => ({
        ...prev,
        [title]: !prev[title]
    }));
  };

  const VolumeBadge = ({ volume }: { volume: 'High' | 'Medium' | 'Low' }) => {
    const colorClasses = {
      High: 'bg-purple-100 text-purple-800',
      Medium: 'bg-blue-100 text-blue-800',
      Low: 'bg-slate-100 text-slate-800',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${colorClasses[volume]}`}>
        <ChartBarIcon className="h-3.5 w-3.5" />
        {volume}
      </span>
    );
  };

  const CompetitionBadge = ({ competition }: { competition: 'High' | 'Medium' | 'Low' }) => {
    const colorClasses = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${colorClasses[competition]}`}>
        <UsersIcon className="h-3.5 w-3.5" />
        {competition}
      </span>
    );
  };
  
  interface KeywordListItemProps {
    keyword: Keyword;
    isSelected: boolean;
    onSelect: (keyword: Keyword) => void;
  }
  const KeywordListItem: React.FC<KeywordListItemProps> = ({ keyword, isSelected, onSelect }) => (
    <div 
      onClick={() => onSelect(keyword)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(keyword)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      className={`p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border transition-all duration-200 ${
        isSelected 
        ? 'bg-blue-50 border-blue-400 shadow-md scale-[1.01]' 
        : 'bg-white border-slate-200 hover:shadow-md hover:border-slate-300'
      }`}
    >
      <div className="flex-grow">
          <h4 className="font-semibold text-blue-700 text-base">{keyword.keyword}</h4>
          <div className="flex items-start gap-2 text-slate-600 text-sm mt-1">
              <InformationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{keyword.intent}</span>
          </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-shrink-0">
          <VolumeBadge volume={keyword.volume} />
          <CompetitionBadge competition={keyword.competition} />
          <div className="flex items-center gap-1.5 text-slate-600 text-sm">
              <TagIcon className="h-4 w-4" />
              <span className="font-semibold text-slate-800">{keyword.cpc}</span>
          </div>
           <a
              href={keyword.semrushLink}
              target="_blank"
              rel="noopener noreferrer"
              title="View on SEMrush (example)"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600 transition-colors"
          >
              <ExternalLinkIcon className="h-4 w-4" />
          </a>
      </div>
    </div>
  );

  interface KeywordListProps {
    title: string;
    keywords: Keyword[];
    isExpanded: boolean;
    onToggle: () => void;
  }
  const KeywordList: React.FC<KeywordListProps> = ({ title, keywords, isExpanded, onToggle }) => (
    <Card>
      <button 
        onClick={onToggle} 
        className="w-full flex justify-between items-center text-left"
        aria-expanded={isExpanded}
      >
        <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{keywords.length} keywords</span>
            <ChevronDownIcon className={`h-6 w-6 text-slate-500 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} />
        </div>
      </button>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
          {keywords.length > 0 ? (
            keywords.map((kw) => (
                <KeywordListItem 
                  key={kw.keyword} 
                  keyword={kw}
                  isSelected={selectedKeyword?.keyword === kw.keyword}
                  onSelect={onKeywordSelect}
                />
            ))
          ) : (
             <p className="text-slate-500 text-center py-2">No keywords in this category match your filter.</p>
          )}
        </div>
      )}
    </Card>
  );

  const allKeywords = useMemo(() => [
    ...categorizedKeywords.customSearchKeywords,
    ...categorizedKeywords.motorcycleLoanKeywords,
    ...categorizedKeywords.phoneLoanKeywords,
    ...categorizedKeywords.tabletLoanKeywords,
    ...categorizedKeywords.cashLoanKeywords,
  ], [categorizedKeywords]);
  
  const filteredKeywords = useMemo(() => {
    if (!filter.trim()) {
        return categorizedKeywords;
    }
    const lowercasedFilter = filter.trim().toLowerCase();

    const filterFn = (keywords: Keyword[]) => 
        keywords.filter(kw => kw.keyword.toLowerCase().includes(lowercasedFilter));

    return {
        customSearchKeywords: filterFn(categorizedKeywords.customSearchKeywords || []),
        motorcycleLoanKeywords: filterFn(categorizedKeywords.motorcycleLoanKeywords),
        phoneLoanKeywords: filterFn(categorizedKeywords.phoneLoanKeywords),
        tabletLoanKeywords: filterFn(categorizedKeywords.tabletLoanKeywords),
        cashLoanKeywords: filterFn(categorizedKeywords.cashLoanKeywords),
    };
  }, [filter, categorizedKeywords]);

  const totalFilteredKeywords = useMemo(() => (
    (filteredKeywords.customSearchKeywords?.length || 0) +
    filteredKeywords.motorcycleLoanKeywords.length +
    filteredKeywords.phoneLoanKeywords.length +
    filteredKeywords.tabletLoanKeywords.length +
    filteredKeywords.cashLoanKeywords.length
  ), [filteredKeywords]);

  const categoryOrder: {title: string, keywords: Keyword[]}[] = [
      { title: "Custom Search Results", keywords: filteredKeywords.customSearchKeywords || [] },
      { title: "Vay Mua Xe Máy", keywords: filteredKeywords.motorcycleLoanKeywords },
      { title: "Vay Mua Điện Thoại", keywords: filteredKeywords.phoneLoanKeywords },
      { title: "Vay Mua Máy Tính Bảng", keywords: filteredKeywords.tabletLoanKeywords },
      { title: "Vay Tiền Mặt", keywords: filteredKeywords.cashLoanKeywords }
  ];

  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Keyword Explorer</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-lg leading-8">Uncover high-intent keywords for Mcredit's core consumer finance products in Vietnam. Select a keyword to see a detailed analysis and generate a content strategy.</p>
        </div>
        
        <Card className="mb-8 sticky top-6 bg-white/80 backdrop-blur-sm z-10">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Discover Keywords for a Specific Topic</h3>
            <p className="text-sm text-slate-500 mb-4">Enter a topic or keyword to generate a targeted list of related search terms.</p>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-grow">
                    <label htmlFor="custom-keyword-search" className="block text-sm font-medium text-slate-700 mb-1">Your Topic</label>
                    <input
                    type="text"
                    id="custom-keyword-search"
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-100"
                    placeholder="e.g., 'vay tín chấp' or 'lãi suất vay'"
                    value={customSearchTerm}
                    onChange={(e) => onCustomSearchTermChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isAnythingLoading && onDiscoverForTerm()}
                    aria-label="Discover keywords for a specific topic"
                    disabled={isAnythingLoading}
                    />
                </div>
                <button
                    onClick={onDiscoverForTerm}
                    disabled={isAnythingLoading || !customSearchTerm.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 transition-colors"
                >
                    <SearchIcon />
                    {customLoading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </Card>

        {loading && (
            <div className="flex justify-center items-center py-10">
                <Spinner />
            </div>
        )}

        {error && <p className="text-center text-red-500 my-4">{error}</p>}
        
        {!loading && hasSearched && allKeywords.length > 0 && (
            <>
                <Card className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-grow">
                             <label htmlFor="keyword-filter" className="block text-sm font-medium text-slate-700 mb-1">Filter All Results</label>
                            <input
                                type="text"
                                id="keyword-filter"
                                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., 'vay mua iphone'"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                aria-label="Filter keywords"
                            />
                        </div>
                        <button
                            onClick={() => setFilter('')}
                            disabled={!filter}
                            className="w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-slate-700 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Clear Filter
                        </button>
                    </div>
                </Card>

                {totalFilteredKeywords > 0 ? (
                    <div className="flex flex-col gap-4">
                        {categoryOrder.map(cat => (
                           cat.keywords.length > 0 && (
                             <KeywordList 
                                key={cat.title}
                                title={cat.title} 
                                keywords={cat.keywords} 
                                isExpanded={!!expandedCategories[cat.title]}
                                onToggle={() => handleToggleCategory(cat.title)}
                            />
                           )
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200/80">
                        <p>No keywords match your filter: "<strong>{filter}</strong>"</p>
                    </div>
                )}
            </>
        )}

        {!loading && hasSearched && allKeywords.length === 0 && (
             <div className="text-center py-10 text-slate-500">
                <p>No keywords were found. Please try again.</p>
            </div>
        )}

        <div className="text-center mt-8 pt-6 border-t border-slate-200">
            {!hasSearched && !loading && (
                 <div className="text-center py-4 text-slate-500">
                    <p className="mb-4">Use the search bar above or click the button below to start discovering keywords.</p>
                </div>
            )}
             
            <p className="text-sm text-slate-500 mb-3">Or, discover a broad set of keywords for our main product categories.</p>
            <button
                onClick={onFetchKeywords}
                disabled={isAnythingLoading}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    hasSearched
                    ? 'bg-white text-slate-700 border border-slate-300 shadow-sm hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400'
                    : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:bg-slate-400'
                }`}
            >
                <SparklesIcon />
                {loading ? 'Discovering...' : 'Discover Broad Keywords'}
            </button>
        </div>
    </div>
  );
};

export default KeywordDiscovery;