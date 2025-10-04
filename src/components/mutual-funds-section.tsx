'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Star, Shield, Zap, Calculator, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MutualFund {
  id: string;
  name: string;
  category: string;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  expense: number;
  rating: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  minSIP: number;
  aum: string;
}

const topFunds: MutualFund[] = [
  {
    id: '1',
    name: 'Axis Bluechip Fund',
    category: 'Large Cap',
    returns1Y: 18.5,
    returns3Y: 15.2,
    returns5Y: 12.8,
    expense: 1.8,
    rating: 5,
    riskLevel: 'Moderate',
    minSIP: 500,
    aum: '₹45,230 Cr'
  },
  {
    id: '2',
    name: 'Mirae Asset Emerging Bluechip',
    category: 'Large & Mid Cap',
    returns1Y: 22.3,
    returns3Y: 18.7,
    returns5Y: 16.4,
    expense: 2.1,
    rating: 4,
    riskLevel: 'Moderate',
    minSIP: 1000,
    aum: '₹28,450 Cr'
  },
  {
    id: '3',
    name: 'Parag Parikh Flexi Cap',
    category: 'Flexi Cap',
    returns1Y: 25.8,
    returns3Y: 20.1,
    returns5Y: 18.9,
    expense: 1.5,
    rating: 5,
    riskLevel: 'High',
    minSIP: 1000,
    aum: '₹52,180 Cr'
  },
  {
    id: '4',
    name: 'SBI Small Cap Fund',
    category: 'Small Cap',
    returns1Y: 28.4,
    returns3Y: 22.6,
    returns5Y: 19.8,
    expense: 2.3,
    rating: 4,
    riskLevel: 'High',
    minSIP: 500,
    aum: '₹18,920 Cr'
  }
];

const categories = [
  { name: 'Large Cap', funds: 156, avgReturn: '12.5%', risk: 'Low', color: 'from-emerald-500 to-teal-500' },
  { name: 'Mid Cap', funds: 89, avgReturn: '15.8%', risk: 'Moderate', color: 'from-cyan-500 to-blue-500' },
  { name: 'Small Cap', funds: 67, avgReturn: '18.2%', risk: 'High', color: 'from-orange-500 to-red-500' },
  { name: 'ELSS', funds: 45, avgReturn: '14.1%', risk: 'Moderate', color: 'from-purple-500 to-pink-500' },
  { name: 'Debt', funds: 234, avgReturn: '7.8%', risk: 'Low', color: 'from-teal-500 to-cyan-500' },
  { name: 'Hybrid', funds: 123, avgReturn: '10.4%', risk: 'Low', color: 'from-indigo-500 to-purple-500' }
];

export function MutualFundsSection() {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Mutual Funds</h2>
        <Button className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white">
          Explore All Funds
        </Button>
      </div>

      {/* Fund Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{category.name}</h3>
                <p className="text-gray-400 text-xs mb-2">{category.funds} Funds</p>
                <p className="text-emerald-400 font-bold text-sm">{category.avgReturn}</p>
                <Badge className={`text-xs mt-2 ${getRiskColor(category.risk)}`}>
                  {category.risk} Risk
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Top Performing Funds */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Top Performing Funds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFunds.map((fund, index) => (
              <motion.div
                key={fund.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{fund.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                        {fund.category}
                      </Badge>
                      <Badge className={`text-xs ${getRiskColor(fund.riskLevel)}`}>
                        {fund.riskLevel} Risk
                      </Badge>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < fund.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">AUM: {fund.aum}</p>
                    <p className="text-gray-400 text-sm">Min SIP: ₹{fund.minSIP}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">1Y Return</p>
                    <p className="text-emerald-400 font-bold">{fund.returns1Y}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">3Y Return</p>
                    <p className="text-emerald-400 font-bold">{fund.returns3Y}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">5Y Return</p>
                    <p className="text-emerald-400 font-bold">{fund.returns5Y}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">Expense</p>
                    <p className="text-orange-400 font-bold">{fund.expense}%</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                    Start SIP
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                    Lumpsum
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800">
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-400" />
              SIP Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Monthly SIP of ₹5,000</p>
                <p className="text-white text-2xl font-bold">₹10,32,000</p>
                <p className="text-emerald-400 text-sm">in 10 years @ 12% returns</p>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Calculate Returns
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Tax Saving (ELSS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Save up to</p>
                <p className="text-white text-2xl font-bold">₹46,800</p>
                <p className="text-emerald-400 text-sm">in taxes annually</p>
              </div>
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                Explore ELSS
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-400" />
              Learn MF Basics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'What are Mutual Funds?',
                'SIP vs Lumpsum',
                'How to choose funds?'
              ].map((topic, index) => (
                <div key={index} className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <p className="text-white text-sm">{topic}</p>
                </div>
              ))}
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Start Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
