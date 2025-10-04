'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Shield, Zap, Brain, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AIAnalysis {
  symbol: string;
  currentPrice: number;
  predictedPrice: {
    day: number;
    week: number;
    month: number;
    threeMonth: number;
  };
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  confidence: number;
  targetPrice: number;
  stopLoss: number;
  expectedReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  technicalIndicators: {
    rsi: number;
    macd: 'Bullish' | 'Bearish';
    movingAverage: 'Above' | 'Below';
    volume: 'High' | 'Normal' | 'Low';
  };
  fundamentals: {
    peRatio: number;
    pbRatio: number;
    debtToEquity: number;
    roe: number;
    score: number;
  };
  aiInsights: string[];
  newsImpact: 'Positive' | 'Neutral' | 'Negative';
  marketSentiment: number;
}

interface AIStockAnalysisProps {
  symbol: string;
  currentPrice: number;
}

export function AIStockAnalysis({ symbol, currentPrice }: AIStockAnalysisProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis with realistic data
    const analyzeStock = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate realistic AI analysis
      const volatility = Math.random() * 0.15; // 0-15% volatility
      const trend = Math.random() > 0.5 ? 1 : -1;
      const baseChange = (Math.random() * 0.1 + 0.02) * trend; // 2-12% change

      const mockAnalysis: AIAnalysis = {
        symbol,
        currentPrice,
        predictedPrice: {
          day: currentPrice * (1 + baseChange * 0.1),
          week: currentPrice * (1 + baseChange * 0.3),
          month: currentPrice * (1 + baseChange * 0.7),
          threeMonth: currentPrice * (1 + baseChange * 1.0)
        },
        recommendation: baseChange > 0.08 ? 'Strong Buy' : baseChange > 0.04 ? 'Buy' : baseChange > -0.04 ? 'Hold' : baseChange > -0.08 ? 'Sell' : 'Strong Sell',
        confidence: Math.round(70 + Math.random() * 25),
        targetPrice: currentPrice * (1 + Math.abs(baseChange) * 1.2),
        stopLoss: currentPrice * (1 - Math.abs(baseChange) * 0.5),
        expectedReturn: baseChange * 100,
        riskLevel: volatility > 0.1 ? 'High' : volatility > 0.05 ? 'Medium' : 'Low',
        technicalIndicators: {
          rsi: Math.round(30 + Math.random() * 40),
          macd: trend > 0 ? 'Bullish' : 'Bearish',
          movingAverage: trend > 0 ? 'Above' : 'Below',
          volume: Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Normal' : 'Low'
        },
        fundamentals: {
          peRatio: 15 + Math.random() * 30,
          pbRatio: 1 + Math.random() * 5,
          debtToEquity: Math.random() * 2,
          roe: 10 + Math.random() * 20,
          score: Math.round(60 + Math.random() * 35)
        },
        aiInsights: [
          trend > 0 ? 'Strong upward momentum detected with positive technical signals' : 'Bearish signals suggest caution in the near term',
          `RSI at ${Math.round(30 + Math.random() * 40)} indicates ${Math.random() > 0.5 ? 'oversold' : 'neutral'} conditions`,
          `Volume analysis shows ${Math.random() > 0.5 ? 'institutional' : 'retail'} investor interest`,
          `Recent news sentiment is ${Math.random() > 0.5 ? 'positive' : 'neutral'}, supporting ${trend > 0 ? 'bullish' : 'cautious'} outlook`,
          `AI model predicts ${Math.abs(baseChange * 100).toFixed(1)}% ${trend > 0 ? 'upside' : 'downside'} potential in 3 months`
        ],
        newsImpact: Math.random() > 0.6 ? 'Positive' : Math.random() > 0.3 ? 'Neutral' : 'Negative',
        marketSentiment: Math.round(40 + Math.random() * 40)
      };

      setAnalysis(mockAnalysis);
      setLoading(false);
    };

    analyzeStock();
  }, [symbol, currentPrice]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-y-4 py-8">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white font-medium">AI Analyzing Stock...</p>
                <p className="text-gray-400 text-sm">Processing market data, technical indicators, and news sentiment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) return null;

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'Strong Buy': return 'from-emerald-500 to-teal-500';
      case 'Buy': return 'from-green-500 to-emerald-500';
      case 'Hold': return 'from-yellow-500 to-orange-500';
      case 'Sell': return 'from-orange-500 to-red-500';
      case 'Strong Sell': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${getRecommendationColor(analysis.recommendation)} p-6 rounded-xl text-white`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">AI Recommendation</p>
              <p className="text-2xl font-bold">{analysis.recommendation}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Confidence</p>
            <p className="text-2xl font-bold">{analysis.confidence}%</p>
          </div>
        </div>
        <Progress value={analysis.confidence} className="h-2 bg-white/20" />
      </motion.div>

      {/* Price Predictions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-cyan-400" />
            AI Price Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '1 Day', value: analysis.predictedPrice.day, change: ((analysis.predictedPrice.day - currentPrice) / currentPrice) * 100 },
              { label: '1 Week', value: analysis.predictedPrice.week, change: ((analysis.predictedPrice.week - currentPrice) / currentPrice) * 100 },
              { label: '1 Month', value: analysis.predictedPrice.month, change: ((analysis.predictedPrice.month - currentPrice) / currentPrice) * 100 },
              { label: '3 Months', value: analysis.predictedPrice.threeMonth, change: ((analysis.predictedPrice.threeMonth - currentPrice) / currentPrice) * 100 }
            ].map((pred, index) => (
              <motion.div
                key={pred.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700/50 rounded-lg p-4 text-center"
              >
                <p className="text-gray-400 text-xs mb-1">{pred.label}</p>
                <p className="text-white font-bold text-lg">${pred.value.toFixed(2)}</p>
                <p className={`text-sm ${pred.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {pred.change >= 0 ? '+' : ''}{pred.change.toFixed(2)}%
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Target & Stop Loss */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Target Price</p>
                <p className="text-white text-xl font-bold">${analysis.targetPrice.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-green-400 text-sm">
              +{(((analysis.targetPrice - currentPrice) / currentPrice) * 100).toFixed(2)}% upside potential
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Stop Loss</p>
                <p className="text-white text-xl font-bold">${analysis.stopLoss.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-red-400 text-sm">
              {(((analysis.stopLoss - currentPrice) / currentPrice) * 100).toFixed(2)}% downside risk
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Technical Indicators */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Technical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-gray-400 text-sm">RSI (14)</p>
              <p className="text-white font-bold">{analysis.technicalIndicators.rsi}</p>
              <Progress value={analysis.technicalIndicators.rsi} className="h-1 mt-2" />
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-gray-400 text-sm">MACD</p>
              <Badge className={analysis.technicalIndicators.macd === 'Bullish' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                {analysis.technicalIndicators.macd}
              </Badge>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Moving Average</p>
              <p className="text-white font-medium">{analysis.technicalIndicators.movingAverage} MA</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Volume</p>
              <Badge className={
                analysis.technicalIndicators.volume === 'High' ? 'bg-emerald-500/20 text-emerald-400' :
                analysis.technicalIndicators.volume === 'Normal' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }>
                {analysis.technicalIndicators.volume}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fundamentals */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-purple-400" />
            Fundamental Score: {analysis.fundamentals.score}/100
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">P/E Ratio</span>
              <span className="text-white font-medium">{analysis.fundamentals.peRatio.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">P/B Ratio</span>
              <span className="text-white font-medium">{analysis.fundamentals.pbRatio.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Debt to Equity</span>
              <span className="text-white font-medium">{analysis.fundamentals.debtToEquity.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">ROE</span>
              <span className="text-white font-medium">{analysis.fundamentals.roe.toFixed(2)}%</span>
            </div>
            <Progress value={analysis.fundamentals.score} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-cyan-400" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.aiInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <ArrowRight className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">{insight}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-white font-medium">Risk Level</p>
                <p className="text-gray-400 text-sm">Based on volatility and market conditions</p>
              </div>
            </div>
            <Badge className={`${getRiskColor(analysis.riskLevel)} px-4 py-2 text-lg`}>
              {analysis.riskLevel}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
