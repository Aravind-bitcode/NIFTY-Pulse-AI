import React, { useState } from 'react';
import { Sliders, TrendingUp, ShieldAlert, Award, Play, RotateCcw } from 'lucide-react';
import { Line } from 'react-chartjs-2';

export default function BacktestSandbox({ symbol, backtestData, onRunBacktest, loading }) {
  const [fastPeriod, setFastPeriod] = useState(20);
  const [slowPeriod, setSlowPeriod] = useState(50);
  const [initialCapital, setInitialCapital] = useState(100000);

  const handleRun = () => {
    onRunBacktest(fastPeriod, slowPeriod, initialCapital);
  };

  const bt = backtestData?.backtest || {
    strategy_name: 'MA Crossover (20/50)',
    initial_capital: 100000,
    final_capital: 134250,
    total_return_pct: 34.25,
    benchmark_return_pct: 18.50,
    sharpe_ratio: 1.85,
    max_drawdown_pct: -8.40,
    win_rate_pct: 62.5,
    total_trades: 12,
    equity_curve: [
      { date: '2023-01-01', equity: 100000, benchmark: 100000 },
      { date: '2023-04-01', equity: 108000, benchmark: 104000 },
      { date: '2023-07-01', equity: 115000, benchmark: 109000 },
      { date: '2023-10-01', equity: 122000, benchmark: 112000 },
      { date: '2024-01-01', equity: 134250, benchmark: 118500 }
    ]
  };

  // Equity curve chart configuration
  const curveLabels = bt.equity_curve ? bt.equity_curve.map(e => e.date) : [];
  const strategyData = bt.equity_curve ? bt.equity_curve.map(e => e.equity) : [];
  const benchmarkData = bt.equity_curve ? bt.equity_curve.map(e => e.benchmark) : [];

  const chartData = {
    labels: curveLabels,
    datasets: [
      {
        label: 'Strategy Portfolio (₹)',
        data: strategyData,
        borderColor: '#00ff66',
        backgroundColor: 'rgba(0, 255, 102, 0.1)',
        fill: true,
        borderWidth: 2,
        pointRadius: 0
      },
      {
        label: 'Buy & Hold Benchmark (₹)',
        data: benchmarkData,
        borderColor: '#94a3b8',
        borderDash: [4, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } } }
    }
  };

  return (
    <div className="cyber-glass rounded-xl p-5 mb-6 border-l-4 border-l-emerald-400">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-3 border-b border-cyan-500/10">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold font-display text-white">QUANT STRATEGY BACKTESTING SUITE</h2>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Test Moving Average Crossover strategies on 2-Year historical price series for <span className="text-emerald-300 font-bold">{symbol}</span>
          </p>
        </div>

        <button
          onClick={handleRun}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-xs font-mono font-bold shadow-neon-green transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>RUN BACKTEST</span>
        </button>
      </div>

      {/* Strategy Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">FAST MOVING AVG (DAYS): <span className="text-emerald-400 font-bold">{fastPeriod}</span></label>
          <input
            type="range"
            min="5"
            max="50"
            value={fastPeriod}
            onChange={(e) => setFastPeriod(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">SLOW MOVING AVG (DAYS): <span className="text-cyan-400 font-bold">{slowPeriod}</span></label>
          <input
            type="range"
            min="20"
            max="200"
            value={slowPeriod}
            onChange={(e) => setSlowPeriod(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">INITIAL CAPITAL: <span className="text-purple-400 font-bold">₹{initialCapital.toLocaleString()}</span></label>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            value={initialCapital}
            onChange={(e) => setInitialCapital(Number(e.target.value))}
            className="w-full accent-purple-400"
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6 font-mono text-center">
        <div className="p-3 rounded-lg bg-[#05070c] border border-emerald-500/30">
          <div className="text-[10px] text-slate-400">TOTAL RETURN</div>
          <div className="text-lg font-bold text-cyber-green text-glow-green">+{bt.total_return_pct}%</div>
        </div>

        <div className="p-3 rounded-lg bg-[#05070c] border border-slate-800">
          <div className="text-[10px] text-slate-400">BENCHMARK</div>
          <div className="text-lg font-bold text-slate-300">+{bt.benchmark_return_pct}%</div>
        </div>

        <div className="p-3 rounded-lg bg-[#05070c] border border-purple-500/30">
          <div className="text-[10px] text-slate-400">SHARPE RATIO</div>
          <div className="text-lg font-bold text-purple-300">{bt.sharpe_ratio}</div>
        </div>

        <div className="p-3 rounded-lg bg-[#05070c] border border-red-500/30">
          <div className="text-[10px] text-slate-400">MAX DRAWDOWN</div>
          <div className="text-lg font-bold text-cyber-red">{bt.max_drawdown_pct}%</div>
        </div>

        <div className="p-3 rounded-lg bg-[#05070c] border border-amber-500/30">
          <div className="text-[10px] text-slate-400">WIN RATE</div>
          <div className="text-lg font-bold text-amber-300">{bt.win_rate_pct}%</div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>

    </div>
  );
}
