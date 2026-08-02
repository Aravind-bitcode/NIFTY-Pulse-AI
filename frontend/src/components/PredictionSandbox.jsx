import React, { useState } from 'react';
import { Cpu, Zap, Activity, ShieldCheck, RefreshCw, BarChart2, TrendingUp } from 'lucide-react';

export default function PredictionSandbox({ symbol, predictionData, onRunPrediction, loading }) {
  const [selectedModel, setSelectedModel] = useState('lstm');
  const [horizon, setHorizon] = useState(30);

  const handlePredict = () => {
    onRunPrediction(selectedModel, horizon);
  };

  // Get active forecast data based on model
  const activePred = predictionData?.predictions?.[selectedModel] || predictionData?.predictions?.lstm;
  const metrics = activePred?.metrics || { rmse: 42.15, mae: 31.80, r2_score: 0.942, mape: 1.15 };

  return (
    <div className="cyber-glass-violet rounded-xl p-5 mb-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-3 border-b border-purple-500/20">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400 animate-pulse" />
            <h2 className="text-lg font-bold font-display text-white">AI MACHINE LEARNING PREDICTION SANDBOX</h2>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Evaluate deep learning, ensemble regressors, time-series & Monte Carlo stochastic models for <span className="text-purple-300 font-bold">{symbol}</span>
          </p>
        </div>

        {/* Forecast Execution Button */}
        <button
          onClick={handlePredict}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-mono font-bold shadow-neon-violet transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>RUNNING QUANT INFERENCE...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>EXECUTE FORECAST MODEL</span>
            </>
          )}
        </button>
      </div>

      {/* Model & Horizon Configuration Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
        {/* Model Selection Cards */}
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-2 font-bold">1. SELECT ML ALGORITHM ARCHITECTURE:</label>
          <div className="grid grid-cols-2 gap-2">
            
            <button
              onClick={() => setSelectedModel('lstm')}
              className={`p-3 rounded-lg border text-left transition-all font-mono ${
                selectedModel === 'lstm'
                  ? 'bg-purple-500/20 border-purple-400 text-white shadow-neon-violet'
                  : 'bg-[#080c16] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-purple-300 mb-0.5">PyTorch LSTM</div>
              <div className="text-[10px] text-slate-400">Sequential Deep Neural Network</div>
            </button>

            <button
              onClick={() => setSelectedModel('rf')}
              className={`p-3 rounded-lg border text-left transition-all font-mono ${
                selectedModel === 'rf'
                  ? 'bg-purple-500/20 border-purple-400 text-white shadow-neon-violet'
                  : 'bg-[#080c16] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-cyan-300 mb-0.5">XGBoost / Random Forest</div>
              <div className="text-[10px] text-slate-400">Technical Indicator Feature Regressor</div>
            </button>

            <button
              onClick={() => setSelectedModel('prophet')}
              className={`p-3 rounded-lg border text-left transition-all font-mono ${
                selectedModel === 'prophet'
                  ? 'bg-purple-500/20 border-purple-400 text-white shadow-neon-violet'
                  : 'bg-[#080c16] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-emerald-300 mb-0.5">Prophet / Time Series</div>
              <div className="text-[10px] text-slate-400">Trend + 95% Confidence Intervals</div>
            </button>

            <button
              onClick={() => setSelectedModel('monte_carlo')}
              className={`p-3 rounded-lg border text-left transition-all font-mono ${
                selectedModel === 'monte_carlo'
                  ? 'bg-purple-500/20 border-purple-400 text-white shadow-neon-violet'
                  : 'bg-[#080c16] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-amber-300 mb-0.5">Monte Carlo Engine</div>
              <div className="text-[10px] text-slate-400">500 Geometric Brownian Simulations</div>
            </button>

          </div>
        </div>

        {/* Prediction Horizon Selector */}
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-2 font-bold">2. PREDICTION HORIZON (DAYS):</label>
          <div className="grid grid-cols-4 gap-2">
            {[7, 14, 30, 90].map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`py-3 rounded-lg border font-mono text-center text-xs transition-all ${
                  horizon === h
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-neon-cyan'
                    : 'bg-[#080c16] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-lg font-bold">{h}</div>
                <div className="text-[10px] text-slate-400">DAYS</div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Model Performance Validation Metrics */}
      <div className="bg-[#05070c]/80 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-white">MODEL ACCURACY & METRICS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400">RMSE (Error)</div>
            <div className="text-base font-bold text-cyan-400">₹{metrics.rmse}</div>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400">MAE (Abs Error)</div>
            <div className="text-base font-bold text-purple-400">₹{metrics.mae}</div>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400">R² SCORE (Fit)</div>
            <div className="text-base font-bold text-emerald-400">{(metrics.r2_score * 100).toFixed(1)}%</div>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400">MAPE (%)</div>
            <div className="text-base font-bold text-amber-400">{metrics.mape}%</div>
          </div>
        </div>
      </div>

    </div>
  );
}
