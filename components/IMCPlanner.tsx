import React, { useState } from 'react';
import { IMCPlan } from '../types';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { TargetIcon } from './icons/TargetIcon';
import { UsersIcon } from './icons/UsersIcon';
import { CashIcon } from './icons/CashIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';

interface IMCPlannerProps {
  plan: IMCPlan | null;
  loading: boolean;
  error: string | null;
  onGeneratePlan: (product: string, problem: string, audience:string, budget: number, budgetMethod: string) => void;
}

const IMCPlanner: React.FC<IMCPlannerProps> = ({ plan, loading, error, onGeneratePlan }) => {
  const [product, setProduct] = useState('Sữa tươi Vinamilk Green Farm');
  const [problem, setProblem] = useState('Tăng doanh thu từ dòng sữa tươi Green Farm lên 15% mỗi năm và cải thiện hình ảnh thương hiệu trong nhóm khách hàng trẻ.');
  const [audience, setAudience] = useState('Khách hàng trẻ (25 – 40 tuổi), thu nhập khá, sống ở thành thị, quan tâm đến sản phẩm organic và lối sống lành mạnh.');
  const [budget, setBudget] = useState(1000000000);
  const [budgetMethod, setBudgetMethod] = useState('Top-down');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePlan(product, problem, audience, budget, budgetMethod);
  };

  const PlanDisplay = () => {
    if (!plan) return null;

    return (
        <div className="mt-12 space-y-8 animate-fade-in">
            {/* Step 1: Objectives */}
            <Card>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><span className="text-2xl">1.</span> <TargetIcon className="w-6 h-6" /> Campaign Objectives</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                        <h4 className="font-semibold text-blue-700">Business Objective</h4>
                        <p className="text-slate-600 mt-1 text-sm">{plan.objectives.business}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                        <h4 className="font-semibold text-purple-700">Marketing Objective</h4>
                        <p className="text-slate-600 mt-1 text-sm">{plan.objectives.marketing}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                        <h4 className="font-semibold text-green-700">Communication Objective</h4>
                        <p className="text-slate-600 mt-1 text-sm">{plan.objectives.communication}</p>
                    </div>
                </div>
            </Card>

            {/* Step 2: Target Audience */}
            <Card>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><span className="text-2xl">2.</span> <UsersIcon className="w-6 h-6" /> Target Audience</h3>
                 <p className="text-slate-600 bg-slate-100 p-4 rounded-lg border border-slate-200/80 mb-6 text-sm italic">"{plan.targetAudience.summary}"</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80"><strong className="font-semibold text-slate-700 block mb-1">Demographic:</strong> {plan.targetAudience.demographic}</div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80"><strong className="font-semibold text-slate-700 block mb-1">Geographic:</strong> {plan.targetAudience.geographic}</div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80"><strong className="font-semibold text-slate-700 block mb-1">Psychographic:</strong> {plan.targetAudience.psychographic}</div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80"><strong className="font-semibold text-slate-700 block mb-1">Behavioral:</strong> {plan.targetAudience.behavioral}</div>
                </div>
            </Card>

            {/* Step 3: Insight */}
            <Card>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><span className="text-2xl">3.</span> <LightBulbIcon /> Consumer Insight</h3>
                <div className="space-y-3 text-sm">
                    <p><strong className="font-semibold text-blue-700">Truth:</strong> {plan.consumerInsight.truth}</p>
                    <p><strong className="font-semibold text-red-700">Tension:</strong> {plan.consumerInsight.tension}</p>
                    <p><strong className="font-semibold text-green-700">Motivation:</strong> {plan.consumerInsight.motivation}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-lg font-bold text-purple-800 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">"{plan.consumerInsight.insight}"</p>
                </div>
            </Card>

            {/* Step 4: Big Idea */}
            <Card className="text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3"><span className="text-2xl">4.</span>💡 Big Idea & Key Message</h3>
                <h4 className="text-3xl font-extrabold text-blue-600 tracking-tight">"{plan.bigIdea.idea}"</h4>
                <p className="mt-4 text-slate-600"><strong>Key Message:</strong> {plan.bigIdea.keyMessage}</p>
                <p className="mt-2 text-sm text-slate-500"><strong>Brand Role:</strong> {plan.bigIdea.brandRole}</p>
            </Card>

            {/* Step 5: Deployment Plan */}
            <Card>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><span className="text-2xl">5.</span> <DocumentTextIcon /> Deployment Plan</h3>
                <div className="space-y-6">
                    {plan.deploymentPlan.map((phase, index) => (
                         <div key={index} className="p-4 bg-slate-50/70 rounded-lg border border-slate-200/80">
                             <div className="flex justify-between items-start gap-2">
                                <h4 className="text-lg font-bold text-slate-700">{phase.phaseName}</h4>
                                <span className="flex-shrink-0 px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-md">{phase.duration}</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-500"><strong>Objective:</strong> {phase.objective}</p>
                            <div className="mt-4 pt-4 border-t border-slate-200/60">
                                <p className="text-sm font-semibold text-slate-600">Key Hook:</p>
                                <p className="text-sm text-blue-700 font-bold">{phase.keyHook}</p>
                                <p className="text-sm font-semibold text-slate-600 mt-3">Supporting Tactics:</p>
                                <ul className="list-disc list-inside pl-2 mt-1 space-y-1 text-sm text-slate-600">
                                    {phase.supportingTactics.map((tactic, i) => <li key={i}>{tactic}</li>)}
                                </ul>
                                <p className="mt-3 text-sm italic bg-white p-3 rounded-md border border-slate-200"><strong>Message:</strong> "{phase.keyMessage}"</p>
                            </div>
                         </div>
                    ))}
                </div>
            </Card>

            {/* Step 6: Measurement */}
            <Card>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><span className="text-2xl">6.</span> <ChartBarIcon className="w-6 h-6" /> Budget & Measurement</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-2">KPIs to Track</h4>
                        <div className="space-y-2">
                            {plan.measurement.kpis.map((kpi, index) => (
                                <div key={index} className="p-3 bg-slate-50 rounded-md border border-slate-200/80">
                                    <p className="font-semibold text-sm text-blue-800">{kpi.metric}</p>
                                    <p className="text-xs text-slate-500">{kpi.description} (Track via: {kpi.tool})</p>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Budget Allocation ({plan.measurement.budgetAllocation.approach})</h4>
                        <div className="space-y-2">
                             {plan.measurement.budgetAllocation.breakdown.map((item, index) => (
                                <div key={index} className="p-3 bg-slate-50 rounded-md border border-slate-200/80">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold text-sm text-blue-800">{item.channel}</p>
                                        <p className="text-sm font-bold">{item.percentage}% ({item.amount})</p>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${item.percentage}%`}}></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">{item.rationale}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI-Powered IMC Plan Generator</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-lg leading-8">Leverage the Tomorrow Marketers framework to build a comprehensive Integrated Marketing Communications plan for your brand.</p>
        </div>
        
        <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="product-name" className="block text-sm font-medium text-slate-700 mb-1">Product / Brand Name</label>
                    <input
                        type="text"
                        id="product-name"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., Sữa tươi Vinamilk Green Farm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="business-problem" className="block text-sm font-medium text-slate-700 mb-1">Business Problem / Goal</label>
                    <textarea
                        id="business-problem"
                        rows={3}
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., Increase market share by 5% in the next fiscal year."
                        required
                    />
                </div>
                <div>
                    <label htmlFor="target-audience" className="block text-sm font-medium text-slate-700 mb-1">Target Audience Description</label>
                    <textarea
                        id="target-audience"
                        rows={3}
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., Young urban professionals, 25-35, environmentally conscious, active on Instagram."
                        required
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-1">Total Campaign Budget (VND)</label>
                        <input
                            type="number"
                            id="budget"
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="budget-method" className="block text-sm font-medium text-slate-700 mb-1">Budgeting Method</label>
                        <select
                            id="budget-method"
                            value={budgetMethod}
                            onChange={(e) => setBudgetMethod(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option>Top-down</option>
                            <option>Bottom-up</option>
                        </select>
                    </div>
                </div>
                <div className="pt-2 text-center">
                    <button
                        type="submit"
                        disabled={loading || !product || !problem || !audience}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 transition-colors"
                    >
                        <SparklesIcon />
                        {loading ? 'Generating Plan...' : 'Generate IMC Plan'}
                    </button>
                </div>
            </form>
        </Card>

        {loading && (
            <div className="flex justify-center items-center py-10 mt-8">
                <Spinner />
            </div>
        )}

        {error && <p className="text-center text-red-500 my-4 p-4 bg-red-50 rounded-lg">{error}</p>}
        
        {plan && <PlanDisplay />}

    </div>
  );
};

export default IMCPlanner;