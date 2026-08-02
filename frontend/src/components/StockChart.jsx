import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Info, HelpCircle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StockChart({ historyData, predictionData, stockInfo, timeframe, setTimeframe }) {
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (!historyData || historyData.length === 0) {
    return (
      <div className="cyber-glass rounded-xl p-8 text-center font-mono text-cyan-400">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>INITIALIZING HIGH-SPEED MARKET FEED...</p>
      </div>
    );
  }

  let daysToShow = 365;
  if (timeframe === '1M') daysToShow = 30;
  if (timeframe === '3M') daysToShow = 90;
  if (timeframe === '6M') daysToShow = 180;
  if (timeframe === '2Y') daysToShow = 730;

  const slicedHistory = historyData.slice(-daysToShow);
  const labels = slicedHistory.map(d => d.date);
  const closePrices = slicedHistory.map(d => d.close);

  const sma20 = closePrices.map((val, idx, arr) => {
    if (idx < 19) return null;
    const slice = arr.slice(idx - 19, idx + 1);
    return slice.reduce((a, b) => a + b, 0) / 20;
  });

  const sma50 = closePrices.map((val, idx, arr) => {
    if (idx < 49) return null;
    const slice = arr.slice(idx - 49, idx + 1);
    return slice.reduce((a, b) => a + b, 0) / 50;
  });

  let forecastLabels = [];
  let forecastPrices = [];
  let forecastLower = [];
  let forecastUpper = [];

  if (predictionData && predictionData.forecast) {
    forecastLabels = predictionData.forecast.map(f => f.date);
    forecastPrices = predictionData.forecast.map(f => f.predicted);
    forecastLower = predictionData.forecast.map(f => f.lower || f.predicted * 0.97);
    forecastUpper = predictionData.forecast.map(f => f.upper || f.predicted * 1.03);
  }

  const combinedLabels = [...labels, ...forecastLabels];
  const historicalPadded = [...closePrices, ...Array(forecastLabels.length).fill(null)];
  
  const lastHistPrice = closePrices[closePrices.length - 1];
  const forecastPadded = [
    ...Array(closePrices.length - 1).fill(null),
    lastHistPrice,
    ...forecastPrices
  ];

  const forecastUpperPadded = [
    ...Array(closePrices.length - 1).fill(null),
    lastHistPrice,
    ...forecastUpper
  ];

  const forecastLowerPadded = [
    ...Array(closePrices.length - 1).fill(null),
    lastHistPrice,
    ...forecastLower
  ];

  const datasets = [
    {
      label: 'Historical Close (₹)',
      data: historicalPadded,
      borderColor: '#00f0ff',
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return null;
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
        return gradient;
      },
      fill: true,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.1
    }
  ];

  if (showSMA20) {
    datasets.push({
      label: 'SMA 20 (20-Day Simple Moving Avg)',
      data: [...sma20, ...Array(forecastLabels.length).fill(null)],
      borderColor: '#a855f7',
      borderWidth: 1.5,
      pointRadius: 0,
      borderDash: [4, 4]
    });
  }

  if (showSMA50) {
    datasets.push({
      label: 'SMA 50 (50-Day Simple Moving Avg)',
      data: [...sma50, ...Array(forecastLabels.length).fill(null)],
      borderColor: '#ffb703',
      borderWidth: 1.5,
      pointRadius: 0
    });
  }

  if (forecastPrices.length > 0) {
    datasets.push({
      label: 'AI Model Forecast (₹)',
      data: forecastPadded,
      borderColor: '#ff007f',
      borderWidth: 2.5,
      pointRadius: 2,
      pointBackgroundColor: '#ff007f',
      tension: 0.2
    });

    datasets.push({
      label: '95% Upper Bound',
      data: forecastUpperPadded,
      borderColor: 'rgba(255, 0, 127, 0.3)',
      borderWidth: 1,
      pointRadius: 0,
      fill: '+1',
      backgroundColor: 'rgba(255, 0, 127, 0.1)'
    });

    datasets.push({
      label: '95% Lower Bound',
      data: forecastLowerPadded,
      borderColor: 'rgba(255, 0, 127, 0.3)',
      borderWidth: 1,
      pointRadius: 0,
      fill: false
    });
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 11 },
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#0b101d',
        borderColor: '#00f0ff',
        borderWidth: 1,
        titleFont: { family: 'JetBrains Mono', size: 12 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        titleColor: '#00f0ff',
        bodyColor: '#ffffff',
        displayColors: true,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: 12 }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
      }
    }
  };

  return (
    <div className="cyber-glass rounded-xl p-5 mb-6 relative">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-cyan-500/10">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-display text-white">{stockInfo?.name || 'STOCK CHART'}</h2>
            <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              {stockInfo?.symbol || '^NSEI'}
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">SECTOR: {stockInfo?.sector || 'Equity Index'}</p>
        </div>

        {/* Timeframe & Overlays */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center bg-[#05070c] rounded-lg p-1 border border-slate-800 text-xs font-mono">
            {['1M', '3M', '6M', '1Y', '2Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded transition-all ${
                  timeframe === tf ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicator toggles with informative popover tooltips */}
          <div className="flex items-center gap-2 text-xs font-mono relative">
            
            {/* SMA 20 Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowSMA20(!showSMA20)}
                onMouseEnter={() => setActiveTooltip('sma20')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`px-2.5 py-1 rounded border flex items-center gap-1 transition-all ${
                  showSMA20 ? 'bg-purple-500/20 border-purple-400/50 text-purple-300 font-bold' : 'border-slate-800 text-slate-500'
                }`}
              >
                <span>SMA 20</span>
                <HelpCircle className="w-3 h-3 text-purple-400/70" />
              </button>

              {activeTooltip === 'sma20' && (
                <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-lg bg-[#0b101d] border border-purple-400/40 shadow-cyber-card z-50 text-[11px] text-slate-200 font-sans backdrop-blur-md">
                  <div className="font-bold text-purple-300 font-mono mb-1">SMA 20 (20-Day Simple Moving Avg)</div>
                  <p className="leading-relaxed text-slate-300">
                    Calculates the average closing price over the last 20 trading sessions. It smooths out day-to-day market noise to highlight short-term momentum and dynamic support levels.
                  </p>
                </div>
              )}
            </div>

            {/* SMA 50 Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowSMA50(!showSMA50)}
                onMouseEnter={() => setActiveTooltip('sma50')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`px-2.5 py-1 rounded border flex items-center gap-1 transition-all ${
                  showSMA50 ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 font-bold' : 'border-slate-800 text-slate-500'
                }`}
              >
                <span>SMA 50</span>
                <HelpCircle className="w-3 h-3 text-amber-400/70" />
              </button>

              {activeTooltip === 'sma50' && (
                <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-lg bg-[#0b101d] border border-amber-400/40 shadow-cyber-card z-50 text-[11px] text-slate-200 font-sans backdrop-blur-md">
                  <div className="font-bold text-amber-300 font-mono mb-1">SMA 50 (50-Day Simple Moving Avg)</div>
                  <p className="leading-relaxed text-slate-300">
                    Calculates the average closing price over the last 50 trading sessions. Institutional investors monitor SMA 50 as a core benchmark for medium-term trend direction and support/resistance zones.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[400px] w-full">
        <Line data={{ labels: combinedLabels, datasets }} options={chartOptions} />
      </div>

    </div>
  );
}
