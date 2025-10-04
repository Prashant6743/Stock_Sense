// Enhanced Stock Data Service
export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  marketCap: string;
  peRatio: string;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  lastUpdated: string;
  marketStatus?: 'OPEN' | 'CLOSED' | 'PRE_MARKET' | 'AFTER_HOURS';
}

export interface StockAnalysis {
  quote: StockQuote;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  technicalIndicators: {
    rsi: number;
    trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    support: number;
    resistance: number;
  };
  historicalData: Array<{
    date: string;
    price: number;
  }>;
}

class StockDataService {
  private apiKey: string;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30000; // 30 seconds cache for real-time data

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || '';
  }

  private getMarketStatus(): 'OPEN' | 'CLOSED' | 'PRE_MARKET' | 'AFTER_HOURS' {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const hour = istTime.getHours();
    const day = istTime.getDay();
    
    // Weekend
    if (day === 0 || day === 6) return 'CLOSED';
    
    // US Market hours in IST: 9:30 PM - 4:00 AM (next day)
    if (hour >= 21 && hour <= 23) return 'OPEN'; // 9:30 PM - 11:59 PM
    if (hour >= 0 && hour < 4) return 'OPEN'; // 12:00 AM - 3:59 AM
    if (hour >= 19 && hour < 21) return 'PRE_MARKET'; // 7:00 PM - 9:29 PM
    if (hour >= 4 && hour < 8) return 'AFTER_HOURS'; // 4:00 AM - 7:59 AM
    
    return 'CLOSED';
  }

  private async fetchWithCache(url: string, cacheKey: string): Promise<any> {
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check for API errors
      if (data['Error Message']) {
        throw new Error(`API Error: ${data['Error Message']}`);
      }
      
      if (data.Note && data.Note.includes('call frequency')) {
        throw new Error('API rate limit exceeded. Please try again in a moment.');
      }
      
      if (data.Information && data.Information.includes('rate limit')) {
        throw new Error('Daily API limit reached. Using demo data for analysis.');
      }

      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Fetch error for ${cacheKey}:`, error);
      throw error;
    }
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    // Try multiple APIs in order for real-time data
    const apis = [
      () => this.fetchFromTwelveData(symbol),
      () => this.fetchFromAlphaVantage(symbol),
      () => this.fetchFromYahooFinance(symbol),
      () => this.fetchFromFinnhub(symbol)
    ];

    for (const apiCall of apis) {
      try {
        const quote = await apiCall();
        if (quote) {
          console.log(`Successfully fetched real-time data for ${symbol}`);
          return quote;
        }
      } catch (error) {
        console.warn(`API failed for ${symbol}:`, error);
        continue;
      }
    }

    console.warn(`All APIs failed for ${symbol}, using enhanced demo data with current market simulation`);
    return this.getEnhancedDemoQuote(symbol);
  }

  private async fetchFromTwelveData(symbol: string): Promise<StockQuote | null> {
    try {
      // Using Twelve Data API (free tier, no key required for basic quotes)
      const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=demo`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Twelve Data API failed');
      
      const data = await response.json();
      
      if (data.status === 'error' || !data.close) {
        throw new Error('No Twelve Data available');
      }
      
      const currentPrice = parseFloat(data.close);
      const previousClose = parseFloat(data.previous_close);
      const change = currentPrice - previousClose;
      const changePercent = ((change / previousClose) * 100).toFixed(2) + '%';

      return {
        symbol: symbol.toUpperCase(),
        name: this.getCompanyName(symbol),
        price: Math.round(currentPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: change >= 0 ? `+${changePercent}` : changePercent,
        volume: parseInt(data.volume) || 0,
        marketCap: 'N/A',
        peRatio: 'N/A',
        high: parseFloat(data.high) || currentPrice,
        low: parseFloat(data.low) || currentPrice,
        open: parseFloat(data.open) || currentPrice,
        previousClose: previousClose,
        lastUpdated: `${new Date().toLocaleDateString('en-IN', {timeZone: 'Asia/Kolkata'})} ${new Date().toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata'})} IST (Twelve Data)`,
        marketStatus: this.getMarketStatus()
      };
    } catch (error) {
      throw new Error('Twelve Data fetch failed');
    }
  }

  private async fetchFromAlphaVantage(symbol: string): Promise<StockQuote | null> {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
    const data = await this.fetchWithCache(url, `av_${symbol}`);
    const quote = data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error(`No Alpha Vantage data for ${symbol}`);
    }

    return {
      symbol: quote['01. symbol'] || symbol,
      name: this.getCompanyName(symbol),
      price: parseFloat(quote['05. price'] || '0'),
      change: parseFloat(quote['09. change'] || '0'),
      changePercent: quote['10. change percent'] || '0%',
      volume: parseInt(quote['06. volume'] || '0'),
      marketCap: 'N/A',
      peRatio: 'N/A',
      high: parseFloat(quote['03. high'] || '0'),
      low: parseFloat(quote['04. low'] || '0'),
      open: parseFloat(quote['02. open'] || '0'),
      previousClose: parseFloat(quote['08. previous close'] || '0'),
      lastUpdated: `${new Date().toLocaleDateString('en-IN', {timeZone: 'Asia/Kolkata'})} ${new Date().toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata'})} IST (Alpha Vantage)`,
      marketStatus: this.getMarketStatus()
    };
  }

  private async fetchFromYahooFinance(symbol: string): Promise<StockQuote | null> {
    try {
      // Using Yahoo Finance API (free, no key required)
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Yahoo Finance API failed');
      
      const data = await response.json();
      const result = data.chart?.result?.[0];
      
      if (!result) throw new Error('No Yahoo Finance data');
      
      const meta = result.meta;
      const currentPrice = meta.regularMarketPrice || meta.previousClose;
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = ((change / previousClose) * 100).toFixed(2) + '%';

      return {
        symbol: symbol.toUpperCase(),
        name: this.getCompanyName(symbol),
        price: Math.round(currentPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: change >= 0 ? `+${changePercent}` : changePercent,
        volume: meta.regularMarketVolume || 0,
        marketCap: 'N/A',
        peRatio: 'N/A',
        high: meta.regularMarketDayHigh || currentPrice,
        low: meta.regularMarketDayLow || currentPrice,
        open: meta.regularMarketOpen || currentPrice,
        previousClose: previousClose,
        lastUpdated: `${new Date().toLocaleDateString('en-IN', {timeZone: 'Asia/Kolkata'})} ${new Date().toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata'})} IST (Yahoo Finance)`,
        marketStatus: this.getMarketStatus()
      };
    } catch (error) {
      throw new Error('Yahoo Finance fetch failed');
    }
  }

  private async fetchFromFinnhub(symbol: string): Promise<StockQuote | null> {
    try {
      // Using Finnhub free tier (requires signup but has free tier)
      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=demo`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Finnhub API failed');
      
      const data = await response.json();
      
      if (!data.c) throw new Error('No Finnhub data');
      
      const currentPrice = data.c; // current price
      const change = data.d; // change
      const changePercent = data.dp; // change percent

      return {
        symbol: symbol.toUpperCase(),
        name: this.getCompanyName(symbol),
        price: Math.round(currentPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
        volume: 0, // Not available in basic quote
        marketCap: 'N/A',
        peRatio: 'N/A',
        high: data.h || currentPrice, // day high
        low: data.l || currentPrice, // day low
        open: data.o || currentPrice, // open price
        previousClose: data.pc || currentPrice, // previous close
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      throw new Error('Finnhub fetch failed');
    }
  }

  private async fetchFromPolygon(symbol: string): Promise<StockQuote | null> {
    try {
      // Using Polygon.io free tier
      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=demo`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Polygon API failed');
      
      const data = await response.json();
      const result = data.results?.[0];
      
      if (!result) throw new Error('No Polygon data');
      
      const currentPrice = result.c; // close price
      const open = result.o;
      const change = currentPrice - open;
      const changePercent = ((change / open) * 100).toFixed(2) + '%';

      return {
        symbol: symbol.toUpperCase(),
        name: this.getCompanyName(symbol),
        price: Math.round(currentPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: change >= 0 ? `+${changePercent}` : changePercent,
        volume: result.v || 0,
        marketCap: 'N/A',
        peRatio: 'N/A',
        high: result.h || currentPrice,
        low: result.l || currentPrice,
        open: open,
        previousClose: open, // Using open as previous close approximation
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      throw new Error('Polygon fetch failed');
    }
  }

  private getEnhancedDemoQuote(symbol: string): StockQuote {
    // Enhanced demo data that simulates real market movement
    const now = new Date();
    
    // Convert to India Standard Time (IST)
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    
    // US Market hours in IST (9:30 PM to 4:00 AM IST next day)
    const marketOpenIST = new Date(istTime);
    marketOpenIST.setHours(21, 30, 0, 0); // 9:30 PM IST
    const marketCloseIST = new Date(istTime);
    marketCloseIST.setHours(4, 0, 0, 0); // 4:00 AM IST next day
    
    // Check if current IST time is during US market hours
    const isMarketHours = (istTime.getHours() >= 21 || istTime.getHours() < 4) && istTime.getDay() >= 1 && istTime.getDay() <= 5;
    
    // Base prices for popular stocks (approximate current levels)
    const basePrices: Record<string, number> = {
      'AAPL': 175,
      'GOOGL': 140,
      'MSFT': 380,
      'AMZN': 145,
      'TSLA': 250,
      'META': 500,
      'NVDA': 875,
      'NFLX': 445,
      'AMD': 165,
      'INTC': 45
    };
    
    const basePrice = basePrices[symbol.toUpperCase()] || (100 + Math.random() * 200);
    
    // Simulate realistic market movement
    const timeBasedVariation = Math.sin(now.getMinutes() / 10) * 0.02; // ±2% based on time
    const randomVariation = (Math.random() - 0.5) * 0.04; // ±2% random
    const marketVariation = isMarketHours ? randomVariation : timeBasedVariation * 0.5;
    
    const currentPrice = basePrice * (1 + marketVariation);
    const previousClose = basePrice * (1 + (Math.random() - 0.5) * 0.01); // ±0.5% from base
    const change = currentPrice - previousClose;
    const changePercent = ((change / previousClose) * 100).toFixed(2) + '%';
    
    return {
      symbol: symbol.toUpperCase(),
      name: this.getCompanyName(symbol),
      price: Math.round(currentPrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: change >= 0 ? `+${changePercent}` : changePercent,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
      marketCap: 'N/A',
      peRatio: 'N/A',
      high: Math.round((currentPrice * 1.02) * 100) / 100,
      low: Math.round((currentPrice * 0.98) * 100) / 100,
      open: Math.round((previousClose * 1.005) * 100) / 100,
      previousClose: Math.round(previousClose * 100) / 100,
      lastUpdated: `${istTime.toLocaleDateString('en-IN')} ${istTime.toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata'})} IST (Simulated Live)`,
      marketStatus: this.getMarketStatus()
    };
  }

  private getDemoStockQuote(symbol: string): StockQuote {
    // Demo data for popular stocks
    const demoData: Record<string, Partial<StockQuote>> = {
      'AAPL': { price: 175.43, change: 2.15, changePercent: '1.24%', volume: 45123000, high: 176.80, low: 173.20, open: 174.50 },
      'GOOGL': { price: 138.21, change: -1.45, changePercent: '-1.04%', volume: 28456000, high: 140.15, low: 137.80, open: 139.60 },
      'MSFT': { price: 378.85, change: 4.20, changePercent: '1.12%', volume: 32145000, high: 380.25, low: 376.40, open: 377.10 },
      'AMZN': { price: 145.67, change: -0.85, changePercent: '-0.58%', volume: 41236000, high: 147.20, low: 144.90, open: 146.30 },
      'TSLA': { price: 248.42, change: 8.75, changePercent: '3.65%', volume: 89456000, high: 252.10, low: 245.80, open: 247.20 },
      'META': { price: 501.23, change: 12.45, changePercent: '2.55%', volume: 18765000, high: 505.80, low: 498.60, open: 500.10 },
      'NVDA': { price: 875.30, change: -15.20, changePercent: '-1.71%', volume: 52341000, high: 892.50, low: 870.15, open: 885.40 },
      'NFLX': { price: 445.67, change: 6.80, changePercent: '1.55%', volume: 12456000, high: 448.90, low: 442.30, open: 444.20 }
    };

    const demo = demoData[symbol.toUpperCase()] || {
      price: 100 + Math.random() * 200,
      change: (Math.random() - 0.5) * 10,
      changePercent: ((Math.random() - 0.5) * 5).toFixed(2) + '%',
      volume: Math.floor(Math.random() * 50000000) + 10000000,
      high: 0, low: 0, open: 0
    };

    const price = demo.price!;
    const change = demo.change!;
    const previousClose = price - change;

    return {
      symbol: symbol.toUpperCase(),
      name: this.getCompanyName(symbol),
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: demo.changePercent!,
      volume: demo.volume!,
      marketCap: 'N/A',
      peRatio: 'N/A',
      high: demo.high || Math.round((price * 1.02) * 100) / 100,
      low: demo.low || Math.round((price * 0.98) * 100) / 100,
      open: demo.open || Math.round((previousClose * 1.005) * 100) / 100,
      previousClose: Math.round(previousClose * 100) / 100,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }

  async getHistoricalData(symbol: string, days: number = 30): Promise<Array<{ date: string; price: number }>> {
    try {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.apiKey}`;
      const data = await this.fetchWithCache(url, `history_${symbol}`);
      
      const timeSeries = data['Time Series (Daily)'];
      if (!timeSeries) {
        // Return fallback data if historical data unavailable
        return this.generateFallbackHistoricalData(symbol, days);
      }

      return Object.entries(timeSeries)
        .slice(0, days)
        .map(([date, data]: [string, any]) => ({
          date,
          price: parseFloat(data['4. close'])
        }))
        .reverse();
    } catch (error) {
      console.warn('Historical data fetch failed, using fallback:', error);
      return this.generateFallbackHistoricalData(symbol, days);
    }
  }

  private async generateFallbackHistoricalData(symbol: string, days: number): Promise<Array<{ date: string; price: number }>> {
    try {
      // Get current price for baseline
      const quote = await this.getStockQuote(symbol);
      const basePrice = quote.price;
      
      const data = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Generate realistic price variation (±3%)
        const variation = (Math.random() - 0.5) * 0.06;
        const price = basePrice * (1 + variation);
        
        data.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(price * 100) / 100
        });
      }
      
      return data;
    } catch {
      // Ultimate fallback with synthetic data
      return Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 100 + Math.random() * 50
      }));
    }
  }

  private calculateTechnicalIndicators(historicalData: Array<{ date: string; price: number }>) {
    const prices = historicalData.map(d => d.price);
    
    // Simple RSI calculation
    const rsi = this.calculateRSI(prices);
    
    // Trend analysis
    const recentPrices = prices.slice(-5);
    const olderPrices = prices.slice(-10, -5);
    const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;
    
    let trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
    if (recentAvg > olderAvg * 1.02) trend = 'BULLISH';
    else if (recentAvg < olderAvg * 0.98) trend = 'BEARISH';
    
    // Support and resistance levels
    const support = Math.min(...prices.slice(-20));
    const resistance = Math.max(...prices.slice(-20));
    
    return {
      rsi,
      trend,
      support: Math.round(support * 100) / 100,
      resistance: Math.round(resistance * 100) / 100
    };
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50; // Neutral RSI
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    return Math.round(rsi * 100) / 100;
  }

  private generateRecommendation(quote: StockQuote, technicalIndicators: any): { 
    recommendation: 'BUY' | 'SELL' | 'HOLD'; 
    confidence: number; 
    reasoning: string; 
  } {
    const { rsi, trend } = technicalIndicators;
    const changePercent = parseFloat(quote.changePercent.replace('%', ''));
    
    let score = 0;
    let reasons = [];
    
    // RSI analysis
    if (rsi < 30) {
      score += 2;
      reasons.push('RSI indicates oversold conditions');
    } else if (rsi > 70) {
      score -= 2;
      reasons.push('RSI indicates overbought conditions');
    }
    
    // Trend analysis
    if (trend === 'BULLISH') {
      score += 1;
      reasons.push('Bullish price trend detected');
    } else if (trend === 'BEARISH') {
      score -= 1;
      reasons.push('Bearish price trend detected');
    }
    
    // Recent performance
    if (changePercent > 2) {
      score += 1;
      reasons.push('Strong positive momentum');
    } else if (changePercent < -2) {
      score -= 1;
      reasons.push('Negative momentum observed');
    }
    
    // Volume analysis
    if (quote.volume > 1000000) {
      score += 0.5;
      reasons.push('High trading volume indicates interest');
    }
    
    let recommendation: 'BUY' | 'SELL' | 'HOLD';
    let confidence: number;
    
    if (score >= 2) {
      recommendation = 'BUY';
      confidence = Math.min(85, 60 + score * 5);
    } else if (score <= -2) {
      recommendation = 'SELL';
      confidence = Math.min(85, 60 + Math.abs(score) * 5);
    } else {
      recommendation = 'HOLD';
      confidence = 60;
    }
    
    const reasoning = reasons.length > 0 ? reasons.join('. ') + '.' : 'Mixed signals suggest holding position.';
    
    return { recommendation, confidence, reasoning };
  }

  async analyzeStock(symbol: string): Promise<StockAnalysis> {
    try {
      const [quote, historicalData] = await Promise.all([
        this.getStockQuote(symbol),
        this.getHistoricalData(symbol)
      ]);
      
      const technicalIndicators = this.calculateTechnicalIndicators(historicalData);
      const { recommendation, confidence, reasoning } = this.generateRecommendation(quote, technicalIndicators);
      
      return {
        quote,
        recommendation,
        confidence,
        reasoning,
        technicalIndicators,
        historicalData
      };
    } catch (error) {
      console.error('Stock analysis failed:', error);
      throw new Error(`Failed to analyze ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getCompanyName(symbol: string): string {
    const companies: Record<string, string> = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corporation',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'META': 'Meta Platforms Inc.',
      'NVDA': 'NVIDIA Corporation',
      'NFLX': 'Netflix Inc.',
      'AMD': 'Advanced Micro Devices',
      'INTC': 'Intel Corporation'
    };
    
    return companies[symbol.toUpperCase()] || `${symbol.toUpperCase()} Inc.`;
  }
}

export const stockService = new StockDataService();
