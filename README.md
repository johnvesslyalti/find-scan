
Title

    📈 Bollinger Bands – FindScan Frontend Intern Assignment

Description

    This project implements a Bollinger Bands indicator using KLineCharts inside a Next.js + React + TypeScript + TailwindCSS setup.  
    The UI and behavior are inspired by TradingView’s Bollinger Bands indicator.

🚀 Features

    - Candlestick chart with demo OHLCV data (200+ candles).
    - Bollinger Bands indicator:
    - Inputs:
        - Length: default `20`
        - MA Type: `SMA` (Simple Moving Average)
        - Source: `Close` price
        - StdDev Multiplier: default `2`
        - Offset: default `0`
    - Style:
        - Toggle visibility for Basis, Upper, Lower
        - Change colors, line width, line style (solid/dashed)
        - Background fill toggle with opacity control
    - Settings panel with two tabs:
    - Inputs
    - Style
    - Live updates: chart recalculates instantly when settings are changed.
    - Tooltip/Crosshair shows Basis, Upper, Lower values for hovered candle.

🧮 Formulas

    For each candle:

    - Basis (Middle Band) = SMA(source, length)  
    - StdDev = √( Σ (xᵢ – mean)² / N )  
    > We used population standard deviation (dividing by `N`, not `N-1`).  
    - Upper Band = Basis + (StdDev × multiplier)  
    - Lower Band = Basis – (StdDev × multiplier)  
    - Offset = Shifts bands forward/backward by N bars.

📂 Project Structure

    /app
    page.tsx                 Renders chart + settings
    /components
    Chart.tsx                Handles KLineCharts init & Bollinger overlay
    BollingerSettings.tsx    Settings UI (Inputs & Style)
    /lib/indicators
    bollinger.ts             computeBollingerBands() utility
    types.ts                 Shared types
    /public/data
    ohlcv.json               Demo OHLCV data (200+ candles)
    README.md

🛠️ Tech Stack

    - Next.js (React + TypeScript)
    - TailwindCSS (UI styling)
    - KLineCharts (charting library)
    - No external chart libraries used.

 📸 Screenshots

Candlestick + Bollinger Bands
![Chart Example](home.png)

Settings Panel
![Settings Example](/home.png)

 ⚡ Quick Start

    Clone repo and install dependencies:
        git clone https://github.com/<your-username>/findscan-bollinger.git
        cd findscan-bollinger
        npm install
        npm run dev

    Visit [http://localhost:3000](http://localhost:3000) 🚀

 📦 KLineCharts Version

     Tested with: klinecharts@^10.0.0-alpha5 (see package.json)

 ✅ Acceptance Criteria Checklist

    [x] Correct Bollinger Bands calculation
    [x] SMA basis tracking moving average
    [x] Upper/Lower bands expand with volatility
    [x] Offset shifting works
    [x] Inputs/Style panel (TradingView-inspired)
    [x] Smooth updates on 200–1,000 candles
    [x] KLineCharts only (no extra chart lib)

 📝 Notes

    This implementation uses SMA only for Basis (as required).
    Standard deviation is population variant.
    Designed for dark backgrounds by default.
    Additional polish (animations, better color pickers) can be added if needed.