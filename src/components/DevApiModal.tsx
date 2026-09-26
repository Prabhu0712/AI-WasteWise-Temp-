import React, { useState } from 'react';
import { X, Code, Copy, Check, Terminal, FileJson } from 'lucide-react';

interface DevApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevApiModal: React.FC<DevApiModalProps> = ({ isOpen, onClose }) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<'curl' | 'ts' | 'python'>('curl');

  if (!isOpen) return null;

  const curlSnippet = `curl -X POST http://localhost:3000/api/analyze-waste \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "data:image/jpeg;base64,...",
    "mimeType": "image/jpeg",
    "userNotes": "Construction debris found on residential site"
  }'`;

  const tsSnippet = `// Client-side TypeScript / Node.js
async function inspectWasteItem(base64Image: string) {
  const response = await fetch('/api/analyze-waste', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: base64Image,
      mimeType: 'image/jpeg',
      userNotes: 'Optional supplementary context'
    })
  });

  const { data } = await response.json();
  console.log("Identified Object:", data.objectName);
  console.log("Material:", data.material);
  console.log("Category:", data.wasteCategory);
  console.log("Reasoning:", data.reasoning);
  console.log("Disposal Channel:", data.disposalMethod);
  return data;
}`;

  const pythonSnippet = `import requests

def analyze_waste_specimen(image_base64_str):
    url = "http://localhost:3000/api/analyze-waste"
    payload = {
        "image": image_base64_str,
        "mimeType": "image/jpeg",
        "userNotes": "Industrial scrap piece"
    }
    response = requests.post(url, json=payload)
    result = response.json()
    
    if result.get("success"):
        data = result["data"]
        print(f"Object: {data['objectName']}")
        print(f"Material: {data['material']}")
        print(f"Reasoning: {data['reasoning']}")
        print(f"Disposal: {data['disposalMethod']}")
        return data
    else:
        raise Exception(result.get("error"))`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">VLM REST API Documentation</h2>
              <p className="text-xs text-slate-400">Integrate open-world vision-language material classification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          <div>
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                POST
              </span>
              <span className="text-slate-200 font-semibold text-sm">/api/analyze-waste</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Accepts any visual input (JPEG, PNG, WebP) in base64 format and evaluates the item through the Gemini 3.8 Flash multimodal reasoning engine.
            </p>
          </div>

          {/* Language Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveLang('curl')}
                  className={`px-3 py-1 rounded-md transition font-medium ${
                    activeLang === 'curl' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveLang('ts')}
                  className={`px-3 py-1 rounded-md transition font-medium ${
                    activeLang === 'ts' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  TypeScript
                </button>
                <button
                  onClick={() => setActiveLang('python')}
                  className={`px-3 py-1 rounded-md transition font-medium ${
                    activeLang === 'python' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Python
                </button>
              </div>

              <button
                onClick={() =>
                  handleCopy(
                    activeLang === 'curl' ? curlSnippet : activeLang === 'ts' ? tsSnippet : pythonSnippet,
                    'active'
                  )
                }
                className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition"
              >
                {copiedSnippet === 'active' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'active' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] leading-relaxed overflow-x-auto text-slate-300">
              <pre>
                {activeLang === 'curl' && curlSnippet}
                {activeLang === 'ts' && tsSnippet}
                {activeLang === 'python' && pythonSnippet}
              </pre>
            </div>
          </div>

          {/* Structured Output Schema Highlights */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center space-x-1.5">
              <FileJson className="w-4 h-4 text-emerald-400" />
              <span>Structured Response Payload</span>
            </h4>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-400 space-y-1">
              <div><strong className="text-emerald-400">objectName</strong>: string - Specific name of item</div>
              <div><strong className="text-emerald-400">material</strong>: string - Precise physical composition</div>
              <div><strong className="text-emerald-400">wasteCategory</strong>: string - Broad open-world waste stream</div>
              <div><strong className="text-emerald-400">reasoning</strong>: string - Visual feature analysis & optical proof</div>
              <div><strong className="text-emerald-400">disposalMethod</strong>: string - Primary recovery channel</div>
              <div><strong className="text-emerald-400">disposalSteps</strong>: string[] - Sequential handling instructions</div>
              <div><strong className="text-emerald-400">reuseAndUpcycling</strong>: Array - Upcycling ideas & difficulty</div>
              <div><strong className="text-emerald-400">environmentalImpact</strong>: Object - Decomposition & carbon metrics</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition text-xs"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
