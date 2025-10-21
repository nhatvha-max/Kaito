import React, { useState, useMemo } from 'react';
import { Keyword, ContentStrategy as ContentStrategyType, SavedStrategy } from '../types';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { ThumbUpIcon } from './icons/ThumbUpIcon';
import { ThumbDownIcon } from './icons/ThumbDownIcon';
import { TargetIcon } from './icons/TargetIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { LinkIcon } from './icons/LinkIcon';
import { SearchIcon } from './icons/SearchIcon';

interface ContentStrategyProps {
  selectedKeyword: Keyword | null;
  strategy: ContentStrategyType | null;
  loading: boolean;
  error: string | null;
  onGenerateStrategy: () => void;
  onSaveStrategy: () => void;
  savedStrategies: SavedStrategy[];
}

const formatStrategyToText = (strategy: ContentStrategyType, keyword: string): string => {
  let text = `Content & SEO Strategy for "${keyword}"\n\n`;

  // 1. User Intent Analysis
  if (strategy.keywordUserIntents && strategy.keywordUserIntents.length > 0) {
      text += `## 🎯 User Intent Analysis ##\n\n`;
      strategy.keywordUserIntents.forEach(intent => {
          text += `### Intent: ${intent.intent} ###\n`;
          text += `Description: ${intent.description}\n`;
          text += `Example Queries:\n${intent.exampleQueries.map(q => `- ${q}`).join('\n')}\n\n`;
      });
  }

  // 2. Content Pillars
  if (strategy.contentPillars && strategy.contentPillars.length > 0) {
    text += `## 🌳 Content Pillar Deep Dive ##\n\n`;
    strategy.contentPillars.forEach((pillar, index) => {
      text += `### Pillar ${index + 1}: ${pillar.pillarTitle} ###\n`;
      text += `${pillar.pillarDescription}\n\n`;
      text += `💡 Content Angle: ${pillar.contentAngle}\n\n`;
      pillar.clusterTopics.forEach(cluster => {
        text += `#### Cluster: ${cluster.clusterTitle} ####\n`;
        if (cluster.userIntent) {
          text += `🎯 User Intent: ${cluster.userIntent}\n\n`;
        }
        text += `* ${cluster.clusterDescription} *\n\n`;
        text += `- Suggested Format: ${cluster.suggestedFormat}\n`;
        text += `- Keywords: ${cluster.specificKeywords.join(', ')}\n`;
        if (cluster.draftContent) {
          text += `- Content Draft: "${cluster.draftContent}"\n`;
        }
        text += '\n';
      });
    });
  }

  // 3. AI Overview Strategy
  text += `## 🚀 Google AI Overview Strategy ##\n\n`;
  text += `### Introduction ###\n`;
  text += `${strategy.aiOverviewIntro}\n\n`;

  text += `### Content Structuring Tips ###\n`;
  strategy.aiOverviewContent.forEach(point => {
    text += `- ${point}\n`;
  });
  text += `\n`;

  text += `### Schema Markup Recommendations ###\n`;
  strategy.aiOverviewSchema.forEach(point => {
    text += `- ${point}\n`;
  });
  text += `\n`;

  text += `### E-E-A-T Signal Enhancements ###\n`;
  strategy.aiOverviewEEAT.forEach(point => {
    text += `- ${point}\n`;
  });
  text += `\n`;
  
  // 4. Competitor Analysis
  if (strategy.competitorAnalysis && strategy.competitorAnalysis.length > 0) {
    text += `## 👥 Competitor Landscape ##\n\n`;
    strategy.competitorAnalysis.forEach(competitor => {
        text += `### ${competitor.competitorName} ###\n`;
        text += `Summary: ${competitor.strategySummary}\n`;
        text += `Strengths:\n${competitor.strengths.map(s => `- ${s}`).join('\n')}\n`;
        text += `Weaknesses:\n${competitor.weaknesses.map(w => `- ${w}`).join('\n')}\n\n`;
    });
  }

  return text;
};

