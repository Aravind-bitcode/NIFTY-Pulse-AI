import React, { useState, useEffect } from 'react';
import { Activity, Search, ShieldCheck, Cpu, Sliders, BarChart3, LineChart, FileText, Database } from 'lucide-react';

const QUICK_TICKERS = [
  { symbol: "^NSEI", name: "NIFTY 50" },
  { symbol: "^NSEBANK", name: "NIFTY BANK" },
  { symbol: "RELIANCE.NS", name: "RELIANCE" },
  { symbol: "TCS.NS", name: "TCS" },
  { symbol: "HDFCBANK.NS", name: "HDFC BANK" },
  { symbol: "INFY.NS", name: "INFOSYS" },
  { symbol: "ICICIBANK.NS", name: "ICICI BANK" },
  { symbol: "BHARTIARTL.NS", name: "BHARTI AIRTEL" },
  { symbol: "TATAMOTORS.NS", name: "TATA MOTORS" },
  { symbol: "SBIN.NS", name: "SBI" }
];

export default function Header({ selectedTicker, onSelectTicker, activeTab, setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }) + ' IST');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredTickers = QUICK_TICKERS.filter(t => 
    t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (sym) => {
    onSelectTicker(sym);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <header className="cyber-glass sticky top-0 z-50 px-4 py-3 border-b border-cyan-500/20 bg-[#05070c]/90">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-neon-cyan">
            <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-extrabold tracking-wider text-white">
                NIFTY<span className="text-cyan-400 text-glow-cyan">-PULSE</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                v2.0 AI
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">QUANTITATIVE MARKET TERMINAL</p>
          </div>
        </div>

        {/* Ticker Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticker (e.g. TCS, RELIANCE, NIFTY)..."
              value={searchTerm}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0b101d] border border-cyan-500/30 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
            />
          </div>

          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-[#0b101d] border border-cyan-500/40 rounded-lg shadow-cyber-card z-50 max-h-60 overflow-y-auto">
              {filteredTickers.map((t) => (
                <button
                  key={t.symbol}
                  onClick={() => handleSelect(t.symbol)}
                  className="w-full px-3 py-2 text-left text-xs font-mono hover:bg-cyan-500/20 hover:text-cyan-300 flex justify-between items-center transition-all border-b border-slate-800/60"
                >
                  <span className="font-bold text-white">{t.name}</span>
                  <span className="text-slate-400 text-[11px]">{t.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#090d16] p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'analytics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-neon-cyan font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>ANALYTICS</span>
          </button>

          <button
            onClick={() => setActiveTab('predictions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'predictions'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-neon-violet font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI PREDICT</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'playground'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-neon-violet font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>DATASET & TRY MODEL</span>
          </button>

          <button
            onClick={() => setActiveTab('backtesting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'backtesting'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-neon-green font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>BACKTEST</span>
          </button>

          <button
            onClick={() => setActiveTab('screener')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'screener'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>SCREENER</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'report'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>REPORT</span>
          </button>
        </div>

        {/* Live System Time */}
        <div className="hidden xl:flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE FEED</span>
          </div>
          <span className="text-xs font-mono text-cyan-400/80">{timeStr}</span>
        </div>

      </div>
    </header>
  );
}
