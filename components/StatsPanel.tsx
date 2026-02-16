import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Move } from '../types';

interface StatsPanelProps {
    confidence: number[];
    historyCount: number;
    playerScore: number;
    aiScore: number;
    totalRounds: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ confidence, historyCount, playerScore, aiScore, totalRounds }) => {
    const data = [
        { name: 'Rock', prob: confidence[0] * 100 },
        { name: 'Paper', prob: confidence[1] * 100 },
        { name: 'Scissors', prob: confidence[2] * 100 },
    ];

    const CHART_COLORS = ['#10b981', '#06b6d4', '#8b5cf6']; // Emerald, Cyan, Violet

    // Calculate win percentages
    const playerWinRate = totalRounds > 0 ? ((playerScore / totalRounds) * 100).toFixed(1) : '0.0';
    const aiWinRate = totalRounds > 0 ? ((aiScore / totalRounds) * 100).toFixed(1) : '0.0';
    const tieRate = totalRounds > 0 ? (((totalRounds - playerScore - aiScore) / totalRounds) * 100).toFixed(1) : '0.0';

    // Determine who is winning
    const getWinningStatus = () => {
        if (playerScore > aiScore) return { text: 'USER LEADING', color: 'text-white', icon: '👤' };
        if (aiScore > playerScore) return { text: 'AGENT LEADING', color: 'text-emerald-400', icon: '🤖' };
        return { text: 'TIE GAME', color: 'text-zinc-400', icon: '⚡' };
    };

    const winningStatus = getWinningStatus();

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
                            <YAxis dataKey="name" type="category" width={60} tick={{ fill: '#52525b', fontSize: 11, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#27272a', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
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

            {/* Win Rate Statistics */}
            <div className="col-span-1 md:col-span-2 bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl">
                <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-4 flex items-center gap-2 tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 pulse-glow"></span>
                    WIN_RATE_ANALYSIS
                </h3>

                {/* Who is winning banner */}
                <div className={`text-center py-3 px-4 rounded-lg mb-4 bg-zinc-950 border border-zinc-800/50`}>
                    <span className="text-lg mr-2">{winningStatus.icon}</span>
                    <span className={`text-sm font-bold tracking-wider ${winningStatus.color}`}>{winningStatus.text}</span>
                </div>

                {/* Win rate bars */}
                <div className="space-y-3">
                    {/* User win rate */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">👤 User Win Rate</span>
                            <span className="text-sm font-mono text-white font-bold">{playerWinRate}%</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                            <div
                                className="h-full bg-gradient-to-r from-white to-zinc-400 transition-all duration-500"
                                style={{ width: `${playerWinRate}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Agent win rate */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">🤖 Agent Win Rate</span>
                            <span className="text-sm font-mono text-emerald-400 font-bold">{aiWinRate}%</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                                style={{ width: `${aiWinRate}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Tie rate */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">⚡ Tie Rate</span>
                            <span className="text-sm font-mono text-zinc-500 font-bold">{tieRate}%</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                            <div
                                className="h-full bg-zinc-600 transition-all duration-500"
                                style={{ width: `${tieRate}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Summary stats */}
                <div className="mt-4 pt-3 border-t border-zinc-800/50 flex justify-between text-[9px] text-zinc-600 font-mono uppercase tracking-tighter">
                    <span>Total Rounds: {totalRounds}</span>
                    <span>User Wins: {playerScore} | Agent Wins: {aiScore}</span>
                </div>
            </div>

        </div>
    );
};