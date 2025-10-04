'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export function DashboardOverview() {
  const [monthly, setMonthly] = useState<number>(5000);
  const [years, setYears] = useState<number>(10);
  const [rate, setRate] = useState<number>(12); // % p.a.

  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { 
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(Math.round(amount));

  const sipData = useMemo(() => {
    const mRate = rate / 12 / 100;
    const months = years * 12;
    let value = 0;
    let invested = 0;

    for (let m = 1; m <= months; m++) {
      invested += monthly;
      value = (value + monthly) * (1 + mRate);
    }

    return {
      invested,
      value,
      returns: Math.max(value - invested, 0),
    };
  }, [monthly, years, rate]);

  return (
    <div className="relative space-y-8 overflow-hidden">
      {/* Animated Stock Graph Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
        >
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
            <linearGradient id="bullishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05"/>
            </linearGradient>
            <linearGradient id="bearishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.05"/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3"/>
            </linearGradient>
            <linearGradient id="volatileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-600"/>
          
          {/* Bullish Stock Lines (Going Up) */}
          <motion.path
            d="M0,350 L50,340 L100,320 L150,300 L200,280 L250,250 L300,220 L350,180 L400,150 L450,120 L500,100 L550,80 L600,60 L650,50 L700,40 L750,30 L800,20"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
          
          <motion.path
            d="M0,320 L80,310 L160,290 L240,260 L320,220 L400,180 L480,140 L560,110 L640,90 L720,70 L800,50"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
          />
          
          {/* Bearish Stock Lines (Going Down) */}
          <motion.path
            d="M0,100 L50,120 L100,140 L150,170 L200,200 L250,240 L300,280 L350,320 L400,350 L450,370 L500,380 L550,385 L600,390 L650,392 L700,394 L750,396 L800,398"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
          />
          
          <motion.path
            d="M0,150 L70,170 L140,200 L210,240 L280,290 L350,340 L420,380 L490,390 L560,395 L630,397 L700,398 L800,399"
            fill="none"
            stroke="#dc2626"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 3.8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1.2 }}
          />
          
          {/* Volatile/Sideways Movement */}
          <motion.path
            d="M0,250 L60,240 L120,260 L180,245 L240,255 L300,240 L360,250 L420,245 L480,255 L540,248 L600,252 L660,247 L720,253 L800,250"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          />
          
          {/* Sharp Recovery Pattern */}
          <motion.path
            d="M0,380 L100,375 L200,370 L300,350 L350,320 L380,280 L400,240 L420,200 L450,160 L500,130 L600,110 L700,95 L800,85"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
          />
          
          {/* Bullish Area Fill */}
          <motion.path
            d="M0,350 L50,340 L100,320 L150,300 L200,280 L250,250 L300,220 L350,180 L400,150 L450,120 L500,100 L550,80 L600,60 L650,50 L700,40 L750,30 L800,20 L800,400 L0,400 Z"
            fill="url(#bullishGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
          
          {/* Bearish Area Fill */}
          <motion.path
            d="M0,100 L50,120 L100,140 L150,170 L200,200 L250,240 L300,280 L350,320 L400,350 L450,370 L500,380 L550,385 L600,390 L650,392 L700,394 L750,396 L800,398 L800,0 L0,0 Z"
            fill="url(#bearishGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
          />
          
          {/* Volatile Area Fill */}
          <motion.path
            d="M0,250 L60,240 L120,260 L180,245 L240,255 L300,240 L360,250 L420,245 L480,255 L540,248 L600,252 L660,247 L720,253 L800,250 L800,400 L0,400 Z"
            fill="url(#volatileGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          />
          
          {/* Floating Data Points */}
          {[...Array(12)].map((_, i) => (
            <motion.circle
              key={i}
              cx={50 + i * 60}
              cy={150 + Math.sin(i) * 50}
              r="2"
              fill="#10b981"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Floating Stock Tickers with Up/Down Indicators */}
          {[
            { ticker: 'AAPL', trend: 'up', color: '#10b981' },
            { ticker: 'GOOGL', trend: 'up', color: '#22c55e' },
            { ticker: 'MSFT', trend: 'down', color: '#ef4444' },
            { ticker: 'TSLA', trend: 'up', color: '#10b981' },
            { ticker: 'AMZN', trend: 'down', color: '#dc2626' },
            { ticker: 'NFLX', trend: 'volatile', color: '#06b6d4' }
          ].map((stock, i) => (
            <g key={stock.ticker}>
              <motion.text
                x={100 + i * 120}
                y={80 + Math.sin(i * 0.5) * 30}
                fontSize="8"
                fill={stock.color}
                textAnchor="middle"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.4, 0],
                  y: [0, stock.trend === 'up' ? -25 : stock.trend === 'down' ? 25 : -10, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut"
                }}
              >
                {stock.ticker}
              </motion.text>
              
              {/* Trend Arrow */}
              <motion.text
                x={100 + i * 120}
                y={90 + Math.sin(i * 0.5) * 30}
                fontSize="6"
                fill={stock.color}
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.8 + 0.2,
                  ease: "easeInOut"
                }}
              >
                {stock.trend === 'up' ? '↗' : stock.trend === 'down' ? '↘' : '↔'}
              </motion.text>
            </g>
          ))}
        </svg>
      </div>

      {/* Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none"></div>

      {/* Keep only Market News and SIP Calculator on the dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Market News */}
        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800/50 shadow-2xl hover:bg-gray-900/90 hover:border-gray-700/70 hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 ease-out group">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">N</span>
              </div>
              Market News
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Fed Signals Rate Cut Ahead', time: '2h ago', category: 'Economy' },
              { title: 'Tech Stocks Rally Continues', time: '4h ago', category: 'Markets' },
              { title: 'Oil Prices Surge 3%', time: '6h ago', category: 'Commodities' }
            ].map((news, index) => (
              <div key={index} className="p-3 rounded-lg hover:bg-gray-800/70 hover:border hover:border-gray-700/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer group">
                <p className="text-white text-sm font-medium mb-1 group-hover:text-cyan-300 transition-colors">{news.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{news.time}</span>
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full group-hover:bg-cyan-500/30 group-hover:text-cyan-300 transition-all">{news.category}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SIP Calculator */}
        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800/50 shadow-2xl hover:bg-gray-900/90 hover:border-gray-700/70 hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 ease-out group">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">₹</span>
                </div>
                SIP Calculator
              </div>
              <span className="text-xs text-gray-400">Compounded monthly</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-gray-300">Monthly Investment (₹)</Label>
                  <div>
                    <Input
                      type="number"
                      min={500}
                      step={500}
                      value={Math.round(monthly)}
                      onChange={(e) => setMonthly(Math.max(500, Number(e.target.value || 500)))}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700/80 hover:border-gray-600 hover:shadow-md focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Slider
                      value={[Math.min(Math.max(monthly, 500), 100000)]}
                      min={500}
                      max={100000}
                      step={500}
                      onValueChange={([v]) => setMonthly(v)}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>₹500</span>
                      <span>₹1,00,000</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300">Time Period (Years)</Label>
                  <div>
                    <Input
                      type="number"
                      min={1}
                      max={40}
                      value={years}
                      onChange={(e) => setYears(Math.min(40, Math.max(1, Number(e.target.value || 1))))}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700/80 hover:border-gray-600 hover:shadow-md focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Slider value={[years]} min={1} max={40} step={1} onValueChange={([v]) => setYears(v)} />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1 year</span>
                      <span>40 years</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300">Expected Return (%)</Label>
                  <div>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      step={0.1}
                      value={Number(rate.toFixed(1))}
                      onChange={(e) => setRate(Math.min(30, Math.max(1, Number(e.target.value || 1))))}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700/80 hover:border-gray-600 hover:shadow-md focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Slider value={[rate]} min={1} max={30} step={0.1} onValueChange={([v]) => setRate(v)} />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 group">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <p className="text-gray-400 text-sm mb-2 group-hover:text-gray-300 transition-colors">Invested Amount</p>
                    <p className="text-white text-xl font-bold group-hover:text-purple-300 transition-colors">{formatINR(sipData.invested)}</p>
                  </div>
                  <div className="text-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <p className="text-gray-400 text-sm mb-2 group-hover:text-gray-300 transition-colors">Estimated Value</p>
                    <p className="text-white text-xl font-bold group-hover:text-purple-300 transition-colors">{formatINR(sipData.value)}</p>
                  </div>
                  <div className="text-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <p className="text-gray-400 text-sm mb-2 group-hover:text-gray-300 transition-colors">Wealth Gained</p>
                    <p className="text-emerald-400 text-xl font-bold group-hover:text-emerald-300 transition-colors">{formatINR(sipData.returns)}</p>
                  </div>
                  <div className="text-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <p className="text-gray-400 text-sm mb-2 group-hover:text-gray-300 transition-colors">Return Rate</p>
                    <p className="text-white text-xl font-bold group-hover:text-purple-300 transition-colors">{rate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Note: This is an illustrative projection using constant returns. Actual results will vary based on market conditions.
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

