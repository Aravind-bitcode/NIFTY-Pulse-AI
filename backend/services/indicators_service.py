import numpy as np
import pandas as pd

def calculate_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    """Calculate Relative Strength Index (RSI)."""
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / (loss + 1e-9)
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_macd(series: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> pd.DataFrame:
    """Calculate MACD Line, Signal Line, and Histogram."""
    ema_fast = series.ewm(span=fast, adjust=False).mean()
    ema_slow = series.ewm(span=slow, adjust=False).mean()
    macd = ema_fast - ema_slow
    signal_line = macd.ewm(span=signal, adjust=False).mean()
    histogram = macd - signal_line
    return pd.DataFrame({
        'macd': macd,
        'signal': signal_line,
        'histogram': histogram
    })

def calculate_bollinger_bands(series: pd.Series, period: int = 20, std_dev: float = 2.0) -> pd.DataFrame:
    """Calculate Bollinger Bands (Upper, Middle, Lower)."""
    sma = series.rolling(window=period).mean()
    rolling_std = series.rolling(window=period).std()
    upper = sma + (rolling_std * std_dev)
    lower = sma - (rolling_std * std_dev)
    bandwidth = (upper - lower) / sma
    return pd.DataFrame({
        'middle': sma,
        'upper': upper,
        'lower': lower,
        'bandwidth': bandwidth
    })

def calculate_pivot_points(df: pd.DataFrame) -> dict:
    """Calculate Standard Pivot Points (Pivot, R1, R2, R3, S1, S2, S3)."""
    high = float(df['High'].iloc[-1])
    low = float(df['Low'].iloc[-1])
    close = float(df['Close'].iloc[-1])
    
    pivot = (high + low + close) / 3.0
    r1 = (2 * pivot) - low
    s1 = (2 * pivot) - high
    r2 = pivot + (high - low)
    s2 = pivot - (high - low)
    r3 = high + 2 * (pivot - low)
    s3 = low - 2 * (high - pivot)
    
    return {
        "pivot": round(pivot, 2),
        "r1": round(r1, 2),
        "r2": round(r2, 2),
        "r3": round(r3, 2),
        "s1": round(s1, 2),
        "s2": round(s2, 2),
        "s3": round(s3, 2)
    }

def calculate_all_indicators(df: pd.DataFrame) -> dict:
    """Compute complete suite of technical indicators for a dataframe."""
    close = df['Close']
    high = df['High']
    low = df['Low']
    volume = df['Volume']
    
    # RSI
    rsi_series = calculate_rsi(close, 14)
    latest_rsi = float(rsi_series.dropna().iloc[-1]) if len(rsi_series.dropna()) > 0 else 50.0
    
    # MACD
    macd_df = calculate_macd(close)
    latest_macd = float(macd_df['macd'].dropna().iloc[-1])
    latest_signal = float(macd_df['signal'].dropna().iloc[-1])
    latest_hist = float(macd_df['histogram'].dropna().iloc[-1])
    
    # Bollinger Bands
    bb_df = calculate_bollinger_bands(close)
    latest_bb_upper = float(bb_df['upper'].dropna().iloc[-1])
    latest_bb_mid = float(bb_df['middle'].dropna().iloc[-1])
    latest_bb_lower = float(bb_df['lower'].dropna().iloc[-1])
    
    # Moving Averages
    sma20 = float(close.rolling(window=20).mean().dropna().iloc[-1]) if len(close) >= 20 else float(close.iloc[-1])
    sma50 = float(close.rolling(window=50).mean().dropna().iloc[-1]) if len(close) >= 50 else float(close.iloc[-1])
    sma200 = float(close.rolling(window=200).mean().dropna().iloc[-1]) if len(close) >= 200 else float(close.iloc[-1])
    
    ema9 = float(close.ewm(span=9).mean().dropna().iloc[-1])
    ema21 = float(close.ewm(span=21).mean().dropna().iloc[-1])
    
    # ATR (14)
    tr = pd.concat([
        high - low,
        (high - close.shift(1)).abs(),
        (low - close.shift(1)).abs()
    ], axis=1).max(axis=1)
    atr = float(tr.rolling(14).mean().dropna().iloc[-1]) if len(tr.dropna()) > 0 else float(high.iloc[-1] - low.iloc[-1])
    
    # VWAP
    vwap_series = ((volume * (high + low + close) / 3).cumsum() / (volume.cumsum() + 1e-9)).dropna()
    vwap = float(vwap_series.values[-1]) if len(vwap_series) > 0 else float(close.iloc[-1])
    
    # Technical Sentiment Score (0 to 100)
    score = 50
    if latest_rsi > 70:
        score += 15 # overbought / strong momentum
    elif latest_rsi < 30:
        score -= 15 # oversold
    elif latest_rsi > 50:
        score += 10
        
    if latest_hist > 0:
        score += 15
    else:
        score -= 15
        
    if close.iloc[-1] > sma50:
        score += 10
    else:
        score -= 10
        
    if ema9 > ema21:
        score += 10
    else:
        score -= 10
        
    score = max(5, min(95, score))
    sentiment_label = "STRONG BULLISH" if score >= 75 else "BULLISH" if score >= 55 else "NEUTRAL" if score >= 45 else "BEARISH" if score >= 25 else "STRONG BEARISH"
    
    pivots = calculate_pivot_points(df)
    
    return {
        "rsi": round(latest_rsi, 2),
        "macd": round(latest_macd, 2),
        "macd_signal": round(latest_signal, 2),
        "macd_histogram": round(latest_hist, 2),
        "bb_upper": round(latest_bb_upper, 2),
        "bb_middle": round(latest_bb_mid, 2),
        "bb_lower": round(latest_bb_lower, 2),
        "sma20": round(sma20, 2),
        "sma50": round(sma50, 2),
        "sma200": round(sma200, 2),
        "ema9": round(ema9, 2),
        "ema21": round(ema21, 2),
        "atr": round(atr, 2),
        "vwap": round(vwap, 2),
        "score": score,
        "sentiment": sentiment_label,
        "pivot_points": pivots,
        "rsi_series": rsi_series.dropna().tail(60).round(2).tolist(),
        "macd_hist_series": macd_df['histogram'].dropna().tail(60).round(2).tolist()
    }
