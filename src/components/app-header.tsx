'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, Menu, X, TrendingUp, Calendar, Newspaper, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/icons';

interface AppHeaderProps {
  onSearch: (query: string) => void;
  currentView: 'dashboard' | 'events' | 'news' | 'profile';
  onViewChange: (view: 'dashboard' | 'events' | 'news' | 'profile') => void;
  isSignedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  userName: string;
}

export function AppHeader({
  onSearch,
  currentView,
  onViewChange,
  isSignedIn,
  onSignIn,
  onSignOut,
  userName,
}: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <Logo className="h-8 w-8 text-blue-400" />
              <h1 className="text-xl font-bold text-white">Stock Sense</h1>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onViewChange(item.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-white text-gray-800 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 focus:text-gray-800'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700 focus:bg-gray-800 focus:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search stocks (e.g., AAPL, GOOGL, TSLA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-700/80 hover:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                    3
                  </Badge>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-gray-900 border-gray-700">
                <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <div className="max-h-96 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start p-4 hover:bg-gray-800 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">📊</span>
                      <span className="text-white font-medium">Apple Q4 Earnings</span>
                      <span className="text-xs text-gray-400 ml-auto">2h ago</span>
                    </div>
                    <p className="text-sm text-gray-400">Earnings call scheduled for today at 5:00 PM EST</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-4 hover:bg-gray-800 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">📢</span>
                      <span className="text-white font-medium">Fed Rate Decision</span>
                      <span className="text-xs text-gray-400 ml-auto">4h ago</span>
                    </div>
                    <p className="text-sm text-gray-400">Interest rate announcement tomorrow at 2:00 PM EST</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-4 hover:bg-gray-800 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🚀</span>
                      <span className="text-white font-medium">Tesla Investor Day</span>
                      <span className="text-xs text-gray-400 ml-auto">1d ago</span>
                    </div>
                    <p className="text-sm text-gray-400">Don't miss Tesla's latest innovations presentation</p>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="text-center text-blue-400 hover:text-blue-300 cursor-pointer">
                  View All Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile/Sign In */}
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-all duration-200">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-800 text-sm font-bold shadow-lg">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-white">{userName}</p>
                      <p className="text-xs text-gray-400">Premium User</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
                  <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={() => onViewChange('profile')}
                    className="text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={onSignOut}
                    className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={onSignIn}
                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-800 py-4"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => {
                      onViewChange(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-white text-gray-800 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 focus:text-gray-800'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700 focus:bg-gray-800 focus:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
