import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Layers,
  Link as LinkIcon,
  X,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  FileImage,
} from 'lucide-react';
import { SAMPLE_ITEMS } from '../data/samples';
import { SampleItem } from '../types/waste';
import { CameraCapture } from './CameraCapture';

interface ImageInputProps {
  selectedImage: string | null;
  onSelectImage: (base64OrUrl: string) => void;
  onClearImage: () => void;
  onAnalyze: (userNotes?: string) => void;
  isAnalyzing: boolean;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  selectedImage,
  onSelectImage,
  onClearImage,
  onAnalyze,
  isAnalyzing,
}) => {
  const [activeTab, setActiveTab] = useState<'samples' | 'upload' | 'camera' | 'url'>('samples');
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const rasterizeSvgToJpeg = (svgUri: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 450;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, 600, 450);
          ctx.drawImage(img, 0, 0, 600, 450);
          resolve(canvas.toDataURL('image/jpeg', 0.92));
          return;
        }
        resolve(svgUri);
      };
      img.onerror = () => {
        resolve(svgUri);
      };
      img.src = svgUri;
    });
  };

  const handleSelectSample = async (sample: SampleItem) => {
    try {
      const jpegData = await rasterizeSvgToJpeg(sample.image);
      onSelectImage(jpegData);
    } catch {
      onSelectImage(sample.image);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP, etc.).');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const rawData = e.target.result as string;
        if (file.type === 'image/svg+xml') {
          const jpegData = await rasterizeSvgToJpeg(rawData);
          onSelectImage(jpegData);
        } else {
          onSelectImage(rawData);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);
    if (!urlInput.trim()) return;

    try {
      new URL(urlInput.trim());
      // Convert URL to data URL using an offscreen image or pass directly
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            onSelectImage(dataUrl);
            setUrlInput('');
          } catch {
            // Fallback if tainted canvas
            onSelectImage(urlInput.trim());
            setUrlInput('');
          }
        }
      };
      img.onerror = () => {
        setUrlError('Could not load image from this URL. Please verify the URL or save and upload the image file.');
      };
      img.src = urlInput.trim();
    } catch {
      setUrlError('Please enter a valid HTTP or HTTPS image URL.');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
      {/* Selected Image Preview Mode */}
      {selectedImage ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full md:w-72 h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-inner flex items-center justify-center group">
              <img
                src={selectedImage}
                alt="Target material input"
                className="w-full h-full object-contain p-2"
              />
              <button
                onClick={onClearImage}
                disabled={isAnalyzing}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/90 hover:bg-red-500 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-sm border border-slate-700/80"
                title="Remove and select another image"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-emerald-400 font-mono border border-slate-800 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Image Ready for VLM</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Visual Input Staged</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Gemini 3.8 Flash will examine micro-textures, specular reflection, structural deformation, and material composition with zero closed-set restrictions.
                </p>
              </div>

              {/* Supplementary User Context */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Supplementary Context / Specific Question (Optional)</span>
                  <span className="text-[10px] text-slate-500 font-normal">e.g., origin, odor, contamination</span>
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. 'Found near automotive shop', 'Has greasy food residue', or 'Is this safe for home composting?'"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  disabled={isAnalyzing}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={() => onAnalyze(userNotes)}
                  disabled={isAnalyzing}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Inspecting Optical & Material Signatures...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Classify Material & Determine Disposal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={onClearImage}
                  disabled={isAnalyzing}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium border border-slate-700 transition"
                >
                  Choose Different Item
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Image Selection Tabs & Input Panes */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Stage Material for VLM Inspection</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload photos of packaging, C&D debris, e-waste, garments, organics, or pick a real-world sample.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('samples')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                  activeTab === 'samples'
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Samples</span>
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                  activeTab === 'upload'
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
              <button
                onClick={() => setActiveTab('camera')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                  activeTab === 'camera'
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Live Camera</span>
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                  activeTab === 'url'
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>URL</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Sample Library */}
          {activeTab === 'samples' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-300">
                  Select an open-world waste or material specimen:
                </span>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Click to test instantly
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {SAMPLE_ITEMS.map((sample: SampleItem) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="group text-left bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-3 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 mb-2.5 relative flex items-center justify-center">
                      <img
                        src={sample.image}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span
                        className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
                        style={{ backgroundColor: sample.accentColor }}
                      >
                        {sample.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition truncate">
                        {sample.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                        {sample.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center text-[10px] text-emerald-400/90 font-medium">
                      <span>Test Specimen</span>
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Drag & Drop / File Upload */}
          {activeTab === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/heic"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-950/50 hover:bg-slate-950'
                }`}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center mb-4 shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Drop your waste photo here, or <span className="text-emerald-400 underline">browse</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Supports JPEG, PNG, WebP, SVG, and high-res mobile snapshots. Up to 20MB.
                </p>
                <div className="mt-4 inline-flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <FileImage className="w-3.5 h-3.5 text-slate-400" />
                  <span>Works with packaging, concrete chunks, rebar, apparel, electronics, plastics, etc.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Live Camera View */}
          {activeTab === 'camera' && (
            <CameraCapture
              onCapture={(dataUrl) => {
                onSelectImage(dataUrl);
              }}
              onCancel={() => setActiveTab('samples')}
            />
          )}

          {/* TAB 4: Image URL */}
          {activeTab === 'url' && (
            <div className="max-w-xl mx-auto py-6">
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Direct Image Web Address (HTTP/HTTPS)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/... or public image URL"
                      className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition"
                    >
                      Fetch
                    </button>
                  </div>
                  {urlError && <p className="text-xs text-red-400 mt-2">{urlError}</p>}
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start space-x-2.5 text-xs text-slate-400">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    The image will be loaded and converted for client-to-server VLM processing. Ensure the host allows cross-origin requests or upload directly.
                  </span>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
