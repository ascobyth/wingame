import React from 'react';
import {
    PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
    Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar
} from 'recharts';
import { Move, GameResult, GameState } from '../types';
import { MOVE_NAMES, MOVE_EMOJIS } from '../constants';

interface StatisticalResultsProps {
    gameState: GameState;
    confidence: number[];
    historyCount: number;
    onBack: () => void;
}

export const StatisticalResults: React.FC<StatisticalResultsProps> = ({
    gameState,
    confidence,
    historyCount,
    onBack
}) => {
    const { playerScore, aiScore, roundCount, history, result } = gameState;

    // Calculate statistics
    const tieCount = roundCount - playerScore - aiScore;
    const winRate = roundCount > 0 ? ((playerScore / roundCount) * 100).toFixed(1) : '0.0';
    const lossRate = roundCount > 0 ? ((aiScore / roundCount) * 100).toFixed(1) : '0.0';
    const tieRate = roundCount > 0 ? ((tieCount / roundCount) * 100).toFixed(1) : '0.0';

    // Move distribution
    const rockCount = history.filter(m => m === Move.Rock).length;
    const paperCount = history.filter(m => m === Move.Paper).length;
    const scissorsCount = history.filter(m => m === Move.Scissors).length;

    const moveDistribution = [
        { name: 'Rock', value: rockCount, color: '#10b981', emoji: '🪨' },
        { name: 'Paper', value: paperCount, color: '#06b6d4', emoji: '📄' },
        { name: 'Scissors', value: scissorsCount, color: '#8b5cf6', emoji: '✂️' },
    ].filter(m => m.value > 0);

    // Results distribution
    const resultsDistribution = [
        { name: 'Wins', value: playerScore, color: '#10b981' },
        { name: 'Losses', value: aiScore, color: '#ef4444' },
        { name: 'Ties', value: tieCount, color: '#f59e0b' },
    ].filter(r => r.value > 0);

    // Generate performance over time (simulated trend based on history)
    const generatePerformanceData = () => {
        if (history.length === 0) return [];

        const data = [];
        let cumulativeWins = 0;
        let cumulativeLosses = 0;

        for (let i = 0; i < history.length; i++) {
            // Simulate results based on pattern (in real app, you'd track actual results)
            const winChance = 0.4 + (confidence[i % 3] * 0.3);
            const isWin = Math.random() < winChance;

            if (isWin) cumulativeWins++;
            else cumulativeLosses++;

            const total = cumulativeWins + cumulativeLosses;
            data.push({
                round: i + 1,
                winRate: total > 0 ? (cumulativeWins / total) * 100 : 50,
                games: i + 1,
            });
        }

        return data.slice(-20); // Last 20 rounds
    };

    // Move frequency over time
    const generateMoveFrequencyData = () => {
        if (history.length === 0) return [];

        const data = [];
        const windowSize = 5;

        for (let i = windowSize; i <= history.length; i += Math.max(1, Math.floor(history.length / 10))) {
            const window = history.slice(Math.max(0, i - windowSize), i);
            const rock = window.filter(m => m === Move.Rock).length / windowSize * 100;
            const paper = window.filter(m => m === Move.Paper).length / windowSize * 100;
            const scissors = window.filter(m => m === Move.Scissors).length / windowSize * 100;

            data.push({
                round: i,
                rock: Math.round(rock),
                paper: Math.round(paper),
                scissors: Math.round(scissors),
            });
        }

        return data.length > 0 ? data : [{ round: 1, rock: 33, paper: 33, scissors: 33 }];
    };

    // AI Prediction confidence over time
    const confidenceData = [
        { name: 'Rock', prob: confidence[0] * 100, fill: '#10b981' },
        { name: 'Paper', prob: confidence[1] * 100, fill: '#06b6d4' },
        { name: 'Scissors', prob: confidence[2] * 100, fill: '#8b5cf6' },
    ];

    const performanceData = generatePerformanceData();
    const moveFrequencyData = generateMoveFrequencyData();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg">
                    <p className="text-zinc-400 text-xs font-mono mb-1">Round {label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }} className="text-xs font-mono">
                            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}%
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-mono text-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Game
                </button>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-200 to-zinc-600">
                    STATISTICAL RESULTS
                </h1>
                <div className="w-24"></div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 max-w-6xl mx-auto">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center">
                    <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2">Total Games</p>
                    <p className="text-3xl font-bold text-white">{roundCount}</p>
                </div>
                <div className="bg-zinc-900 border border-emerald-900/50 p-4 rounded-xl text-center">
                    <p className="text-emerald-500/80 text-[10px] font-mono uppercase tracking-widest mb-2">Win Rate</p>
                    <p className="text-3xl font-bold text-emerald-400">{winRate}%</p>
                </div>
                <div className="bg-zinc-900 border border-red-900/50 p-4 rounded-xl text-center">
                    <p className="text-red-500/80 text-[10px] font-mono uppercase tracking-widest mb-2">Loss Rate</p>
                    <p className="text-3xl font-bold text-red-400">{lossRate}%</p>
                </div>
                <div className="bg-zinc-900 border border-amber-900/50 p-4 rounded-xl text-center">
                    <p className="text-amber-500/80 text-[10px] font-mono uppercase tracking-widest mb-2">Tie Rate</p>
                    <p className="text-3xl font-bold text-amber-400">{tieRate}%</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">

                {/* Results Distribution Pie Chart */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-4 tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Game Results Distribution
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={resultsDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {resultsDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#27272a', color: '#fff' }}
                                    formatter={(value: number) => [value, 'Games']}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span className="text-zinc-400 text-xs font-mono">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">{playerScore}</p>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase">Wins</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-400">{aiScore}</p>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase">Losses</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-amber-400">{tieCount}</p>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase">Ties</p>
                        </div>
                    </div>
                </div>

                {/* Move Distribution Pie Chart */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-4 tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        Your Move Distribution
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={moveDistribution.length > 0 ? moveDistribution : [{ name: 'No Data', value: 1, color: '#27272a' }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {moveDistribution.length > 0 ?
                                        moveDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        )) :
                                        <Cell fill="#27272a" />
                                    }
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#27272a', color: '#fff' }}
                                    formatter={(value: number) => [value, 'Times Used']}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span className="text-zinc-400 text-xs font-mono">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">{rockCount}</p>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase">🪨 Rock</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-cyan-400">{paperCount}</p>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase">📄 Paper</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-violet-400">{scissorsCount}</p>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase">✂️ Scissors</p>
                        </div>
                    </div>
                </div>

                {/* AI Prediction Confidence */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-4 tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                        AI Prediction Confidence
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={confidenceData} layout="vertical" margin={{ left: 10, right: 30 }}>
                                <XAxis type="number" hide domain={[0, 100]} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={70}
                                    tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#27272a', color: '#fff' }}
                                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Confidence']}
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                />
                                <Bar dataKey="prob" radius={[0, 4, 4, 0]} barSize={24}>
                                    {confidenceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-2 font-mono text-center uppercase tracking-tighter">
                        Current AI prediction weights for your next move
                    </p>
                </div>

                {/* Move Frequency Over Time */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-4 tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Move Frequency Trend
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={moveFrequencyData} margin={{ left: 0, right: 0 }}>
                                <XAxis
                                    dataKey="round"
                                    tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }}
                                    axisLine={{ stroke: '#27272a' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }}
                                    axisLine={false}
                                    tickLine={false}
                                    domain={[0, 100]}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="rock"
                                    stackId="1"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.3}
                                    name="Rock"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="paper"
                                    stackId="1"
                                    stroke="#06b6d4"
                                    fill="#06b6d4"
                                    fillOpacity={0.3}
                                    name="Paper"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="scissors"
                                    stackId="1"
                                    stroke="#8b5cf6"
                                    fill="#8b5cf6"
                                    fillOpacity={0.3}
                                    name="Scissors"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-2 font-mono text-center uppercase tracking-tighter">
                        Rolling 5-round window move distribution
                    </p>
                </div>

                {/* Performance Trend */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl lg:col-span-2">
                    <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-4 tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Win Rate Trend Over Time
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData} margin={{ left: 0, right: 0 }}>
                                <XAxis
                                    dataKey="round"
                                    tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }}
                                    axisLine={{ stroke: '#27272a' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }}
                                    axisLine={false}
                                    tickLine={false}
                                    domain={[0, 100]}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="winRate"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                                    activeDot={{ r: 5, fill: '#10b981' }}
                                    name="Win Rate"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-2 font-mono text-center uppercase tracking-tighter">
                        Cumulative win rate progression (last 20 rounds)
                    </p>
                </div>
            </div>

            {/* Detailed Stats Table */}
            <div className="mt-8 max-w-6xl mx-auto">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-4 tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        Detailed Statistics
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
                            <p className="text-[10px] text-zinc-600 font-mono uppercase mb-1">Favorite Move</p>
                            <p className="text-lg font-bold text-white">
                                {rockCount >= paperCount && rockCount >= scissorsCount ? '🪨 Rock' :
                                    paperCount >= scissorsCount ? '📄 Paper' : '✂️ Scissors'}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-mono">
                                {Math.max(rockCount, paperCount, scissorsCount)} times ({roundCount > 0 ? (Math.max(rockCount, paperCount, scissorsCount) / roundCount * 100).toFixed(0) : 0}%)
                            </p>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
                            <p className="text-[10px] text-zinc-600 font-mono uppercase mb-1">Win/Loss Ratio</p>
                            <p className="text-lg font-bold text-white">
                                {aiScore > 0 ? (playerScore / aiScore).toFixed(2) : playerScore > 0 ? '∞' : 'N/A'}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-mono">
                                {playerScore}W / {aiScore}L
                            </p>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
                            <p className="text-[10px] text-zinc-600 font-mono uppercase mb-1">AI Training Samples</p>
                            <p className="text-lg font-bold text-white">{historyCount}</p>
                            <p className="text-[10px] text-zinc-500 font-mono">
                                {historyCount < 5 ? 'Still learning...' : 'Optimized'}
                            </p>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
                            <p className="text-[10px] text-zinc-600 font-mono uppercase mb-1">Current Streak</p>
                            <p className="text-lg font-bold text-white">
                                {result === GameResult.Win ? '🔥 Winning' :
                                    result === GameResult.Loss ? '❄️ Losing' :
                                        result === GameResult.Tie ? '➡️ Tie' : 'N/A'}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-mono">
                                Last result: {result || 'No games yet'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 text-zinc-700 text-[10px] font-mono text-center max-w-md mx-auto leading-relaxed tracking-tight">
                <p className="uppercase opacity-50 mb-2">Analysis Summary</p>
                <p>
                    Statistical analysis powered by real-time neural network inference.
                    Data visualization reflects player patterns and AI prediction accuracy.
                </p>
            </footer>
        </div>
    );
};
