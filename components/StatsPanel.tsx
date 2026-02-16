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

  const CHART_COLORS = ['#10b981', '#06b6d4', '#8b5cf6']; // Emerald, Cyan, Violet

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-4xl">
        
        {/* Prediction Visualization */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl flex flex-col h-full">
            <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-4 flex items-center gap-2 tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-glow"></span>
                PREDICTION_LAYER_V1
            </h3>
            <div className="flex-grow min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30 }}>
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={60} tick={{fill: '#52525b', fontSize: 11, fontFamily: 'monospace'}} axisLine={false} tickLine={false}/>
                        <Tooltip 
                            contentStyle={{backgroundColor: '#0a0a0a', borderColor: '#27272a', color: '#fff'}}
                            itemStyle={{color: '#fff'}}
                            cursor={{fill: 'rgba(255,255,255,0.03)'}}
                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Weight']}
                        />
                        <Bar dataKey="prob" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-2 text-[9px] text-zinc-600 font-mono text-right uppercase tracking-tighter">
               Strategy: Optimized Adversarial Response
            </div>
        </div>

        {/* Model Architecture & Status */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl flex flex-col h-full gap-4">
             {/* Status Header */}
             <div>
                <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-2 tracking-widest">NETWORK_SYNAPSE_STATE</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white tracking-tight">{historyCount}</span>
                    <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono">Samples</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-3 overflow-hidden border border-zinc-800">
                    <div 
                        className={`h-full transition-all duration-1000 ${historyCount < 5 ? 'bg-zinc-700' : 'bg-gradient-to-r from-emerald-600 to-cyan-500'}`}
                        style={{ width: `${Math.min(historyCount * 2, 100)}%` }}
                    ></div>
                </div>
                <p className="text-[9px] text-zinc-600 mt-2 font-mono flex justify-between tracking-tighter uppercase">
                    <span>ENGINE: {historyCount < 5 ? "INITIALIZING" : "OPTIMIZED"}</span>
                    <span>WINDOW_SIZE: 5_TURNS</span>
                </p>
             </div>

             {/* Architecture Diagram */}
             <div className="flex-grow bg-zinc-950 rounded-lg border border-zinc-800/40 p-3 overflow-hidden relative group">
                <div className="absolute top-2 right-2 text-[8px] text-zinc-700 font-mono uppercase border border-zinc-800 px-1.5 py-0.5 rounded tracking-widest">Architecture</div>
                <div className="space-y-2 mt-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                        <code className="text-[10px] text-zinc-400 font-mono">Input (n=15) [History]</code>
                    </div>
                    <div className="pl-3.5 border-l border-zinc-800/50 ml-[2.5px] space-y-2 py-1">
                        <div className="flex items-center gap-2">
                             <span className="text-[8px] text-zinc-700">▼</span>
                             <code className="text-[10px] text-emerald-500 font-mono">Dense (32, ReLU)</code>
                        </div>
                         <div className="flex items-center gap-2">
                             <span className="text-[8px] text-zinc-700">▼</span>
                             <code className="text-[10px] text-zinc-500 font-mono italic opacity-60">Dropout (0.2)</code>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-[8px] text-zinc-700">▼</span>
                             <code className="text-[10px] text-emerald-500 font-mono">Dense (16, ReLU)</code>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <code className="text-[10px] text-zinc-400 font-mono">Output [Softmax]</code>
                    </div>
                </div>
             </div>
        </div>

    </div>
  );
};