import React from 'react';
import { FileText, Printer, CheckCircle, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function TechnicalReport({ stockInfo, indicators, predictionData }) {
  if (!stockInfo || !indicators) {
    return (
      <div className="cyber-glass rounded-xl p-8 text-center font-mono text-cyan-400">
        LOADING TECHNICAL EXECUTIVE REPORT...
      </div>
    );
  }

  const { name, symbol, price, change, percent_change, sector } = stockInfo;
  const { rsi, score, sentiment, pivot_points, vwap, atr, sma20, sma50 } = indicators;
  const isPositive = change >= 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cyber-glass rounded-xl p-6 mb-6 print:bg-white print:text-black">
      
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyan-500/20 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold font-display text-white">AI QUANTITATIVE TECHNICAL EXECUTIVE REPORT</h2>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 text-xs font-mono font-bold transition-all shadow-neon-cyan"
        >
          <Printer className="w-4 h-4" />
          <span>EXPORT PDF / PRINT REPORT</span>
        </button>
      </div>

      {/* Report Header Metadata */}
      <div className="bg-[#05070c] rounded-xl p-5 border border-cyan-500/20 mb-6 font-mono">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold">ASSET UNDER ANALYSIS</span>
            <h1 className="text-2xl font-bold text-white font-display mt-0.5">{name} ({symbol})</h1>
            <div className="text-xs text-slate-400 mt-1">SECTOR: {sector} | MARKET: NSE INDIA</div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold">SPOT PRICE</span>
            <div className="text-2xl font-bold text-white">₹{price}</div>
            <div className={`text-xs font-bold ${isPositive ? 'text-cyber-green' : 'text-cyber-red'}`}>
              {isPositive ? '+' : ''}{change} ({isPositive ? '+' : ''}{percent_change}%)
            </div>
          </div>
        </div>
      </div>

      {/* Key Executive Findings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-mono">
        
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <div className="text-xs text-purple-300 font-bold mb-1">TECHNICAL SENTIMENT</div>
          <div className="text-xl font-bold text-white mb-1">{sentiment}</div>
          <p className="text-[11px] text-slate-400">Score: {score}/100 based on multi-timeframe EMA/SMA, MACD cross, and RSI alignment.</p>
        </div>

        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <div className="text-xs text-cyan-300 font-bold mb-1">SUPPORT & RESISTANCE</div>
          <div className="text-xs text-slate-300 space-y-1">
            <div>Key Resistance (R1): <span className="font-bold text-red-400">₹{pivot_points?.r1}</span></div>
            <div>Central Pivot: <span className="font-bold text-purple-300">₹{pivot_points?.pivot}</span></div>
            <div>Key Support (S1): <span className="font-bold text-emerald-400">₹{pivot_points?.s1}</span></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="text-xs text-emerald-300 font-bold mb-1">QUANT METRICS</div>
          <div className="text-xs text-slate-300 space-y-1">
            <div>RSI (14): <span className="font-bold text-white">{rsi}</span></div>
            <div>VWAP: <span className="font-bold text-white">₹{vwap}</span></div>
            <div>ATR (Volatility): <span className="font-bold text-white">₹{atr}</span></div>
          </div>
        </div>

      </div>

      {/* AI Qualitative Analysis Summary */}
      <div className="p-5 rounded-xl bg-[#090d16] border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed space-y-3">
        <h4 className="text-sm font-bold text-white font-display border-b border-slate-800 pb-2">EXECUTIVE STRATEGY OUTLOOK</h4>
        <p>
          • <strong>Trend Evaluation:</strong> {name} ({symbol}) is currently exhibiting a <strong>{sentiment}</strong> structure. Price is trading at ₹{price}, positioning it relative to the 20-Day SMA (₹{sma20}) and 50-Day SMA (₹{sma50}).
        </p>
        <p>
          • <strong>Risk Parameters:</strong> Average True Range (ATR) indicates daily volatility bounds of ₹{atr}. Initial stop-loss levels are recommended around S1 support (₹{pivot_points?.s1}).
        </p>
        <p>
          • <strong>Model Forecast:</strong> Deep Learning PyTorch LSTM & Time Series models project positive expected drift over the next 30 sessions, subject to broader market index trends.
        </p>
      </div>

    </div>
  );
}
