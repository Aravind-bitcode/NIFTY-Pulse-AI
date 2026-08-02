"""
NIFTY-Pulse AI — Financial Engineering & Stock Prediction Platform
==================================================================

Layman Explanation:
-------------------
This is the main entry point file for NIFTY-Pulse AI, a Financial Engineering backend engine 
that predicts Indian stock market indices (NIFTY 50) using Machine Learning & Quantitative Analytics.

What this application does:
1. Fetches real-time financial market data from Yahoo Finance (yfinance API).
2. Calculates technical indicators (RSI, MACD, Moving Averages, Bollinger Bands).
3. Executes Machine Learning & Deep Learning forecasting models:
   - PyTorch LSTM Recurrent Neural Networks
   - Scikit-Learn Random Forest Regressors
   - Facebook Prophet Time-Series Seasonal Decomposition
   - Monte Carlo Probability Risk Simulations
4. Runs quantitative Moving Average crossover backtesting simulations.
"""

from fastapi import FastAPI, Query, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import os

from services.market_service import (
    fetch_stock_history, fetch_stock_info, fetch_screener_data, fetch_market_news, 
    fetch_marquee_tickers, generate_csv_dataset, parse_user_custom_csv, normalize_symbol, NIFTY_TICKERS
)
from services.indicators_service import calculate_all_indicators
from services.ml_service import (
    run_lstm_forecast, run_rf_forecast, run_prophet_forecast, run_monte_carlo_simulation
)
from services.backtesting_service import backtest_ma_crossover

app = FastAPI(
    title="NIFTY-Pulse AI API",
    description="Full-Stack NIFTY 50 Stock Price Prediction & Quantitative Analytics Engine",
    version="2.0.0"
)

# Enable CORS for React frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """Root health check returning available endpoint catalog."""
    return {
        "status": "ONLINE",
        "system": "NIFTY-Pulse AI Core Engine",
        "version": "2.0.0",
        "endpoints": [
            "/api/marquee",
            "/api/stock/{ticker}",
            "/api/stock/{ticker}/indicators",
            "/api/stock/{ticker}/download",
            "/api/predict/{ticker}",
            "/api/predict/custom-upload",
            "/api/backtest/{ticker}",
            "/api/screener",
            "/api/news"
        ]
    }

@app.get("/api/marquee")
def get_marquee():
    """Fetches real-time ticker prices for top NIFTY 50 stocks for header marquee."""
    data = fetch_marquee_tickers()
    return {"marquee": data}

@app.get("/api/stock/{ticker}")
def get_stock_data(ticker: str, period: str = "1y"):
    """Fetches stock historical OHLC (Open, High, Low, Close, Volume) price candles."""
    sym = normalize_symbol(ticker)
    info = fetch_stock_info(sym)
    df = fetch_stock_history(sym, period=period)
    
    history = []
    for date, row in df.iterrows():
        history.append({
            "date": date.strftime("%Y-%m-%d"),
            "open": round(float(row["Open"]), 2),
            "high": round(float(row["High"]), 2),
            "low": round(float(row["Low"]), 2),
            "close": round(float(row["Close"]), 2),
            "volume": int(row["Volume"])
        })
        
    return {
        "info": info,
        "history": history
    }

@app.get("/api/stock/{ticker}/indicators")
def get_indicators(ticker: str, period: str = "1y"):
    """Calculates technical indicators (RSI, MACD, SMA, EMA, Bollinger Bands)."""
    sym = normalize_symbol(ticker)
    df = fetch_stock_history(sym, period=period)
    indicators = calculate_all_indicators(df)
    return {
        "symbol": sym,
        "indicators": indicators
    }

@app.get("/api/stock/{ticker}/download")
def download_stock_dataset(ticker: str, period: str = "2y"):
    """Generates downloadable CSV dataset for financial data analysis."""
    sym = normalize_symbol(ticker)
    csv_content = generate_csv_dataset(sym, period=period)
    filename = f"{sym.replace('^', '').replace('.NS', '')}_dataset.csv"
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.post("/api/predict/custom-upload")
async def predict_custom_csv(file: UploadFile = File(...), model: str = "lstm", horizon: int = 30):
    """Processes user custom uploaded CSV stock dataset and returns ML price forecasts."""
    try:
        contents = await file.read()
        df = parse_user_custom_csv(contents)
        if len(df) < 15:
            raise HTTPException(status_code=400, detail="Uploaded CSV requires at least 15 rows of price data.")
            
        m = model.lower()
        res = {}
        if m == "lstm" or m == "all":
            res["lstm"] = run_lstm_forecast(df, horizon_days=horizon)
        if m == "rf" or m == "all":
            res["rf"] = run_rf_forecast(df, horizon_days=horizon)
        if m == "prophet" or m == "all":
            res["prophet"] = run_prophet_forecast(df, horizon_days=horizon)
        if m == "monte_carlo" or m == "all":
            res["monte_carlo"] = run_monte_carlo_simulation(df, horizon_days=horizon)
            
        return {
            "filename": file.filename,
            "rows_parsed": len(df),
            "last_price": round(float(df['Close'].iloc[-1]), 2),
            "horizon_days": horizon,
            "predictions": res
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process custom CSV file: {str(e)}")

@app.get("/api/predict/{ticker}")
def get_predictions(
    ticker: str, 
    model: str = Query("lstm", description="lstm, rf, prophet, monte_carlo, or all"),
    horizon: int = Query(30, description="Forecast horizon in days: 7, 14, 30, 90")
):
    """Executes requested ML deep learning model forecast (LSTM, RF, Prophet, Monte Carlo)."""
    sym = normalize_symbol(ticker)
    df = fetch_stock_history(sym, period="2y")
    
    if len(df) < 30:
        raise HTTPException(status_code=400, detail="Insufficient price history for prediction model.")
        
    res = {}
    m = model.lower()
    
    if m == "lstm" or m == "all":
        res["lstm"] = run_lstm_forecast(df, horizon_days=horizon)
    if m == "rf" or m == "all":
        res["rf"] = run_rf_forecast(df, horizon_days=horizon)
    if m == "prophet" or m == "all":
        res["prophet"] = run_prophet_forecast(df, horizon_days=horizon)
    if m == "monte_carlo" or m == "all":
        res["monte_carlo"] = run_monte_carlo_simulation(df, horizon_days=horizon)
        
    return {
        "symbol": sym,
        "current_price": round(float(df['Close'].iloc[-1]), 2),
        "horizon_days": horizon,
        "predictions": res
    }

@app.get("/api/backtest/{ticker}")
def run_backtest(ticker: str, fast: int = 20, slow: int = 50, capital: float = 100000.0):
    """Executes Moving Average crossover quantitative trading backtest."""
    sym = normalize_symbol(ticker)
    df = fetch_stock_history(sym, period="2y")
    result = backtest_ma_crossover(df, fast_period=fast, slow_period=slow, initial_capital=capital)
    return {
        "symbol": sym,
        "backtest": result
    }

@app.get("/api/screener")
def get_screener():
    """Returns stock market screener data with technical indicator filters."""
    data = fetch_screener_data()
    return {"count": len(data), "screener": data}

@app.get("/api/news")
def get_news(ticker: str = "^NSEI"):
    """Fetches financial market news for ticker symbol."""
    sym = normalize_symbol(ticker)
    news = fetch_market_news(sym)
    return {"symbol": sym, "news": news}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
