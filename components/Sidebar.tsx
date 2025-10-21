import React from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SavedStrategy } from '../types';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

enum View {
  Keywords,
  Metrics,
  Strategy,
  IMC,
}

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  savedStrategies: SavedStrategy[];
  onLoadStrategy: (strategy: SavedStrategy) => void;
  onDeleteStrategy: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, savedStrategies, onLoadStrategy, onDeleteStrategy }) => {
  
  const NavItem = ({ view, icon, label }: { view: View; icon: React.ReactNode; label: string }) => (
    <li>
      <button
        onClick={() => onViewChange(view)}
        className={`w-full flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 text-center ${
          activeView === view
            ? 'bg-blue-50 text-blue-600 font-semibold'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
        }`}
        aria-current={activeView === view ? 'page' : undefined}
      >
        {icon}
        <span className="text-xs font-medium mt-1.5">{label}</span>
      </button>
    </li>
  );

  return (
    <aside className="w-20 bg-white border-r border-slate-200 flex flex-col p-2">
      <div className="flex flex-col items-center pt-4 pb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
            M
        </div>
        <div className="text-center mt-2">
            <h1 className="text-sm font-bold text-slate-800">Mcredit</h1>
            <p className="text-xs text-slate-500 -mt-0.5">AI</p>
        </div>
      </div>
      
      <nav className="mt-4">
        <ul className="space-y-2">
          <NavItem view={View.Keywords} icon={<SearchIcon className="h-6 w-6" />} label="Explorer" />
          <NavItem view={View.Metrics} icon={<ChartBarIcon className="h-6 w-6" />} label="Project" />
          <NavItem view={View.Strategy} icon={<LightBulbIcon />} label="Strategize" />
          <NavItem view={View.IMC} icon={<DocumentTextIcon />} label="IMC Plan" />
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-200">
        <h2 className="text-xs font-semibold text-slate-500 text-center mb-2">Saved</h2>
        <div className="overflow-y-auto max-h-64 space-y-1.5">
            {savedStrategies.length > 0 ? (
                savedStrategies.map(s => (
                    <div key={s.id} className="group relative p-2 text-center bg-slate-100 rounded-lg">
                        <p className="text-xs font-semibold text-blue-800 truncate">{s.keyword}</p>
                        <button 
                            onClick={() => onLoadStrategy(s)}
                            className="text-xs text-slate-600 hover:text-blue-600 font-medium"
                        >
                            Load
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteStrategy(s.id); }} 
                            aria-label={`Delete strategy for ${s.keyword}`}
                            className="absolute top-1 right-1 p-0.5 text-slate-400 bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-opacity"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-xs text-slate-400 text-center p-2">No saved strategies.</p>
            )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;