
import React, { useState, useRef, useCallback } from 'react';
import { analyzeAlignment } from './services/geminiService';
import { AnalysisResult, InputData } from './types';
import AnalysisView from './components/AnalysisView';

const App: React.FC = () => {
  const [jdText, setJdText] = useState('');
  const [cvText, setCvText] = useState('');
  const [cvImage, setCvImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setCvImage({ base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!jdText) {
      setError('Please provide a Job Description.');
      return;
    }
    if (!cvText && !cvImage) {
      setError('Please provide a CV (text or image).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: InputData = {
        jdText,
        cvText,
        cvImageBase64: cvImage?.base64,
        cvImageMimeType: cvImage?.mimeType,
      };
      const analysis = await analyzeAlignment(data);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setJdText('');
    setCvText('');
    setCvImage(null);
    setError(null);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <header className="max-w-6xl mx-auto mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Alignment Report</h1>
            <p className="text-slate-500 mt-1">Version 2.0 Engine • Honest Matching</p>
          </div>
        </header>
        <AnalysisView result={result} onReset={reset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="text-lg font-bold text-slate-900">Aligner <span className="text-indigo-600">v2.0</span></span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Stop Guessing. <br/><span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Start Aligning.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Our AI engine extracts hard requirements and applies realistic penalty scoring to ensure you only move forward with true matches.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Description Column */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Job Description</label>
            <div className="relative">
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full h-96 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none text-slate-700 resize-none font-medium leading-relaxed"
              />
              {jdText.length === 0 && (
                <div className="absolute top-6 left-6 pointer-events-none text-slate-400 italic">
                  Example: "Required: 5+ years React experience..."
                </div>
              )}
            </div>
          </div>

          {/* CV Column */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Candidate CV</label>
            <div className="flex flex-col gap-4 h-96">
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste CV text or upload an image/photo of the resume..."
                className="flex-1 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none text-slate-700 resize-none font-medium leading-relaxed"
              />
              
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed transition-all ${
                    cvImage ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {cvImage ? 'Image Attached' : 'Attach Photo of CV'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={runAnalysis}
            disabled={loading}
            className={`
              relative group overflow-hidden px-12 py-5 rounded-full font-bold text-white shadow-2xl transition-all
              ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}
            `}
          >
            <div className="flex items-center gap-3">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Calculating Alignment...</span>
                </>
              ) : (
                <>
                  <span>Analyze Compatibility</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </div>
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-white font-bold mb-4">Hard Requirements</h4>
            <p className="text-sm leading-relaxed">
              We extract mandatory skills and experience. Missing 3+ hard requirements automatically caps the score at 50% regardless of keyword density.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Keyword vs Qualification</h4>
            <p className="text-sm leading-relaxed">
              Our tool distinguishes between just mentioning a skill and actually demonstrating the required level of expertise and scale.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Enterprise Grade</h4>
            <p className="text-sm leading-relaxed">
              Used by recruiters to skip the keyword games and identify high-signal candidates instantly using Gemini Pro's thinking mode.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
