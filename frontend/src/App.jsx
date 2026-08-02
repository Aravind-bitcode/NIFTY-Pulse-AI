import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import LiveMarquee from './components/LiveMarquee';
import StockChart from './components/StockChart';
import TechnicalPanels from './components/TechnicalPanels';
import PredictionSandbox from './components/PredictionSandbox';
import BacktestSandbox from './components/BacktestSandbox';
import NiftyScreener from './components/NiftyScreener';
import TechnicalReport from './components/TechnicalReport';
import DatasetPlayground from './components/DatasetPlayground';

export default function App() {
  const [selectedTicker, setSelectedTicker] = useState('^NSEI');
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, predictions, playground, backtesting, screener, report
  const [timeframe, setTimeframe] = useState('1Y');

  // API Data State
  const [stockInfo, setStockInfo] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [indicators, setIndicators] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [backtestData, setBacktestData] = useState(null);

  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [loadingBacktest, setLoadingBacktest] = useState(false);

  // Fetch core stock history & info
  useEffect(() => {
    const loadStock = async () => {
      setLoadingChart(true);
      try {
        const encoded = encodeURIComponent(selectedTicker);
        const [stockRes, indRes] = await Promise.all([
          axios.get(`/api/stock/${encoded}?period=2y`),
          axios.get(`/api/stock/${encoded}/indicators?period=2y`)
        ]);

        if (stockRes.data) {
          setStockInfo(stockRes.data.info);
          setHistoryData(stockRes.data.history || []);
        }

        if (indRes.data) {
          setIndicators(indRes.data.indicators);
        }
      } catch (err) {
        console.error('Failed to fetch stock data:', err);
      } finally {
        setLoadingChart(false);
      }
    };

    loadStock();
  }, [selectedTicker]);

  // Run Prediction Model
  const handleRunPrediction = async (model = 'lstm', horizon = 30) => {
    setLoadingPredict(true);
    try {
      const encoded = encodeURIComponent(selectedTicker);
      const res = await axios.get(`/api/predict/${encoded}?model=${model}&horizon=${horizon}`);
      if (res.data) {
        setPredictionData(res.data);
      }
    } catch (err) {
      console.error('Failed to run prediction:', err);
    } finally {
      setLoadingPredict(false);
    }
  };

  // Run Backtest
  const handleRunBacktest = async (fast = 20, slow = 50, capital = 100000) => {
    setLoadingBacktest(true);
    try {
      const encoded = encodeURIComponent(selectedTicker);
      const res = await axios.get(`/api/backtest/${encoded}?fast=${fast}&slow=${slow}&capital=${capital}`);
      if (res.data) {
        setBacktestData(res.data);
      }
    } catch (err) {
      console.error('Failed to run backtest:', err);
    } finally {
      setLoadingBacktest(false);
    }
  };

  useEffect(() => {
    handleRunPrediction('lstm', 30);
    handleRunBacktest(20, 50, 100000);
  }, [selectedTicker]);

  return (
    <div className="min-h-screen flex flex-col bg-[#05070c] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Header & Live Ticker */}
      <Header
        selectedTicker={selectedTicker}
        onSelectTicker={setSelectedTicker}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <LiveMarquee />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Tab 1: Live Analytics */}
        {activeTab === 'analytics' && (
          <>
            <StockChart
              historyData={historyData}
              predictionData={predictionData}
              stockInfo={stockInfo}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
            <TechnicalPanels stockInfo={stockInfo} indicators={indicators} />
          </>
        )}

        {/* Tab 2: AI Predictions */}
        {activeTab === 'predictions' && (
          <>
            <PredictionSandbox
              symbol={selectedTicker}
              predictionData={predictionData}
              onRunPrediction={handleRunPrediction}
              loading={loadingPredict}
            />
            <StockChart
              historyData={historyData}
              predictionData={predictionData}
              stockInfo={stockInfo}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
          </>
        )}

        {/* Tab 3: Dataset & Try Model Playground */}
        {activeTab === 'playground' && (
          <DatasetPlayground
            selectedTicker={selectedTicker}
            stockInfo={stockInfo}
          />
        )}

        {/* Tab 4: Quantitative Backtesting */}
        {activeTab === 'backtesting' && (
          <BacktestSandbox
            symbol={selectedTicker}
            backtestData={backtestData}
            onRunBacktest={handleRunBacktest}
            loading={loadingBacktest}
          />
        )}

        {/* Tab 5: NIFTY 50 Screener */}
        {activeTab === 'screener' && (
          <NiftyScreener
            onSelectTicker={(sym) => {
              setSelectedTicker(sym);
              setActiveTab('analytics');
            }}
          />
        )}

        {/* Tab 6: Executive Report */}
        {activeTab === 'report' && (
          <TechnicalReport
            stockInfo={stockInfo}
            indicators={indicators}
            predictionData={predictionData}
          />
        )}

      </main>

      {/* Custom Recruiter Branding Footer */}
      <footer className="cyber-glass border-t border-cyan-500/20 py-4 px-6 text-center font-mono text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold tracking-wide">⚡ Engineered by Aravind 🚀</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-bold">NIFTY-Pulse AI v2.0</span>
          </div>

          <div className="text-slate-400 text-[11px]">
            PyTorch LSTM Neural Net • XGBoost • Prophet • Yahoo Finance API • React 18 & Chart.js
          </div>
        </div>
      </footer>

    </div>
  );
}
