import numpy as np
import pandas as pd

def backtest_ma_crossover(df: pd.DataFrame, fast_period: int = 20, slow_period: int = 50, initial_capital: float = 100000.0) -> dict:
    """Backtest Moving Average Crossover strategy (Fast vs Slow SMA)."""
    data = df.copy()
    data['Fast_SMA'] = data['Close'].rolling(window=fast_period).mean()
    data['Slow_SMA'] = data['Close'].rolling(window=slow_period).mean()
    data = data.dropna()
    
    # Signal generation
    data['Signal'] = 0.0
    data['Signal'] = np.where(data['Fast_SMA'] > data['Slow_SMA'], 1.0, 0.0)
    data['Position'] = data['Signal'].diff()
    
    # Portfolio simulation
    capital = initial_capital
    position_shares = 0
    trade_log = []
    equity_curve = []
    
    for i in range(len(data)):
        date_str = data.index[i].strftime("%Y-%m-%d")
        close_price = float(data['Close'].iloc[i])
        pos_change = float(data['Position'].iloc[i])
        
        # Buy Signal
        if pos_change == 1.0 and position_shares == 0:
            position_shares = capital / close_price
            capital = 0.0
            trade_log.append({"date": date_str, "type": "BUY", "price": round(close_price, 2), "shares": round(position_shares, 2)})
            
        # Sell Signal
        elif pos_change == -1.0 and position_shares > 0:
            capital = position_shares * close_price
            position_shares = 0
            trade_log.append({"date": date_str, "type": "SELL", "price": round(close_price, 2), "portfolio": round(capital, 2)})
            
        current_val = capital if position_shares == 0 else position_shares * close_price
        equity_curve.append({"date": date_str, "equity": round(current_val, 2), "benchmark": round(initial_capital * (close_price / data['Close'].iloc[0]), 2)})
        
    final_val = equity_curve[-1]["equity"] if equity_curve else initial_capital
    total_return = ((final_val - initial_capital) / initial_capital) * 100
    benchmark_return = ((equity_curve[-1]["benchmark"] - initial_capital) / initial_capital) * 100 if equity_curve else 0.0
    
    # Calculate Sharpe Ratio & Max Drawdown
    equity_series = pd.Series([x["equity"] for x in equity_curve])
    pct_returns = equity_series.pct_change().dropna()
    sharpe = float((pct_returns.mean() / (pct_returns.std() + 1e-9)) * np.sqrt(252)) if len(pct_returns) > 0 else 0.0
    
    cum_max = equity_series.cummax()
    drawdown = (equity_series - cum_max) / cum_max
    max_drawdown = float(drawdown.min() * 100) if len(drawdown) > 0 else 0.0
    
    win_trades = 0
    total_trades = len(trade_log) // 2
    for j in range(0, len(trade_log) - 1, 2):
        if trade_log[j]["type"] == "BUY" and j+1 < len(trade_log) and trade_log[j+1]["type"] == "SELL":
            if trade_log[j+1]["price"] > trade_log[j]["price"]:
                win_trades += 1
                
    win_rate = (win_trades / total_trades * 100) if total_trades > 0 else 50.0
    
    return {
        "strategy_name": f"MA Crossover ({fast_period}/{slow_period})",
        "initial_capital": initial_capital,
        "final_capital": round(final_val, 2),
        "total_return_pct": round(total_return, 2),
        "benchmark_return_pct": round(benchmark_return, 2),
        "sharpe_ratio": round(sharpe, 2),
        "max_drawdown_pct": round(max_drawdown, 2),
        "win_rate_pct": round(win_rate, 1),
        "total_trades": total_trades,
        "trade_log": trade_log[-10:], # last 10 trades
        "equity_curve": equity_curve[::max(1, len(equity_curve)//50)] # sample ~50 points
    }
