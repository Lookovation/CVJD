
import React from 'react';
import { AnalysisResult } from '../types';
import RequirementBadge from './RequirementBadge';
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisView: React.FC<Props> = ({ result, onReset }) => {
  const data = [
    { name: 'Match', value: result.score },
    { name: 'Gap', value: 100 - result.score },
  ];

  const COLORS = [
    result.score >= 85 ? '#10b981' : result.score >= 65 ? '#f59e0b' : '#ef4444',
    '#e5e7eb'
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Score Card */}
        <div className="w-full md:w-1/3 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Alignment Score</h2>
          <div className="w-full h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
              <span className="text-5xl font-bold text-slate-900">{result.score}%</span>
              <span className={`text-sm font-bold uppercase mt-2 ${result.score >= 85 ? 'text-green-600' : 'text-slate-600'}`}>
                {result.classification}
              </span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl w-full">
            <p className="text-sm text-slate-600 leading-relaxed italic">
              "{result.summary}"
            </p>
          </div>

          <button 
            onClick={onReset}
            className="mt-8 w-full py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            New Analysis
          </button>
        </div>

        {/* Requirements Breakdown */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
              Requirement Analysis
            </h3>
            
            <div className="space-y-4">
              {result.requirements.map((req, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-semibold text-slate-800">{req.label}</span>
                    <RequirementBadge status={req.status} type={req.type} />
                  </div>
                  <p className="text-sm text-slate-500">{req.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gaps & Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                Critical Gaps
                {result.hardRequirementGapsCount > 0 && (
                  <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded-full">
                    {result.hardRequirementGapsCount} Hard
                  </span>
                )}
              </h4>
              <ul className="space-y-3">
                {result.gaps.map((gap, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h4 className="font-bold text-green-600 mb-4">Core Strengths</h4>
              <ul className="space-y-3">
                {result.strengths.map((str, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    {str}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Optimized Recommendations
            </h4>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                  <span className="text-indigo-300 font-bold">0{i+1}</span>
                  <p className="text-sm text-indigo-50 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
