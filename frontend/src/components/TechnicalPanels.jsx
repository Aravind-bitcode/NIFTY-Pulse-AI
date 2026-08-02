import React, { useState } from 'react';
import { Activity, Gauge, TrendingUp, TrendingDown, ShieldAlert, Zap, Compass, Target, HelpCircle } from 'lucide-react';

export default function TechnicalPanels({ stockInfo, indicators }) {
  const [activeInfo, setActiveInfo] = useState(null);

  if (!stockInfo || !indicators) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="cyber-glass rounded-xl p-4 h-32 animate-pulse bg-slate-900/40"></div>
        ))}
      </div>
    );
  }

  const { price, change, percent_change, high_52w, low_52w, volume } = stockInfo;
  const isPositive = change >= 0;
  const { rsi, macd, macd_signal, macd_histogram, score, sentiment, pivot_points, vwap, atr, sma20, sma50 } = indicators;

  return (
    <div className="space-y-6 mb-6">
      
      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Live Quote */}
        <div className="cyber-glass rounded-xl p-4 border-l-4 border-l-cyan-400">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-slate-400">LIVE SPOT PRICE</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">REALTIME</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">₹{price}</div>
          <div className={`flex items-center gap-1 text-xs font-mono font-bold ${isPositive ? 'text-cyber-green text-glow-green' : 'text-cyber-red text-glow-red'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isPositive ? '+' : ''}{change} ({isPositive ? '+' : ''}{percent_change}%)</span>
          </div>
        </div>

        {/* Card 2: AI Technical Sentiment Meter */}
        <div className="cyber-glass rounded-xl p-4 border-l-4 border-l-purple-500 relative">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono text-slate-400">AI SENTIMENT METER</span>
              <button 
                onMouseEnter={() => setActiveInfo('sentiment')} 
                onMouseLeave={() => setActiveInfo(null)}
                className="text-purple-400 hover:text-purple-300"
              >
                <HelpCircle className="w-3 h-3" />
              </button>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
              {score}/100
            </span>
          </div>

          {activeInfo === 'sentiment' && (
            <div className="absolute left-0 top-full mt-2 w-64 p-3 rounded-lg bg-[#0b101d] border border-purple-400/40 shadow-cyber-card z-50 text-[11px] text-slate-200 font-sans backdrop-blur-md">
              <div className="font-bold text-purple-300 font-mono mb-1">AI Composite Sentiment (0-100)</div>
              <p className="leading-relaxed text-slate-300">
                Quantitative composite score calculated by combining RSI momentum, MACD crossover signals, EMA 9/21 alignment, and SMA 20/50 price position.
              </p>
            </div>
          )}

          <div className="text-lg font-bold font-display tracking-wide text-purple-300 text-glow-violet mb-2">
            {sentiment}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-purple-500/30">
            <div
              className="bg-gradient-to-r from-purple-600 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: RSI Indicator */}
        <div className="cyber-glass rounded-xl p-4 border-l-4 border-l-amber-400 relative">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono text-slate-400">RSI (14 PERIOD)</span>
              <button 
                onMouseEnter={() => setActiveInfo('rsi')} 
                onMouseLeave={() => setActiveInfo(null)}
                className="text-amber-400 hover:text-amber-300"
              >
                <HelpCircle className="w-3 h-3" />
              </button>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
              rsi > 70 ? 'bg-red-500/20 text-red-300' : rsi < 30 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
            }`}>
              {rsi > 70 ? 'OVERBOUGHT' : rsi < 30 ? 'OVERSOLD' : 'NEUTRAL ZONE'}
            </span>
          </div>

          {activeInfo === 'rsi' && (
            <div className="absolute left-0 top-full mt-2 w-64 p-3 rounded-lg bg-[#0b101d] border border-amber-400/40 shadow-cyber-card z-50 text-[11px] text-slate-200 font-sans backdrop-blur-md">
              <div className="font-bold text-amber-300 font-mono mb-1">RSI (Relative Strength Index)</div>
              <p className="leading-relaxed text-slate-300">
                Measures price change velocity (0-100). Values above 70 indicate Overbought conditions (potential pullback), while values below 30 indicate Oversold conditions (potential rebound).
              </p>
            </div>
          )}

          <div className="text-2xl font-bold font-mono text-white mb-1">{rsi}</div>
          <div className="text-xs font-mono text-slate-400">
            Signal: <span className="text-slate-200">{rsi > 55 ? 'Bullish Momentum' : rsi < 45 ? 'Bearish Momentum' : 'Consolidating'}</span>
          </div>
        </div>

        {/* Card 4: MACD */}
        <div className="cyber-glass rounded-xl p-4 border-l-4 border-l-emerald-400 relative">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono text-slate-400">MACD (12, 26, 9)</span>
              <button 
                onMouseEnter={() => setActiveInfo('macd')} 
                onMouseLeave={() => setActiveInfo(null)}
                className="text-emerald-400 hover:text-emerald-300"
              >
                <HelpCircle className="w-3 h-3" />
              </button>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${macd_histogram >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
              {macd_histogram >= 0 ? 'BULLISH CROSS' : 'BEARISH CROSS'}
            </span>
          </div>

          {activeInfo === 'macd' && (
            <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-lg bg-[#0b101d] border border-emerald-400/40 shadow-cyber-card z-50 text-[11px] text-slate-200 font-sans backdrop-blur-md">
              <div className="font-bold text-emerald-300 font-mono mb-1">MACD (Moving Avg Convergence Divergence)</div>
              <p className="leading-relaxed text-slate-300">
                Tracks relationship between 12-EMA and 26-EMA. A positive histogram indicates bullish buying pressure; negative indicates bearish selling pressure.
              </p>
            </div>
          )}

          <div className="text-xl font-bold font-mono text-white mb-1">
            {macd_histogram > 0 ? '+' : ''}{macd_histogram} <span className="text-xs text-slate-400 font-normal">(Hist)</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Line: <span className="text-cyan-400">{macd}</span> | Signal: <span className="text-purple-400">{macd_signal}</span>
          </div>
        </div>

      </div>

      {/* Pivot Points & Quantitative Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Pivot Points Table */}
        <div className="cyber-glass rounded-xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-cyan-500/10">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold font-display text-white">STANDARD PIVOT POINTS & PRICE TARGETS</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">R1-R3: Resistance | S1-S3: Support</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center font-mono text-xs">
            <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
              <div className="text-[10px] text-red-400">R3</div>
              <div className="font-bold text-red-300">₹{pivot_points?.r3}</div>
            </div>
            <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
              <div className="text-[10px] text-red-400">R2</div>
              <div className="font-bold text-red-300">₹{pivot_points?.r2}</div>
            </div>
            <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
              <div className="text-[10px] text-red-400">R1</div>
              <div className="font-bold text-red-300">₹{pivot_points?.r1}</div>
            </div>

            <div className="p-2 rounded bg-purple-500/20 border border-purple-400/40 shadow-neon-violet">
              <div className="text-[10px] text-purple-300 font-bold">PIVOT</div>
              <div className="font-bold text-white">₹{pivot_points?.pivot}</div>
            </div>

            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400">S1</div>
              <div className="font-bold text-emerald-300">₹{pivot_points?.s1}</div>
            </div>
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400">S2</div>
              <div className="font-bold text-emerald-300">₹{pivot_points?.s2}</div>
            </div>
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400">S3</div>
              <div className="font-bold text-emerald-300">₹{pivot_points?.s3}</div>
            </div>
          </div>
        </div>

        {/* VWAP & ATR Metrics */}
        <div className="cyber-glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-cyan-500/10">
            <Compass className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold font-display text-white">VOLATILITY & VWAP METRICS</h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">VWAP (Volume Weighted Avg):</span>
              <span className="font-bold text-cyan-300">₹{vwap}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">ATR (Average Volatility):</span>
              <span className="font-bold text-amber-300">₹{atr}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">20-Day SMA:</span>
              <span className="font-bold text-slate-200">₹{sma20}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">50-Day SMA:</span>
              <span className="font-bold text-slate-200">₹{sma50}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
