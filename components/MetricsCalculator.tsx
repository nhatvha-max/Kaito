import React, { useMemo, useEffect } from 'react';
import { Card } from './common/Card';
import { Keyword, MarketingMetrics } from '../types';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { EyeIcon } from './icons/EyeIcon';
import { CursorClickIcon } from './icons/CursorClickIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { CashIcon } from './icons/CashIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { SparklesIcon } from './icons/SparklesIcon';


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

interface MetricsCalculatorProps {
  budget: number;
  onBudgetChange: (value: number) => void;
  scenario: string;
  onScenarioChange: (value: string) => void;
  onEstimate: () => void;
  cpc: number;
  ctr: number;
  cvr: number;
  aov: number;
  loading: boolean;
  error: string | null;
  selectedKeyword: Keyword | null;
}

const EstimatedMetricDisplay = ({ title, value, isLoading }: { title: string, value: string, isLoading: boolean }) => (
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
        <p className="text-sm text-slate-500">{title}</p>
        {isLoading ? (
            <div className="h-7 w-24 bg-slate-200 rounded animate-pulse mt-1"></div>
        ) : (
            <p className="text-lg font-bold text-slate-800 mt-1">{value}</p>
        )}
    </div>
);


const MetricsCalculator: React.FC<MetricsCalculatorProps> = ({
  budget, onBudgetChange,
  scenario, onScenarioChange,
  onEstimate,
  cpc,
  ctr,
  cvr,
  aov,
  loading,
  error,
  selectedKeyword
}) => {

  useEffect(() => {
    if (selectedKeyword) {
        onScenarioChange(`A Google Ads campaign focused on maximizing conversions for the keyword "${selectedKeyword.keyword}" in key Vietnamese cities.`);
    }
  }, [selectedKeyword, onScenarioChange]);
  
  const metrics: MarketingMetrics = useMemo(() => {
    if (budget <= 0 || cpc <= 0 || ctr <= 0) {
        return { impressions: 0, totalClicks: 0, totalConversions: 0, cpm: 0, cpa: 0, totalRevenue: 0, roas: 0 };
    }
    const totalClicks = budget / cpc;
    const impressions = (totalClicks / (ctr / 100));
    const cpm = (budget / impressions) * 1000;
    const totalConversions = totalClicks * (cvr / 100);
    const totalRevenue = totalConversions * aov;
    const roas = totalRevenue / budget;
    const cpa = totalConversions > 0 ? budget / totalConversions : 0;
    return { impressions, totalClicks, totalConversions, cpm, cpa, totalRevenue, roas };
  }, [budget, cpc, ctr, cvr, aov]);

  const funnelData = useMemo(() => [
    { name: 'Impressions', value: Math.round(metrics.impressions), fill: '#60a5fa' },
    { name: 'Clicks', value: Math.round(metrics.totalClicks), fill: '#3b82f6' },
    { name: 'Conversions', value: Math.round(metrics.totalConversions), fill: '#2563eb' },
  ].filter(d => d.value > 0), [metrics]);
  
  const MetricCard = ({ title, value, icon, formula, prefix = '', suffix = '' }: {title: string, value: string | number, icon: React.ReactNode, formula?: string, prefix?: string, suffix?: string}) => (
    <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-200/80">
        <div className="flex items-center gap-2 relative group">
            {icon}
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            {formula && (
              <>
                <InformationCircleIcon className="w-4 h-4 text-slate-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 w-max max-w-xs scale-0 group-hover:scale-100 transition-transform origin-bottom bg-slate-800 text-white text-xs font-mono p-2 rounded-md z-10 shadow-lg">
                    {formula}
                </div>
              </>
            )}
        </div>
        <p className="text-2xl font-bold text-blue-700 mt-1">{prefix}{value}{suffix}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Campaign Projection Tool</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-lg leading-8">Describe a campaign scenario and set a budget to see AI-powered projections for your marketing performance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <h3 className="text-lg font-semibold mb-2">Campaign Scenario</h3>
                <p className="text-sm text-slate-500 mb-6">Define your campaign budget and describe a specific scenario to get AI-powered estimations.</p>
                
                <div className="space-y-4">
                     <div>
                        <label htmlFor="budget-input" className="block text-sm font-medium text-slate-700 mb-1">Campaign Budget (VND)</label>
                        <input
                            type="number"
                            id="budget-input"
                            value={budget}
                            onChange={(e) => onBudgetChange(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g., 50000000"
                        />
                    </div>
                    <div>
                        <label htmlFor="scenario-input" className="block text-sm font-medium text-slate-700 mb-1">Marketing Scenario</label>
                        <textarea
                            id="scenario-input"
                            rows={5}
                            value={scenario}
                            onChange={(e) => onScenarioChange(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g., Launch a campaign for 'vay mua xe máy Honda Vision' targeting young adults in Hanoi with a goal to maximize conversions."
                        />
                    </div>
                    <button 
                        onClick={onEstimate} 
                        disabled={loading || !scenario.trim() || budget <= 0}
                        className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <SparklesIcon />
                        {loading ? 'Estimating...' : 'Estimate Metrics'}
                    </button>
                </div>
                
                <div className="mt-8">
                    <h4 className="text-md font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <SparklesIcon /> AI-Estimated Metrics
                    </h4>
                    {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <EstimatedMetricDisplay 
                            title="Cost Per Click (CPC)"
                            value={formatCurrency(cpc)}
                            isLoading={loading}
                        />
                         <EstimatedMetricDisplay 
                            title="Click-Through Rate (CTR)"
                            value={`${ctr.toFixed(2)}%`}
                            isLoading={loading}
                        />
                         <EstimatedMetricDisplay 
                            title="Conversion Rate (CVR)"
                            value={`${cvr.toFixed(2)}%`}
                            isLoading={loading}
                        />
                         <EstimatedMetricDisplay 
                            title="Avg. Revenue"
                            value={formatCurrency(aov)}
                            isLoading={loading}
                        />
                    </div>
                </div>
            </Card>

            <div className="lg:col-span-2">
                <Card className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Projected Results</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <MetricCard title="Impressions" value={metrics.impressions.toLocaleString(undefined, { maximumFractionDigits: 0 })} icon={<EyeIcon className="w-5 h-5 text-slate-400" />} formula="Clicks ÷ CTR %" />
                        <MetricCard title="Total Clicks" value={metrics.totalClicks.toLocaleString(undefined, { maximumFractionDigits: 0 })} icon={<CursorClickIcon className="w-5 h-5 text-slate-400" />} formula="Budget ÷ CPC" />
                        <MetricCard title="Conversions" value={metrics.totalConversions.toFixed(2)} icon={<ShoppingCartIcon className="w-5 h-5 text-slate-400" />} formula="Clicks × CVR %" />
                        <MetricCard title="Cost Per Mille (CPM)" value={formatCurrency(metrics.cpm)} icon={<CashIcon className="w-5 h-5 text-slate-400" />} formula="(Budget ÷ Impressions) × 1000" />
                        <MetricCard title="Cost Per Acquisition (CPA)" value={formatCurrency(metrics.cpa)} icon={<CashIcon className="w-5 h-5 text-slate-400" />} formula="Budget ÷ Conversions" />
                        <MetricCard title="Return on Ad Spend (ROAS)" value={metrics.roas.toFixed(2)} suffix="x" icon={<TrendingUpIcon className="w-5 h-5 text-slate-400" />} formula="Revenue ÷ Budget" />
                        <div className="md:col-span-3">
                            <MetricCard title="Total Revenue" value={formatCurrency(metrics.totalRevenue)} icon={<CashIcon className="w-5 h-5 text-slate-400" />} formula="Conversions × Avg. Revenue" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold mb-4">Marketing Funnel Visualization</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        {funnelData.length > 0 ? (
                            <ResponsiveContainer>
                                <FunnelChart>
                                    <Tooltip formatter={(value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
                                    <Funnel
                                    dataKey="value"
                                    data={funnelData}
                                    isAnimationActive
                                    >
                                    <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                                    <LabelList position="center" fill="#fff" stroke="none" dataKey="value" formatter={(value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
                                    </Funnel>
                                </FunnelChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                <p>Enter valid metrics to see funnel visualization.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default MetricsCalculator;