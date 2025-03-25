# Steem Volatility Momentum Indicator (SVMI)

A custom technical indicator specifically designed for Steem/USDT trading, combining volatility, momentum, and trend components to generate trading signals.

## Overview

The Steem Volatility Momentum Indicator (SVMI) is a custom technical analysis tool that combines three key components:
1. RSI (Relative Strength Index) - For momentum
2. ADX (Average Directional Index) - For trend strength
3. ATR (Average True Range) - For volatility

The indicator is specifically designed to work with Steem/USDT's unique market characteristics, providing clear buy/sell signals while considering market volatility and trend strength.

## Features

- Combines multiple technical indicators into a single, easy-to-use signal
- Adapts to Steem/USDT's volatile nature
- Provides clear entry and exit signals
- Visual representation with price chart and indicator components
- Real-time signal generation

## Installation

1. Clone this repository
2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

Run the main script to analyze Steem/USDT data and generate signals:
```bash
python steem_indicator.py
```

The script will:
1. Download the last year of Steem/USDT price data
2. Calculate the SVMI indicator
3. Generate a plot showing:
   - Price chart with signals
   - SVMI indicator
   - Component indicators (RSI and ADX)
4. Print the latest trading signal

## Signal Interpretation

- **Buy Signal**: When SVMI > 20
- **Sell Signal**: When SVMI < -20
- **Hold**: When -20 ≤ SVMI ≤ 20

## Technical Details

The SVMI is calculated using the following formula:
```
SVMI = (RSI - 50) * 0.4 + (ADX - 25) * 0.3 + (ATR/Price) * 1000 * 0.3
```

Where:
- RSI component (40% weight): Measures momentum
- ADX component (30% weight): Measures trend strength
- ATR component (30% weight): Measures volatility

## Advantages

1. **Adaptability**: Works well in both trending and ranging markets
2. **Volatility Consideration**: Incorporates market volatility into decision making
3. **Clear Signals**: Provides unambiguous buy/sell signals
4. **Visual Feedback**: Easy to interpret with included charts

## Limitations

1. **Lag**: Like most technical indicators, SVMI has some inherent lag
2. **False Signals**: May generate false signals in extremely volatile conditions
3. **Timeframe Dependency**: Works best on 4H and daily timeframes

## Disclaimer

This indicator is for educational purposes only and steem crypto academy.
