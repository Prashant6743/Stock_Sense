'use client';

import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, TrendingUp, DollarSign, Target, Settings, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar?: string;
  investmentLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  totalInvestment: number;
  currentValue: number;
  totalReturn: number;
  returnPercentage: number;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  favoriteStocks: string[];
  watchlistCount: number;
  portfolioCount: number;
}

const mockProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  joinDate: '2023-01-15',
  investmentLevel: 'Intermediate',
  totalInvestment: 50000,
  currentValue: 58750,
  totalReturn: 8750,
  returnPercentage: 17.5,
  riskTolerance: 'Moderate',
  favoriteStocks: ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN'],
  watchlistCount: 25,
  portfolioCount: 3,
};

const investmentLevelColors = {
  'Beginner': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Intermediate': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Advanced': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Expert': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const riskToleranceColors = {
  'Conservative': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Moderate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Aggressive': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function ProfileSection() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        <Button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300">
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-24 h-24 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center text-gray-800 text-2xl font-bold mb-4 shadow-lg">
                {mockProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <CardTitle className="text-white">{mockProfile.name}</CardTitle>
              <div className="flex justify-center gap-2 mt-2">
                <Badge className={`border ${investmentLevelColors[mockProfile.investmentLevel]}`}>
                  {mockProfile.investmentLevel}
                </Badge>
                <Badge className={`border ${riskToleranceColors[mockProfile.riskTolerance]}`}>
                  {mockProfile.riskTolerance}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">{mockProfile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-sm">{mockProfile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-red-400" />
                <span className="text-sm">{mockProfile.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span className="text-sm">Joined {formatDate(mockProfile.joinDate)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Portfolio Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Total Investment</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(mockProfile.totalInvestment)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Current Value</p>
                  <p className="text-2xl font-bold text-blue-400">{formatCurrency(mockProfile.currentValue)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Total Return</p>
                  <p className={`text-2xl font-bold ${mockProfile.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {mockProfile.totalReturn >= 0 ? '+' : ''}{formatCurrency(mockProfile.totalReturn)}
                  </p>
                  <p className={`text-sm ${mockProfile.returnPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {mockProfile.returnPercentage >= 0 ? '+' : ''}{mockProfile.returnPercentage}%
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Portfolio Performance</span>
                  <span className="text-green-400 text-sm">+{mockProfile.returnPercentage}%</span>
                </div>
                <Progress 
                  value={Math.min(Math.abs(mockProfile.returnPercentage), 100)} 
                  className="h-2 bg-gray-800"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white mb-1">{mockProfile.watchlistCount}</p>
              <p className="text-gray-400 text-sm">Stocks in Watchlist</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white mb-1">{mockProfile.portfolioCount}</p>
              <p className="text-gray-400 text-sm">Active Portfolios</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white mb-1">{mockProfile.favoriteStocks.length}</p>
              <p className="text-gray-400 text-sm">Favorite Stocks</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Favorite Stocks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Favorite Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {mockProfile.favoriteStocks.map((stock, index) => (
                <motion.div
                  key={stock}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 text-sm hover:bg-blue-500/30 transition-colors cursor-pointer">
                    {stock}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 justify-start">
                Change Password
              </Button>
              <Button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 justify-start">
                Notification Settings
              </Button>
              <Button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 justify-start">
                Privacy Settings
              </Button>
              <Button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 justify-start">
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
