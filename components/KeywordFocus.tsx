import React from 'react';
import { Keyword, KeywordDetails } from '../types';
import { Spinner } from './common/Spinner';
import { Card } from './common/Card';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { XIcon } from './icons/XIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { TagIcon } from './icons/TagIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';


interface KeywordFocusProps {
  keyword: Keyword | null;
  details: KeywordDetails | null;
  loading: boolean;
  error: string | null;
  onGenerateStrategy: () => void;
  onClose: () => void;
}

const KeywordFocus: React.FC<KeywordFocusProps> = ({ keyword, details, loading, error, onGenerateStrategy, onClose }) => {
  if (!keyword) {
    return null;
  }

  const VolumeBadge = ({ volume }: { volume: 'High' | 'Medium' | 'Low' }) => {
    const colorClasses = { High: 'bg-purple-100 text-purple-800', Medium: 'bg-blue-100 text-blue-800', Low: 'bg-slate-100 text-slate-800' };
    return <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${colorClasses[volume]}`}><ChartBarIcon className="h-3.5 w-3.5" />{volume}</span>;
  };

  const CompetitionBadge = ({ competition }: { competition: 'High' | 'Medium' | 'Low' }) => {
    const colorClasses = { High: 'bg-red-100 text-red-800', Medium: 'bg-yellow-100 text-yellow-800', Low: 'bg-green-100 text-green-800' };
    return <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${colorClasses[competition]}`}><UsersIcon className="h-3.5 w-3.5" />{competition}</span>;
  };

  return (
    <aside className="w-96 bg-white border-l border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Keyword Focus</h2>
        <button onClick={onClose} className="p-1 text-slate-500 hover:bg-slate-100 rounded-full" aria-label="Close keyword focus">
          <XIcon />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <Card>
          <h3 className="font-bold text-lg text-blue-700">{keyword.keyword}</h3>
          <div className="flex items-center gap-2 text-slate-600 text-sm mt-1">
            <InformationCircleIcon className="h-4 w-4 flex-shrink-0" />
            <span>{keyword.intent}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <VolumeBadge volume={keyword.volume} />
            <CompetitionBadge competition={keyword.competition} />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-slate-600">
                <TagIcon className="h-4 w-4" />
                <span className="font-semibold text-slate-800">{keyword.cpc}</span>
            </div>
             <a href={keyword.semrushLink} target="_blank" rel="noopener noreferrer" title="View on SEMrush (example)" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <span>SEMrush</span>
                <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </div>
        </Card>

        {loading && <div className="flex justify-center py-6"><Spinner /></div>}
        {error && <p className="text-center text-red-500 py-4">{error}</p>}
        
        {details && !loading && (
          <div className="space-y-6 animate-fade-in">
            <Card>
              <h5 className="font-semibold text-slate-700 mb-2">User Intent Analysis</h5>
              <p className="text-sm text-slate-600 leading-relaxed">{details.intentExplanation}</p>
            </Card>

            <Card>
              <h5 className="font-semibold text-slate-700 mb-2">CPC Breakdown</h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-slate-500">Low-Range</p><p className="font-bold text-green-700">{details.cpcBreakdown.lowRangeVND}</p></div>
                <div><p className="text-slate-500">High-Range</p><p className="font-bold text-red-700">{details.cpcBreakdown.highRangeVND}</p></div>
                <p className="col-span-2 text-xs text-slate-500 mt-1 leading-normal">{details.cpcBreakdown.notes}</p>
              </div>
            </Card>

            <Card>
              <h5 className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> Related Keywords</h5>
              <div className="flex flex-wrap gap-2">
                {details.relatedKeywords.map((kw, i) => <span key={i} className="px-2.5 py-1 text-xs font-medium text-teal-800 bg-teal-100 rounded-full">{kw}</span>)}
              </div>
            </Card>

            <Card>
              <h5 className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5"><QuestionMarkCircleIcon className="w-4 h-4" /> Common Questions</h5>
              <ul className="space-y-2 list-disc list-inside pl-2 text-sm text-slate-600 leading-relaxed">
                {details.commonQuestions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </Card>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <button
          onClick={onGenerateStrategy}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <SparklesIcon />
          Generate Content Strategy
        </button>
      </div>
    </aside>
  );
};

export default KeywordFocus;