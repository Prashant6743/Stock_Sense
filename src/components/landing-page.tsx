'use client';

import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Zap, Brain, ChevronDown, Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignUp: () => void;
}

export function LandingPage({ onGetStarted, onSignUp }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze market patterns and predict stock movements with unprecedented accuracy."
    },
    {
      icon: TrendingUp,
      title: "Real-Time Insights",
      description: "Get instant market data, live price updates, and personalized investment recommendations powered by cutting-edge technology."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-grade security with encrypted data transmission and secure API integrations for your peace of mind."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Execute trades and access market data in milliseconds with our optimized infrastructure and real-time processing."
    }
  ];

  const stats = [
    { value: "10M+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "$50B+", label: "Assets Tracked" },
    { value: "150+", label: "Markets Covered" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Enhanced 3D Web3 Background */}
      <div className="fixed inset-0 z-0">
        {/* Dynamic Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
        
        {/* 3D Gradient Orbs with Enhanced Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-emerald-500/15 rounded-full blur-3xl" 
             style={{ 
               animation: 'pulse 8s ease-in-out infinite',
               boxShadow: '0 0 100px rgba(6, 182, 212, 0.1)'
             }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/12 to-red-500/12 rounded-full blur-3xl" 
             style={{ 
               animation: 'pulse 12s ease-in-out infinite', 
               animationDelay: '4s',
               boxShadow: '0 0 100px rgba(249, 115, 22, 0.1)'
             }} />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl" 
             style={{ 
               animation: 'pulse 10s ease-in-out infinite', 
               animationDelay: '2s',
               boxShadow: '0 0 80px rgba(20, 184, 166, 0.1)'
             }} />
        
        {/* 3D Geometric Shapes */}
        <div className="absolute top-1/3 left-1/2 w-32 h-32 border border-cyan-500/20 rotate-45 animate-spin" 
             style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 border border-emerald-500/20 rotate-12 animate-pulse" />
        <div className="absolute top-2/3 right-1/3 w-20 h-20 border border-orange-500/20 -rotate-12" 
             style={{ animation: 'bounce 3s ease-in-out infinite' }} />
        
        {/* Cool Floating Elements - Much slower */}
        {[...Array(8)].map((_, i) => {
          const colors = ['bg-cyan-400/30', 'bg-emerald-400/30', 'bg-orange-400/30', 'bg-red-400/30', 'bg-teal-400/30'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          return (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${randomColor} rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="bg-white p-2 rounded-lg">
            <Logo className="h-8 w-8 text-black" />
          </div>
          <span className="text-2xl font-bold text-white">
            Stock Sense
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-cyan-500/20 transition-all duration-300"
            onClick={onGetStarted}
          >
            Sign In
          </Button>
          <Button 
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-teal-500/25 transition-all duration-300 transform hover:scale-105"
            onClick={onSignUp}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-8 py-20 md:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <Star className="h-4 w-4 text-white" />
              <span className="text-sm text-gray-300">Trusted by 10M+ investors worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-white">
                The Future of
              </span>
              <br />
              <span className="text-white">
                Smart Investing
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Harness the power of AI to make smarter investment decisions. 
              Real-time analysis, predictive insights, and personalized recommendations 
              all in one revolutionary platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white border-0 px-8 py-4 text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              onClick={onSignUp}
            >
              Start Investing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 px-8 py-4 text-lg shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats with 3D Effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl group-hover:shadow-white/10 transition-all duration-300"
                     style={{
                       boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                     }}>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 3D Stock Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="flex justify-center items-center gap-8 overflow-hidden">
            {['AAPL $255.45 +0.32%', 'GOOGL $2847.52 -0.43%', 'TSLA $248.98 +6.72%', 'MSFT $428.73 +0.57%'].map((stock, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3 shadow-2xl"
                style={{
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                  transformStyle: "preserve-3d"
                }}
                animate={{
                  rotateX: [0, 5, 0],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5
                }}
                whileHover={{
                  scale: 1.1,
                  rotateY: 10,
                  z: 30
                }}
              >
                <span className="text-white font-mono text-sm whitespace-nowrap">
                  {stock}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 md:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Choose Stock Sense?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the next generation of investment technology with features designed for the modern investor.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300 group shadow-2xl hover:shadow-white/10"
                style={{
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                  transformStyle: "preserve-3d"
                }}
                whileHover={{
                  scale: 1.02,
                  rotateY: 5,
                  z: 20
                }}
              >
                <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                  <feature.icon className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 md:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center bg-white/5 border border-white/20 rounded-3xl p-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Investments?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join millions of smart investors who trust Stock Sense for their financial future. 
            Start your journey today with our AI-powered platform.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 px-12 py-4 text-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
            onClick={onSignUp}
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 px-6 md:px-8 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-white p-2 rounded-lg">
              <Logo className="h-6 w-6 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Stock Sense</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Stock Sense. All rights reserved. | 
            Empowering investors with AI-driven insights.
          </p>
        </div>
      </footer>
    </div>
  );
}
