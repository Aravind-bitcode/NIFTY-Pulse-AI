# 📈 NIFTY-Pulse AI — Financial Engineering & Stock Prediction Platform

![PyTorch](https://img.shields.io/badge/PyTorch-LSTM-EE4C2C?style=for-the-badge&logo=pytorch)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Random--Forest-F7931E?style=for-the-badge&logo=scikitlearn)
![Prophet](https://img.shields.io/badge/Facebook-Prophet-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

**NIFTY-Pulse AI** is a quantitative financial engineering and stock market forecasting platform built to analyze Indian market indices (NIFTY 50). It integrates **PyTorch LSTM** deep learning networks, **Random Forest regressors**, **Facebook Prophet** seasonal trends, and **Monte Carlo probability risk simulations**.

---

## ✨ Key Features

- 🧠 **PyTorch LSTM Neural Forecasting**: Recurrent neural network architecture trained on historical OHLC stock pricing datasets.
- 🎲 **Monte Carlo Volatility Risk Simulation**: Runs 1,000+ stochastic price trajectories to compute probability risk bounds.
- 📊 **Real-Time Technical Indicator Gauges**: Computes RSI, MACD, Simple/Exponential Moving Averages, and Bollinger Bands via `services/indicators_service.py`.
- 🔄 **Moving Average Crossover Backtesting**: Simulates trading strategy performance, win rates, and maximum drawdown metrics.
- 📁 **Custom CSV Dataset Upload**: Allows users to upload custom financial datasets for instant model predictions.

---

## 🛠️ Tech Stack

- **Backend API**: `FastAPI`, `Uvicorn`, `yfinance`
- **Machine Learning & Deep Learning**: `PyTorch`, `Scikit-Learn`, `Prophet`, `Pandas`, `NumPy`
- **Frontend UI**: `React`, `Vite`, `Tailwind CSS`, `Recharts`

---

## 🚀 Getting Started

### 1. Run Backend Server

```bash
# Clone repository
git clone https://github.com/Aravind-bitcode/NIFTY-Pulse-AI.git
cd NIFTY-Pulse-AI

# Install dependencies & run FastAPI server
pip install -r requirements.txt
python backend/main.py
```

Backend API running at `http://localhost:8000`.

### 2. Run Frontend Dashboard

```bash
cd frontend
npm install
npm run dev
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — Copyright (c) Aravind Johindkumar.
