'use client';

import { motion } from 'framer-motion';
import { Clock, TrendingUp, ExternalLink, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'market' | 'stock' | 'crypto' | 'economy';
  timestamp: string;
  source: string;
  imageUrl?: string;
  trending?: boolean;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Apple Stock Surges After Strong Q4 Earnings Report',
    summary: 'Apple Inc. reported better-than-expected earnings for Q4, with iPhone sales showing strong growth in emerging markets. The company also announced new AI features coming to iOS.',
    category: 'stock',
    timestamp: '2 hours ago',
    source: 'MarketWatch',
    trending: true,
  },
  {
    id: '2',
    title: 'Federal Reserve Signals Potential Rate Cut in December',
    summary: 'Fed officials hint at possible interest rate reduction following recent inflation data showing cooling price pressures. Markets rally on dovish commentary.',
    category: 'economy',
    timestamp: '4 hours ago',
    source: 'Reuters',
    trending: true,
  },
  {
    id: '3',
    title: 'Tesla Announces New Gigafactory in Southeast Asia',
    summary: 'Electric vehicle manufacturer Tesla reveals plans for a new production facility to meet growing Asian demand. The facility will focus on Model 3 and Model Y production.',
    category: 'stock',
    timestamp: '6 hours ago',
    source: 'Bloomberg',
  },
  {
    id: '4',
    title: 'Cryptocurrency Market Shows Signs of Recovery',
    summary: 'Bitcoin and major altcoins gain momentum as institutional investors show renewed interest in digital assets. ETF approvals drive mainstream adoption.',
    category: 'crypto',
    timestamp: '8 hours ago',
    source: 'CoinDesk',
  },
  {
    id: '5',
    title: 'S&P 500 Reaches New All-Time High',
    summary: 'Major stock indices continue their upward trajectory driven by strong corporate earnings and economic optimism. Tech sector leads the rally.',
    category: 'market',
    timestamp: '1 day ago',
    source: 'CNBC',
  },
  {
    id: '6',
    title: 'Indian Markets Hit Record Highs on FII Inflows',
    summary: 'Nifty 50 and Sensex reach new peaks as foreign institutional investors pour money into Indian equities. Banking and IT sectors lead gains.',
    category: 'market',
    timestamp: '3 hours ago',
    source: 'Economic Times',
    trending: true,
  },
  {
    id: '7',
    title: 'Reliance Industries Q3 Results Beat Estimates',
    summary: 'RIL reports strong quarterly numbers driven by petrochemicals and retail business growth. Jio subscriber base crosses 450 million.',
    category: 'stock',
    timestamp: '5 hours ago',
    source: 'Business Standard',
  },
  {
    id: '8',
    title: 'Gold Prices Fall on Strong Dollar',
    summary: 'Precious metals decline as US dollar strengthens ahead of Fed meeting. Silver also under pressure from industrial demand concerns.',
    category: 'market',
    timestamp: '7 hours ago',
    source: 'Reuters',
  },
];

const categoryColors = {
  market: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  stock: 'bg-green-500/20 text-green-400 border-green-500/30',
  crypto: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  economy: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export function NewsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Latest News</h2>
        <Button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300">
          View All News
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockNews.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs px-2 py-1 border ${categoryColors[news.category]}`}>
                        {news.category.toUpperCase()}
                      </Badge>
                      {news.trending && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs px-2 py-1 border flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {news.title}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {news.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {news.timestamp}
                    </div>
                    <span>•</span>
                    <span>{news.source}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">📊</span>
              </div>
              Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Today's Market Sentiment</h4>
              <p className="text-emerald-400 text-2xl font-bold">Bullish 📈</p>
              <p className="text-gray-400 text-sm">85% of stocks trading above 20-day MA</p>
            </div>
            <div className="space-y-3">
              {[
                { metric: 'Fear & Greed Index', value: '72', status: 'Greed', color: 'text-orange-400' },
                { metric: 'VIX Level', value: '14.2', status: 'Low Volatility', color: 'text-green-400' },
                { metric: 'Put/Call Ratio', value: '0.85', status: 'Neutral', color: 'text-cyan-400' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">{item.metric}</p>
                    <p className="text-gray-400 text-xs">{item.status}</p>
                  </div>
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">🎓</span>
              </div>
              Investment Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { 
                title: 'Understanding Market Volatility', 
                description: 'Learn how to navigate market ups and downs',
                difficulty: 'Beginner',
                duration: '8 min read',
                color: 'bg-emerald-500/20 text-emerald-400'
              },
              { 
                title: 'Diversification Strategies', 
                description: 'Build a balanced investment portfolio',
                difficulty: 'Intermediate',
                duration: '12 min read',
                color: 'bg-orange-500/20 text-orange-400'
              },
              { 
                title: 'Options Trading Basics', 
                description: 'Introduction to derivatives and hedging',
                difficulty: 'Advanced',
                duration: '15 min read',
                color: 'bg-red-500/20 text-red-400'
              }
            ].map((course, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium text-sm">{course.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${course.color}`}>
                    {course.difficulty}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-2">{course.description}</p>
                <p className="text-gray-500 text-xs">{course.duration}</p>
              </div>
            ))}
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white mt-4">
              View All Courses
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Trending Topics */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-400" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['Apple Earnings', 'Fed Rate Cut', 'Tesla Gigafactory', 'Bitcoin Rally', 'S&P 500 High', 'Indian Markets', 'RIL Results', 'Gold Prices'].map((topic, index) => (
              <motion.button
                key={topic}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="px-3 py-1 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-cyan-500/20 hover:to-emerald-500/20 text-gray-300 hover:text-white text-sm rounded-full transition-all duration-200 border border-gray-700 hover:border-cyan-500/30"
              >
                #{topic.replace(' ', '')}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