const ContentStrategy: React.FC<ContentStrategyProps> = ({ 
  selectedKeyword, 
  strategy,
  loading,
  error,
  onGenerateStrategy,
  onSaveStrategy,
  savedStrategies
}) => {
  const [isJustSaved, setIsJustSaved] = useState(false);
  const [expandedDrafts, setExpandedDrafts] = useState<Record<string, boolean>>({});

  const toggleDraftExpansion = (id: string) => {
    setExpandedDrafts(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleSaveStrategy = () => {
    onSaveStrategy();
    setIsJustSaved(true);
    setTimeout(() => setIsJustSaved(false), 2000);
  };

  const handleExportStrategy = () => {
    if (!strategy || !selectedKeyword) return;

    const textContent = formatStrategyToText(strategy, selectedKeyword.keyword);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeKeyword = selectedKeyword.keyword.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `content-strategy-${safeKeyword}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isAlreadySaved = useMemo(() => {
    if (!strategy || !strategy.contentPillars || strategy.contentPillars.length === 0 || !selectedKeyword) return false;
    return savedStrategies.some(s => 
        s.keyword === selectedKeyword.keyword && 
        s.contentPillars?.[0]?.pillarTitle === strategy.contentPillars?.[0]?.pillarTitle
    );
  }, [strategy, savedStrategies, selectedKeyword]);

  const getIntentIcon = (intent: string) => {
    const lowerIntent = intent.toLowerCase();
    if (lowerIntent.includes('informational')) return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    if (lowerIntent.includes('transactional')) return <ShoppingCartIcon className="h-6 w-6 text-green-500" />;
    if (lowerIntent.includes('commercial') || lowerIntent.includes('investigation')) return <SearchIcon className="h-6 w-6 text-purple-500" />;
    if (lowerIntent.includes('navigational')) return <LinkIcon className="h-6 w-6 text-orange-500" />;
    return <TargetIcon className="h-6 w-6 text-slate-500" />;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-4">{error}</p>;
  }
  
  if (!selectedKeyword) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200/80 max-w-md">
                <SearchIcon className="h-16 w-16 text-slate-300 mx-auto" />
                <h2 className="text-2xl font-bold text-slate-800 mt-6">No Keyword Selected</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">Please go to the "Explorer" tab and select a keyword to generate a content strategy.</p>
            </div>
        </div>
    );
  }

  if (!strategy) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200/80 max-w-md">
                <LightBulbIcon />
                <h2 className="text-2xl font-bold text-slate-800 mt-6">Ready to Generate a Strategy?</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">A content strategy for "<strong className="font-semibold text-slate-600">{selectedKeyword.keyword}</strong>" has not been generated yet.</p>
                <button
                    onClick={onGenerateStrategy}
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <SparklesIcon />
                    Generate AI Strategy
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Content & SEO Strategy</h2>
        <p className="text-slate-600 mt-3 text-lg leading-8">A comprehensive strategy for the keyword: <strong className="text-blue-600">"{selectedKeyword.keyword}"</strong></p>
      </div>

      <Card className="mb-6 sticky top-6 bg-white/80 backdrop-blur-sm z-10">
        <div className="flex justify-center items-center gap-4 flex-wrap">
            <button
                onClick={onGenerateStrategy}
                className="inline-flex items-center gap-2 px-5 py-2 text-slate-700 bg-white border border-slate-300 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            >
                <SparklesIcon />
                Regenerate
            </button>
            <button
                onClick={handleSaveStrategy}
                disabled={isAlreadySaved || isJustSaved}
                className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
                <BookmarkIcon />
                {isJustSaved ? 'Saved!' : isAlreadySaved ? 'Already Saved' : 'Save Strategy'}
            </button>
            <button
                onClick={handleExportStrategy}
                className="inline-flex items-center gap-2 px-5 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors"
            >
                <DownloadIcon />
                Export as Text
            </button>
        </div>
      </Card>

      <div className="space-y-16 animate-fade-in">

        {strategy.keywordUserIntents && strategy.keywordUserIntents.length > 0 && (
            <section>
                <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center flex items-center justify-center gap-3"><TargetIcon className="h-7 w-7" /> User Intent Analysis</h3>
                <p className="text-slate-600 bg-slate-100 p-4 rounded-lg border border-slate-200/80 mb-8 text-center max-w-3xl mx-auto">
                    Understanding the "why" behind the search to tailor content to specific user needs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {strategy.keywordUserIntents.map((intent, index) => (
                        <Card key={index} className="bg-white !shadow-lg transition-all hover:transform hover:-translate-y-1">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 mt-1">{getIntentIcon(intent.intent)}</div>
                                <div>
                                    <h4 className="font-bold text-lg text-slate-800">{intent.intent}</h4>
                                </div>
                            </div>
                            
                            <ul className="space-y-4">
                                <li>
                                    <p className="font-semibold text-sm text-slate-500 uppercase tracking-wider">User Goal</p>
                                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{intent.description}</p>
                                </li>
                                <li className="pt-3 border-t border-slate-200/80">
                                    <p className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Example Searches</p>
                                    <ul className="list-disc list-inside pl-1 mt-2 space-y-1.5">
                                        {intent.exampleQueries.map((query, qIndex) => (
                                            <li key={qIndex} className="text-sm text-slate-600">{query}</li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </Card>
                    ))}
                </div>
            </section>
        )}

        {strategy.contentPillars && (
          <section className="pt-8 border-t border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center flex items-center justify-center gap-3">🌳 Content Pillar Deep Dive</h3>
            <p className="text-slate-600 bg-slate-100 p-4 rounded-lg border border-slate-200/80 mb-8 text-center max-w-3xl mx-auto">
                Use these pillars to establish topical authority. Each has a unique angle and is supported by cluster topics.
            </p>
            <div className="space-y-8">
                {strategy.contentPillars.map((pillar, index) => (
                    <Card key={index} className="bg-white">
                        <h4 className="text-xl font-bold text-blue-800">{pillar.pillarTitle}</h4>
                        <p className="text-slate-600 mt-1 mb-4 leading-relaxed">{pillar.pillarDescription}</p>
                        <div className="mb-5 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                            <p className="font-semibold text-amber-800 text-sm flex items-center gap-2"><LightBulbIcon /> Content Angle:</p>
                            <p className="text-amber-900 mt-1 pl-1 leading-relaxed">{pillar.contentAngle}</p>
                        </div>
                        <div className="space-y-4">
                            {pillar.clusterTopics.map((cluster, cIndex) => {
                                const draftId = `${index}-${cIndex}`;
                                const isDraftExpanded = !!expandedDrafts[draftId];
                                return (
                                    <div key={cIndex} className="p-4 bg-slate-50/70 rounded-lg border border-slate-200/80">
                                        <div className="flex justify-between items-start gap-2">
                                            <h5 className="font-semibold text-slate-700 flex-grow">{cluster.clusterTitle}</h5>
                                            <span className="flex-shrink-0 px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-md">{cluster.suggestedFormat}</span>
                                        </div>
                                        {cluster.userIntent && <p className="mt-2 text-sm text-slate-600 leading-relaxed"><span className="font-semibold">User Intent:</span> {cluster.userIntent}</p>}
                                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{cluster.clusterDescription}</p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {cluster.specificKeywords.map((kw, kwIndex) => <span key={kwIndex} className="px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">{kw}</span>)}
                                        </div>
                                        {cluster.draftContent && (
                                            <div className="mt-4 pt-4 border-t border-slate-200/60">
                                                <div className="bg-white p-4 rounded-md border border-slate-200/80">
                                                    <p className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed">{isDraftExpanded ? cluster.draftContent : `${cluster.draftContent.substring(0, 250)}...`}</p>
                                                    {cluster.draftContent.length > 250 && <button onClick={() => toggleDraftExpansion(draftId)} className="text-blue-600 font-semibold text-xs mt-2 hover:underline" aria-expanded={isDraftExpanded}>{isDraftExpanded ? 'Show Less' : 'Show More'}</button>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                ))}
            </div>
          </section>
        )}

        <section className="pt-8 border-t border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center flex items-center justify-center gap-3">🚀 Roadmap to Google AI Overviews</h3>
            <p className="text-slate-600 bg-slate-100 p-4 rounded-lg border border-slate-200/80 mb-8 text-center max-w-3xl mx-auto">{strategy.aiOverviewIntro}</p>
            <div className="space-y-0">
                <div className="flex gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center"><span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold z-10 ring-8 ring-slate-50">1</span><div className="w-0.5 h-full bg-slate-200"></div></div>
                    <div className="pb-8"><h4 className="text-lg font-semibold text-slate-800 mb-2">Content Foundation</h4><ul className="space-y-2 list-disc list-inside pl-2 text-slate-600 leading-relaxed">{strategy.aiOverviewContent.map((point, index) => <li key={index}>{point}</li>)}</ul></div>
                </div>
                <div className="flex gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center"><span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold z-10 ring-8 ring-slate-50">2</span><div className="w-0.5 h-full bg-slate-200"></div></div>
                    <div className="pb-8"><h4 className="text-lg font-semibold text-slate-800 mb-2">Technical Signals with Schema</h4><ul className="space-y-2 list-disc list-inside pl-2 text-slate-600 leading-relaxed">{strategy.aiOverviewSchema.map((point, index) => <li key={index}>{point}</li>)}</ul></div>
                </div>
                <div className="flex gap-6">
                    <div className="flex-shrink-0"><span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold z-10 ring-8 ring-slate-50">3</span></div>
                    <div className="pb-8"><h4 className="text-lg font-semibold text-slate-800 mb-2">Trust with E-E-A-T</h4><ul className="space-y-2 list-disc list-inside pl-2 text-slate-600 leading-relaxed">{strategy.aiOverviewEEAT.map((point, index) => <li key={index}>{point}</li>)}</ul></div>
                </div>
            </div>
        </section>

        {strategy.competitorAnalysis && strategy.competitorAnalysis.length > 0 && (
          <section className="pt-8 border-t border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center flex items-center justify-center gap-2"><UsersGroupIcon /> Competitor Landscape</h3>
              <p className="text-slate-600 bg-slate-100 p-4 rounded-lg border border-slate-200/80 mb-8 text-center max-w-3xl mx-auto">Analysis of top competitors. Use their weaknesses as opportunities to create superior content.</p>
              <div className="space-y-6">
                  {strategy.competitorAnalysis.map((competitor, index) => (
                      <Card key={index} className="bg-white">
                          <h4 className="text-lg font-bold text-slate-800">{competitor.competitorName}</h4>
                          <p className="text-slate-600 mt-1 mb-4 italic leading-relaxed">"{competitor.strategySummary}"</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-green-50 border border-green-200 p-4 rounded-lg"><h5 className="font-semibold text-green-800 flex items-center gap-1.5 mb-2"><ThumbUpIcon /> Strengths</h5><ul className="list-disc list-inside space-y-1 text-sm text-green-900 leading-relaxed">{competitor.strengths.map((strength, sIndex) => <li key={sIndex}>{strength}</li>)}</ul></div>
                              <div className="bg-red-50 border border-red-200 p-4 rounded-lg"><h5 className="font-semibold text-red-800 flex items-center gap-1.5 mb-2"><ThumbDownIcon /> Weaknesses & Opportunities</h5><ul className="list-disc list-inside space-y-1 text-sm text-red-900 leading-relaxed">{competitor.weaknesses.map((weakness, wIndex) => <li key={wIndex}>{weakness}</li>)}</ul></div>
                          </div>
                      </Card>
                  ))}
              </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ContentStrategy;