import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function LiveMarquee() {
  const [marqueeData, setMarqueeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarquee = async () => {
      try {
        const res = await axios.get('/api/marquee');
        if (res.data && res.data.marquee) {
          setMarqueeData(res.data.marquee);
        }
      } catch (err) {
        console.error('Failed to load live marquee tickers', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarquee();
    const interval = setInterval(fetchMarquee, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const items = marqueeData.length > 0 ? [...marqueeData, ...marqueeData] : [];

  return (
    <div className="w-full bg-[#04060a] border-b border-cyan-500/10 py-1.5 overflow-hidden whitespace-nowrap">
      {loading && marqueeData.length === 0 ? (
        <div className="text-center font-mono text-[11px] text-cyan-400/70 animate-pulse">
          CONNECTING TO LIVE YAHOO FINANCE MARKET TICKER...
        </div>
      ) : (
        <div className="inline-flex animate-marquee gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-300 font-bold">{item.symbol}</span>
              <span className="text-white">₹{item.price}</span>
              <span className={`flex items-center gap-0.5 font-semibold ${item.bullish ? 'text-cyber-green text-glow-green' : 'text-cyber-red text-glow-red'}`}>
                {item.bullish ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {item.pct}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
