class SteemVolatilityMomentumIndicator {
    constructor(period = 14, volatilityPeriod = 20) {
        this.period = period;
        this.volatilityPeriod = volatilityPeriod;
    }

    calculate(data) {
        // Calculate basic price changes
        data.forEach((candle, index) => {
            if (index > 0) {
                candle.returns = (candle.close - data[index - 1].close) / data[index - 1].close;
            }
        });

        // Calculate ATR (Average True Range)
        data.forEach((candle, index) => {
            if (index > 0) {
                const highLow = candle.high - candle.low;
                const highClose = Math.abs(candle.high - data[index - 1].close);
                const lowClose = Math.abs(candle.low - data[index - 1].close);
                candle.trueRange = Math.max(highLow, highClose, lowClose);
            }
        });

        // Calculate ATR moving average
        for (let i = this.volatilityPeriod; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < this.volatilityPeriod; j++) {
                sum += data[i - j].trueRange;
            }
            data[i].atr = sum / this.volatilityPeriod;
        }

        // Calculate RSI
        data.forEach((candle, index) => {
            if (index > 0) {
                const delta = candle.close - data[index - 1].close;
                candle.gain = delta > 0 ? delta : 0;
                candle.loss = delta < 0 ? -delta : 0;
            }
        });

        // Calculate RSI moving averages
        for (let i = this.period; i < data.length; i++) {
            let avgGain = 0;
            let avgLoss = 0;
            for (let j = 0; j < this.period; j++) {
                avgGain += data[i - j].gain;
                avgLoss += data[i - j].loss;
            }
            avgGain /= this.period;
            avgLoss /= this.period;
            const rs = avgGain / avgLoss;
            data[i].rsi = 100 - (100 / (1 + rs));
        }

        // Calculate ADX
        data.forEach((candle, index) => {
            if (index > 0) {
                const plusDM = candle.high - data[index - 1].high;
                const minusDM = data[index - 1].low - candle.low;
                candle.plusDM = plusDM > 0 ? plusDM : 0;
                candle.minusDM = minusDM > 0 ? minusDM : 0;
            }
        });

        // Calculate ADX moving averages
        for (let i = this.period; i < data.length; i++) {
            let plusDMSum = 0;
            let minusDMSum = 0;
            let trSum = 0;
            for (let j = 0; j < this.period; j++) {
                plusDMSum += data[i - j].plusDM;
                minusDMSum += data[i - j].minusDM;
                trSum += data[i - j].trueRange;
            }
            const plusDI = 100 * (plusDMSum / this.period) / (trSum / this.period);
            const minusDI = 100 * (minusDMSum / this.period) / (trSum / this.period);
            const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
            data[i].adx = dx;
        }

        // Calculate SVMI
        data.forEach(candle => {
            if (candle.rsi && candle.adx && candle.atr) {
                candle.svmi = (
                    (candle.rsi - 50) * 0.4 +  // RSI component
                    (candle.adx - 25) * 0.3 +  // Trend strength component
                    (candle.atr / candle.close) * 1000 * 0.3  // Volatility component
                );

                // Generate signals
                if (candle.svmi > 20) {
                    candle.signal = 1;  // Buy signal
                } else if (candle.svmi < -20) {
                    candle.signal = -1;  // Sell signal
                } else {
                    candle.signal = 0;  // Hold
                }
            }
        });

        return data;
    }
}

class BinanceDataFetcher {
    constructor(symbol = 'STEEMUSDT') {
        this.symbol = symbol;
        this.baseUrl = 'https://api.binance.com/api/v3';
    }

    async fetchKlines(interval, limit = 100) {
        try {
            const response = await fetch(`${this.baseUrl}/klines?symbol=${this.symbol}&interval=${interval}&limit=${limit}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            // Transform Binance data format to our format
            return data.map(candle => ({
                timestamp: candle[0], // Binance timestamp is in milliseconds
                open: parseFloat(candle[1]),
                high: parseFloat(candle[2]),
                low: parseFloat(candle[3]),
                close: parseFloat(candle[4]),
                volume: parseFloat(candle[5])
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    async fetchTicker() {
        try {
            const response = await fetch(`${this.baseUrl}/ticker/24hr?symbol=${this.symbol}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return {
                timestamp: Date.now(),
                open: parseFloat(data.openPrice),
                high: parseFloat(data.highPrice),
                low: parseFloat(data.lowPrice),
                close: parseFloat(data.lastPrice),
                volume: parseFloat(data.volume)
            };
        } catch (error) {
            console.error('Error fetching ticker:', error);
            return null;
        }
    }
}

// Export for use in other files
module.exports = {
    SteemVolatilityMomentumIndicator,
    BinanceDataFetcher
}; 