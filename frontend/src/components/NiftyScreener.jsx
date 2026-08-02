import React, { useState, useEffect } from 'react';
import { BarChart3, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import axios from 'axios';

export default function NiftyScreener({ onSelectTicker }) {
  const [screenerList, setScreenerList] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScreener = async () => {
      try {
        const res = await axios.get('/api/screener');
        if (res.data && res.data.screener) {
          setScreenerList(res.data.screener);
        }
      } catch (err) {
        console.error('Failed to load screener data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScreener();
  }, []);

  const sectors = ['ALL', ...new Set(screenerList.map(s => s.sector))];

  const filteredData = screenerList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase()) || item.symbol.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesSector = sectorFilter === 'ALL' || item.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="cyber-glass rounded-xl p-5 mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-3 border-b border-cyan-500/10">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-display text-white">NIFTY 50 LIVE QUANT SCREENER</h2>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">Real-time technical metrics & AI signals across top Indian constituents</p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter screener..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-[#05070c] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-[#05070c] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-400"
          >
            {sectors.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Screener Table */}
      {loading ? (
        <div className="text-center py-12 font-mono text-xs text-amber-300 animate-pulse">
          LOADING NIFTY 50 METRIC ENGINE...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-bold">COMPANY</th>
                <th className="pb-3 font-bold">SECTOR</th>
                <th className="pb-3 font-bold text-right">PRICE (₹)</th>
                <th className="pb-3 font-bold text-right">CHANGE (%)</th>
                <th className="pb-3 font-bold text-center">RSI (14)</th>
                <th className="pb-3 font-bold text-center">SIGNAL</th>
                <th className="pb-3 font-bold text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredData.map((stock) => {
                const isBull = stock.percent_change >= 0;
                return (
                  <tr key={stock.symbol} className="hover:bg-cyan-500/5 transition-all">
                    <td className="py-3">
                      <div className="font-bold text-white">{stock.name}</div>
                      <div className="text-[10px] text-slate-500">{stock.symbol}</div>
                    </td>
                    <td className="py-3 text-slate-400">{stock.sector}</td>
                    <td className="py-3 text-right font-bold text-white">₹{stock.price}</td>
                    <td className={`py-3 text-right font-bold ${isBull ? 'text-cyber-green' : 'text-cyber-red'}`}>
                      {isBull ? '+' : ''}{stock.percent_change}%
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        stock.rsi > 70 ? 'bg-red-500/20 text-red-300' : stock.rsi < 30 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {stock.rsi}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        stock.signal === 'BULLISH' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {stock.signal}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => onSelectTicker(stock.symbol)}
                        className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold transition-all"
                      >
                        ANALYZE
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
