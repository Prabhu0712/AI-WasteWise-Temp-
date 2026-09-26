import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageInput } from './components/ImageInput';
import { AnalysisResult } from './components/AnalysisResult';
import { DevApiModal } from './components/DevApiModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { WasteAnalysisResult, ScanHistoryItem } from './types/waste';
import {
  Sparkles,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Box,
  Layers,
  Cpu,
  Hammer,
  Shirt,
  Apple,
} from 'lucide-react';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<WasteAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ecolens_scan_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (result: WasteAnalysisResult, image: string) => {
    try {
      const newItem: ScanHistoryItem = {
        id: 'scan-' + Date.now(),
        timestamp: new Date().toISOString(),
        imageUrl: image,
        result,
      };
      const updated = [newItem, ...history].slice(0, 30); // Keep last 30
      setHistory(updated);
      localStorage.setItem('ecolens_scan_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to localStorage (quota or disabled)', e);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear all logged scan history?')) {
      setHistory([]);
      localStorage.removeItem('ecolens_scan_history');
    }
  };

  const handleAnalyze = async (userNotes?: string) => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-waste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          mimeType: 'image/jpeg',
          userNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze specimen.');
      }

      setAnalysisResult(data.data);
      saveToHistory(data.data, selectedImage);
    } catch (err: any) {
      console.error('VLM identification failed:', err);
      setError(
        err.message || 'An unexpected error occurred during multimodal analysis. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* Hero Section if no result yet */}
        {!analysisResult && (
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero Fixed-Class Restriction • Empirical Material Science</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Open-World Multimodal <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Waste & Material Classifier
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Feed any visual scene to our Vision-Language Model. From cardboard cartons and crushed PET bottles to concrete masonry, e-waste circuit boards, composite textiles, and organic scraps, get precise material composition, deep visual reasoning, and actionable disposal protocols.
            </p>

            {/* Quick Badges of Diverse Classes */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
              <span className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <Box className="w-3 h-3 text-amber-400" />
                <span>Cardboard & Paper</span>
              </span>
              <span className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <Layers className="w-3 h-3 text-sky-400" />
                <span>Rigid & Film Plastics</span>
              </span>
              <span className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <Hammer className="w-3 h-3 text-slate-400" />
                <span>Concrete & C&D Debris</span>
              </span>
              <span className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <Cpu className="w-3 h-3 text-emerald-400" />
                <span>E-Waste & Batteries</span>
              </span>
              <span className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <Shirt className="w-3 h-3 text-indigo-400" />
                <span>Textiles & Garments</span>
              </span>
              <span className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <Apple className="w-3 h-3 text-green-400" />
                <span>Organics & Biomass</span>
              </span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start space-x-3 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="text-red-200 block mb-0.5">Identification Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Dynamic View: Either Input or Analysis Results */}
        {analysisResult ? (
          <AnalysisResult
            result={analysisResult}
            stagedImage={selectedImage}
            onReset={handleReset}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            <ImageInput
              selectedImage={selectedImage}
              onSelectImage={(img) => {
                setSelectedImage(img);
                setError(null);
              }}
              onClearImage={() => {
                setSelectedImage(null);
                setError(null);
              }}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {/* Open World Architecture Explainer Callout */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                01
              </div>
              <h3 className="text-sm font-bold text-white">Open-World Recognition</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Traditional classifiers are trained on rigid labels (e.g. 5-10 classes) and break when encountering construction rubble, batteries, composite apparel, or unlisted items. Our VLM leverages visual reasoning to identify any physical matter without bounds.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/20">
                02
              </div>
              <h3 className="text-sm font-bold text-white">Multi-Part Component Separation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-world waste is rarely pure. The model decomposes assemblies—such as polypropylene caps on glass bottles, steel rebar embedded in hydraulic concrete, or adhesive tapes on corrugated boxes—to advise physical segregation before recycling.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs border border-teal-500/20">
                03
              </div>
              <h3 className="text-sm font-bold text-white">Circular Upcycling Protocols</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Beyond disposal bins, the system outputs immediate practical upcycling recipes and industrial reuse pathways to extend material lifecycles and reduce landfill emissions.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span>EcoLens Open-World Material & Waste VLM</span>
            <span>•</span>
            <span>Powered by Gemini 3.8 Flash</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="hover:text-slate-300 transition"
            >
              API Reference
            </button>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-slate-300 transition"
            >
              Scan Log ({history.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <DevApiModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={(item) => {
          setSelectedImage(item.imageUrl);
          setAnalysisResult(item.result);
          setError(null);
        }}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
