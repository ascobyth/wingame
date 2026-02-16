import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Move } from '../types';

interface StatsPanelProps {
  confidence: number[];
  historyCount: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ confidence, historyCount }) => {
  const data = [
    { name: 'Rock', prob: confidence[0] * 100 },
    { name: 'Paper', prob: confidence[1] * 100 },
    { name: 'Scissors', prob: confidence[2] * 100 },
  ];

  const COLORS = ['#ef4444', '#3b82f6', '#eab308']; // Red, Blue, Yellow

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-4xl">
        
        {/* Prediction Visualization */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex flex-col h-full">
            <h3 className="text-zinc-400 text-xs font-mono uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 pulse-glow"></span>
                AI Prediction (Next User Move)
            </h3>
            <div className="flex-grow min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30 }}>
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={60} tick={{fill: '#71717a', fontSize: 12, fontFamily: 'monospace'}} axisLine={false} tickLine={false}/>
                        <Tooltip 
                            contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff'}}
                            itemStyle={{color: '#fff'}}
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Probability']}
                        />
                        <Bar dataKey="prob" radius={[0, 4, 4, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-2 text-[10px] text-zinc-500 font-mono text-right">
               Strategy: Countering the highest probability
            </div>
        </div>

        {/* Model Architecture & Status */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex flex-col h-full gap-4">
             {/* Status Header */}
             <div>
                <h3 className="text-zinc-400 text-xs font-mono uppercase mb-2">Neural Network State</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white tracking-tight">{historyCount}</span>
                    <span className="text-zinc-500 text-xs uppercase tracking-wide">Training Samples</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ${historyCount < 5 ? 'bg-zinc-600' : 'bg-gradient-to-r from-violet-600 to-cyan-500'}`}
                        style={{ width: `${Math.min(historyCount * 2, 100)}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 font-mono flex justify-between">
                    <span>STATUS: {historyCount < 5 ? "GATHERING DATA" : "ACTIVE LEARNING"}</span>
                    <span>WINDOW: 5 MOVES</span>
                </p>
             </div>

             {/* Architecture Diagram */}
             <div className="flex-grow bg-zinc-950 rounded-lg border border-zinc-800/50 p-3 overflow-hidden relative group">
                <div className="absolute top-2 right-2 text-[9px] text-zinc-600 font-mono uppercase border border-zinc-800 px-1 rounded">Architecture</div>
                <div className="space-y-2 mt-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <code className="text-[10px] text-zinc-300 font-mono">Input: Flattened History (15)</code>
                    </div>
                    <div className="pl-3.5 border-l border-zinc-800 ml-[2.5px] space-y-2 py-1">
                        <div className="flex items-center gap-2">
                             <span className="text-[8px] text-zinc-600">▼</span>
                             <code className="text-[10px] text-violet-400 font-mono">Dense (32 units, ReLU)</code>
                        </div>
                         <div className="flex items-center gap-2">
                             <span className="text-[8px] text-zinc-600">▼</span>
                             <code className="text-[10px] text-zinc-400 font-mono">Dropout (0.2)</code>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-[8px] text-zinc-600">▼</span>
                             <code className="text-[10px] text-violet-400 font-mono">Dense (16 units, ReLU)</code>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                        <code className="text-[10px] text-zinc-300 font-mono">Output: Softmax (3 Probabilities)</code>
                    </div>
                </div>
             </div>
        </div>

    </div>
  );
};