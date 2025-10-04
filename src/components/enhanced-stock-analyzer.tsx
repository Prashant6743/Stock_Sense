'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  DollarSign,
  BarChart3,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface StockQuote {
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

interface StockAnalysis {
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

export function EnhancedStockAnalyzer() {
  const [symbol, setSymbol] = useState('');
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];

  const analyzeStock = async (tickerSymbol: string, forceRefresh = false) => {
    if (!tickerSymbol.trim()) return;

    setLoading(true);
    setError(null);
    if (forceRefresh) setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          symbol: tickerSymbol.trim(),
          timestamp: Date.now() // Force fresh data
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze stock');
      }

      setAnalysis(result.data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the stock');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    if (analysis) {
      analyzeStock(analysis.quote.symbol, true);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh && analysis) {
      interval = setInterval(() => {
        refreshData();
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, analysis]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeStock(symbol);
  };

  const handleQuickSelect = (ticker: string) => {
    setSymbol(ticker);
    analyzeStock(ticker);
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'SELL': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'HOLD': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY': return <TrendingUp className="h-4 w-4" />;
      case 'SELL': return <TrendingDown className="h-4 w-4" />;
      case 'HOLD': return <Minus className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'BULLISH': return 'text-green-400';
      case 'BEARISH': return 'text-red-400';
      case 'NEUTRAL': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Search Section */}
      <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 hover:border-gray-700 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Advanced Stock Analyzer
          </CardTitle>
          <p className="text-gray-400">
            Get comprehensive analysis with real-time data, technical indicators, and AI-powered recommendations
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL, GOOGL, MSFT)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-700/80 hover:border-gray-600 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading || !symbol.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4" />
              )}
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </form>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400 mr-2">Popular:</span>
            {popularStocks.map((ticker) => (
              <Button
                key={ticker}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(ticker)}
                disabled={loading}
                className="border-gray-600 bg-gray-800 text-white hover:bg-gray-700 hover:border-gray-500 hover:scale-105 hover:shadow-lg active:bg-gray-600 focus:bg-gray-700 focus:border-gray-500 transition-all duration-200"
              >
                {ticker}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-red-900/20 border-red-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Analysis Failed</span>
                </div>
                <p className="text-red-300 mt-1">{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Analyzing Stock</h3>
                <p className="text-gray-400">Fetching real-time data and calculating indicators...</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Stock Quote Card */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                      {analysis.quote.symbol}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={refreshData}
                        disabled={loading}
                        className="text-gray-400 hover:text-white"
                      >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      </Button>
                    </CardTitle>
                    <p className="text-gray-400">{analysis.quote.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Updated: {lastUpdated?.toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata'}) || 'Just now'} IST</span>
                      {analysis.quote.marketStatus && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          analysis.quote.marketStatus === 'OPEN' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                          analysis.quote.marketStatus === 'PRE_MARKET' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
                          analysis.quote.marketStatus === 'AFTER_HOURS' ? 'bg-blue-900/30 text-blue-400 border border-blue-800' :
                          'bg-red-900/30 text-red-400 border border-red-800'
                        }`}>
                          {analysis.quote.marketStatus === 'OPEN' ? '🟢 Market Open' :
                           analysis.quote.marketStatus === 'PRE_MARKET' ? '🟡 Pre-Market' :
                           analysis.quote.marketStatus === 'AFTER_HOURS' ? '🔵 After Hours' :
                           '🔴 Market Closed'}
                        </span>
                      )}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoRefresh}
                          onChange={(e) => setAutoRefresh(e.target.checked)}
                          className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs">Auto-refresh (30s)</span>
                      </label>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white flex items-center gap-2">
                      ${analysis.quote.price.toFixed(2)}
                      {autoRefresh && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live updates enabled" />
                      )}
                    </div>
                    <div className={`flex items-center gap-1 ${
                      analysis.quote.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {analysis.quote.change >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>
                        {analysis.quote.change >= 0 ? '+' : ''}
                        {analysis.quote.change.toFixed(2)} ({analysis.quote.changePercent})
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Volume</p>
                    <p className="text-white font-semibold">{formatNumber(analysis.quote.volume)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Day Range</p>
                    <p className="text-white font-semibold">
                      ${analysis.quote.low.toFixed(2)} - ${analysis.quote.high.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Open</p>
                    <p className="text-white font-semibold">${analysis.quote.open.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Prev Close</p>
                    <p className="text-white font-semibold">${analysis.quote.previousClose.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendation Card */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={`${getRecommendationColor(analysis.recommendation)} px-4 py-2 text-lg font-bold`}>
                    {getRecommendationIcon(analysis.recommendation)}
                    {analysis.recommendation}
                  </Badge>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Confidence</p>
                    <div className="flex items-center gap-2">
                      <Progress value={analysis.confidence} className="w-20" />
                      <span className="text-white font-semibold">{analysis.confidence}%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-300">{analysis.reasoning}</p>
                </div>
              </CardContent>
            </Card>

            {/* Technical Indicators */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Technical Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">RSI (14)</p>
                    <p className="text-2xl font-bold text-white">{analysis.technicalIndicators.rsi}</p>
                    <p className="text-xs text-gray-500">
                      {analysis.technicalIndicators.rsi < 30 ? 'Oversold' : 
                       analysis.technicalIndicators.rsi > 70 ? 'Overbought' : 'Neutral'}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Trend</p>
                    <p className={`text-2xl font-bold ${getTrendColor(analysis.technicalIndicators.trend)}`}>
                      {analysis.technicalIndicators.trend}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Support</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${analysis.technicalIndicators.support.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Resistance</p>
                    <p className="text-2xl font-bold text-red-400">
                      ${analysis.technicalIndicators.resistance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Chart */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Price History (30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-1">
                  {analysis.historicalData.map((point, index) => {
                    const maxPrice = Math.max(...analysis.historicalData.map(p => p.price));
                    const minPrice = Math.min(...analysis.historicalData.map(p => p.price));
                    const height = ((point.price - minPrice) / (maxPrice - minPrice)) * 100;
                    
                    return (
                      <div
                        key={index}
                        className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm flex-1 transition-all hover:opacity-80"
                        style={{ height: `${Math.max(height, 5)}%` }}
                        title={`${point.date}: $${point.price.toFixed(2)}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{analysis.historicalData[0]?.date}</span>
                  <span>{analysis.historicalData[analysis.historicalData.length - 1]?.date}</span>
                </div>
              </CardContent>
            </Card>

            {/* Last Updated & Demo Notice */}
            <div className="flex flex-col items-center gap-2 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Last updated: {analysis.quote.lastUpdated}</span>
              </div>
              {analysis.quote.lastUpdated === new Date().toISOString().split('T')[0] && (
                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                  <AlertCircle className="h-4 w-4" />
                  <span>Demo data - API limit reached</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
