import React, { useState } from 'react';
import { X, Trash2, History, ArrowRight, Filter, FileText } from 'lucide-react';
import { ScanHistoryItem } from '../types/waste';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistoryItem[];
  onSelectHistoryItem: (item: ScanHistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = Array.from(new Set(history.map((h) => h.result.wasteCategory)));

  const filteredHistory = filterCategory === 'all'
    ? history
    : history.filter((h) => h.result.wasteCategory === filterCategory);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Classification History</h2>
              <p className="text-xs text-slate-400">{history.length} specimen(s) logged</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                title="Clear all saved history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter categories */}
        {categories.length > 1 && (
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center space-x-2 overflow-x-auto text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded-md shrink-0 transition font-medium ${
                filterCategory === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({history.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md shrink-0 transition font-medium ${
                  filterCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Drawer List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 px-4 text-slate-500">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-slate-400">No scans recorded yet</p>
              <p className="text-xs text-slate-600 mt-1">
                Upload or select an image specimen to analyze materials and view past audits here.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="w-full text-left bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-3 transition flex items-center space-x-3.5 group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.result.objectName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition truncate">
                      {item.result.objectName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate">
                    {item.result.material}
                  </p>

                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                      {item.result.wasteCategory}
                    </span>
                    <span className="text-[10px] text-emerald-400/90 font-medium">
                      {item.result.confidenceScore}% Conf
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
