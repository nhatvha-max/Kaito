import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import KeywordDiscovery from './components/KeywordDiscovery';
import MetricsCalculator from './components/MetricsCalculator';
import ContentStrategy from './components/ContentStrategy';
import KeywordFocus from './components/KeywordFocus';
import IMCPlanner from './components/IMCPlanner';
import { Keyword, CategorizedKeywords, ContentStrategy as ContentStrategyType, KeywordDetails, SavedStrategy, IMCPlan } from './types';
import { fetchKeywords, generateContentStrategy, estimateMetricsForBudget, discoverKeywordsForTerm, fetchKeywordDetails, generateIMCPlan } from './services/geminiService';

enum View {
  Keywords,
  Metrics,
  Strategy,
  IMC,
}

const App: React.FC = () => {
  // Global state
  const [activeView, setActiveView] = useState<View>(View.Keywords);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  
  // Keyword Details State
  const [keywordDetails, setKeywordDetails] = useState<KeywordDetails | null>(null);
  const [keywordDetailsLoading, setKeywordDetailsLoading] = useState(false);
  const [keywordDetailsError, setKeywordDetailsError] = useState<string | null>(null);

  // Keyword Discovery state
  const [categorizedKeywords, setCategorizedKeywords] = useState<CategorizedKeywords>({
    motorcycleLoanKeywords: [],
    phoneLoanKeywords: [],
    tabletLoanKeywords: [],
    cashLoanKeywords: [],
    customSearchKeywords: [],
  });
  const [customSearchTerm, setCustomSearchTerm] = useState('');
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [customKeywordLoading, setCustomKeywordLoading] = useState(false);
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Metrics Calculator state
  const [budget, setBudget] = useState(50000000);
  const [scenario, setScenario] = useState("A standard Google Ads campaign targeting general consumer finance keywords in Vietnam.");
  const [cpc, setCpc] = useState(8000);
  const [ctr, setCtr] = useState(1.5);
  const [cvr, setCvr] = useState(2.5);
  const [aov, setAov] = useState(15000000);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // Content Strategy state
  const [strategy, setStrategy] = useState<ContentStrategyType | null>(null);
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [strategyError, setStrategyError] = useState<string | null>(null);

  // Saved Strategies
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  
  // IMC Planner state
  const [imcPlan, setImcPlan] = useState<IMCPlan | null>(null);
  const [imcPlanLoading, setImcPlanLoading] = useState(false);
  const [imcPlanError, setImcPlanError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedStrategies = localStorage.getItem('savedStrategies');
      if (storedStrategies) {
        setSavedStrategies(JSON.parse(storedStrategies));
      }
    } catch (error) {
      console.error("Failed to load strategies from localStorage", error);
    }
  }, []);

  const allKeywords = useMemo(() => [
    ...categorizedKeywords.customSearchKeywords,
    ...categorizedKeywords.motorcycleLoanKeywords,
    ...categorizedKeywords.phoneLoanKeywords,
    ...categorizedKeywords.tabletLoanKeywords,
    ...categorizedKeywords.cashLoanKeywords,
  ], [categorizedKeywords]);
  
  // Keyword Discovery Logic
  const handleFetchKeywords = useCallback(async () => {
    setKeywordLoading(true);
    setKeywordError(null);
    setHasSearched(true);
    setSelectedKeyword(null);
    setKeywordDetails(null);
    try {
      const result = await fetchKeywords();
      setCategorizedKeywords(prev => ({ ...prev, ...result }));
    } catch (err) {
      setKeywordError('Failed to fetch keywords. Please try again.');
      console.error(err);
    } finally {
      setKeywordLoading(false);
    }
  }, []);

  const handleDiscoverKeywordsForTerm = useCallback(async () => {
    if (!customSearchTerm.trim()) return;
    setCustomKeywordLoading(true);
    setKeywordError(null);
    setHasSearched(true);
    setSelectedKeyword(null);
    setKeywordDetails(null);
    try {
      const result = await discoverKeywordsForTerm(customSearchTerm);
      setCategorizedKeywords(prev => ({
        ...prev,
        customSearchKeywords: result,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred. Please try again.';
      setKeywordError(message);
      console.error(err);
    } finally {
      setCustomKeywordLoading(false);
    }
  }, [customSearchTerm]);

  const handleSelectKeyword = useCallback(async (keyword: Keyword) => {
    setSelectedKeyword(keyword);
    setKeywordDetails(null);
    setKeywordDetailsLoading(true);
    setKeywordDetailsError(null);
    try {
      const details = await fetchKeywordDetails(keyword.keyword);
      setKeywordDetails(details);
    } catch (err) {
      setKeywordDetailsError('Failed to load keyword details.');
      console.error(err);
    } finally {
      setKeywordDetailsLoading(false);
    }
  }, []);

  // Content Strategy Logic
  const handleGenerateStrategy = useCallback(async () => {
    if (!selectedKeyword) return;
    setActiveView(View.Strategy);
    setStrategyLoading(true);
    setStrategyError(null);
    setStrategy(null);
    try {
      const result = await generateContentStrategy(selectedKeyword.keyword);
      setStrategy(result);
    } catch (err) {
      setStrategyError('Failed to generate content strategy. Please try again.');
      console.error(err);
    } finally {
      setStrategyLoading(false);
    }
  }, [selectedKeyword]);

  // Metrics Analysis Logic
  const handleEstimateMetrics = useCallback(async () => {
    setMetricsLoading(true);
    setMetricsError(null);
    try {
      const result = await estimateMetricsForBudget(budget, scenario);
      setCpc(result.cpc);
      setCtr(result.ctr);
      setCvr(result.cvr);
      setAov(result.aov);
    } catch (err) {
      setMetricsError('Failed to estimate metrics. Please try again.');
      console.error(err);
    } finally {
      setMetricsLoading(false);
    }
  }, [budget, scenario]);

  // Saved Strategy Logic
  const handleSaveStrategy = useCallback(() => {
    if (!strategy || !selectedKeyword) return;
    const newSavedStrategy: SavedStrategy = {
        ...strategy,
        id: new Date().toISOString(),
        keyword: selectedKeyword.keyword,
    };
    const updatedStrategies = [...savedStrategies, newSavedStrategy];
    setSavedStrategies(updatedStrategies);
    localStorage.setItem('savedStrategies', JSON.stringify(updatedStrategies));
  }, [strategy, selectedKeyword, savedStrategies]);

  const handleDeleteStrategy = useCallback((id: string) => {
    const updatedStrategies = savedStrategies.filter(s => s.id !== id);
    setSavedStrategies(updatedStrategies);
    localStorage.setItem('savedStrategies', JSON.stringify(updatedStrategies));
  }, [savedStrategies]);

  const handleLoadStrategy = useCallback((savedStrategy: SavedStrategy) => {
    const { id, keyword, ...strategyContent } = savedStrategy;
    const originalKeyword = allKeywords.find(k => k.keyword === keyword) || { keyword, volume: 'Medium', intent: 'Informational', cpc: '0', competition: 'Low', semrushLink: '' };
    
    handleSelectKeyword(originalKeyword as Keyword);
    setStrategy(strategyContent as ContentStrategyType);
    setActiveView(View.Strategy);
  }, [allKeywords, handleSelectKeyword]);

  // IMC Planner Logic
  const handleGenerateIMCPlan = useCallback(async (product: string, problem: string, audience: string, budget: number, budgetMethod: string) => {
    setImcPlanLoading(true);
    setImcPlanError(null);
    setImcPlan(null);
    try {
      const result = await generateIMCPlan(product, problem, audience, budget, budgetMethod);
      setImcPlan(result);
    } catch (err) {
      setImcPlanError('Failed to generate IMC plan. Please try again.');
      console.error(err);
    } finally {
      setImcPlanLoading(false);
    }
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case View.Keywords:
        return <KeywordDiscovery 
          categorizedKeywords={categorizedKeywords}
          loading={keywordLoading}
          customLoading={customKeywordLoading}
          error={keywordError}
          hasSearched={hasSearched}
          onFetchKeywords={handleFetchKeywords}
          onKeywordSelect={handleSelectKeyword}
          selectedKeyword={selectedKeyword}
          customSearchTerm={customSearchTerm}
          onCustomSearchTermChange={setCustomSearchTerm}
          onDiscoverForTerm={handleDiscoverKeywordsForTerm}
        />;
      case View.Metrics:
        return <MetricsCalculator 
          budget={budget} 
          onBudgetChange={setBudget}
          scenario={scenario}
          onScenarioChange={setScenario}
          onEstimate={handleEstimateMetrics}
          cpc={cpc}
          ctr={ctr}
          cvr={cvr}
          aov={aov}
          loading={metricsLoading}
          error={metricsError}
          selectedKeyword={selectedKeyword}
        />;
      case View.Strategy:
        return <ContentStrategy
          selectedKeyword={selectedKeyword}
          strategy={strategy}
          loading={strategyLoading}
          error={strategyError}
          onGenerateStrategy={handleGenerateStrategy}
          onSaveStrategy={handleSaveStrategy}
          savedStrategies={savedStrategies}
        />;
      case View.IMC:
        return <IMCPlanner
          plan={imcPlan}
          loading={imcPlanLoading}
          error={imcPlanError}
          onGeneratePlan={handleGenerateIMCPlan}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <Sidebar 
        activeView={activeView}
        onViewChange={setActiveView}
        savedStrategies={savedStrategies}
        onLoadStrategy={handleLoadStrategy}
        onDeleteStrategy={handleDeleteStrategy}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {renderActiveView()}
      </main>
      <KeywordFocus 
        keyword={selectedKeyword}
        details={keywordDetails}
        loading={keywordDetailsLoading}
        error={keywordDetailsError}
        onGenerateStrategy={handleGenerateStrategy}
        onClose={() => setSelectedKeyword(null)}
      />
    </div>
  );
};

export default App;