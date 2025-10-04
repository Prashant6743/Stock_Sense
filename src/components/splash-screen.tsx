'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/icons';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(true), 500);
    const textTimer = setTimeout(() => setShowText(true), 1500);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearTimeout(textTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          {/* Cool Floating Orbs - Slower */}
          {[...Array(4)].map((_, i) => {
            const colors = [
              'bg-gradient-to-r from-cyan-500/15 to-emerald-500/15',
              'bg-gradient-to-r from-orange-500/12 to-red-500/12',
              'bg-gradient-to-r from-teal-500/10 to-cyan-500/10',
              'bg-gradient-to-r from-emerald-500/8 to-teal-500/8'
            ];
            return (
              <motion.div
                key={i}
                className={`absolute rounded-full ${colors[i]} blur-xl`}
                style={{
                  width: Math.random() * 150 + 80,
                  height: Math.random() * 150 + 80,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 50 - 25],
                  y: [0, Math.random() * 50 - 25],
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: 8 + Math.random() * 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
          
          {/* Particle Effect */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Animation */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  duration: 1 
                }}
                className="relative mb-8"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl opacity-30 scale-150" />
                
                {/* Logo Container */}
                <div className="relative bg-white p-6 rounded-full">
                  <Logo className="h-16 w-16 text-black" />
                </div>

                {/* Rotating Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-transparent border-t-white/40 border-r-white/20 rounded-full scale-125"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text Animation */}
          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <motion.h1
                  className="text-5xl md:text-6xl font-bold mb-4 text-white"
                >
                  Stock Sense
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xl text-gray-400 font-light"
                >
                  AI-Powered Investment Intelligence
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="w-80 max-w-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Loading</span>
              <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            
            {/* Loading Text */}
            <motion.p
              className="text-center text-xs text-gray-500 mt-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Initializing AI systems...
            </motion.p>
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-blue-500/30" />
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-purple-500/30" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-500/30" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-blue-500/30" />
      </motion.div>
    </AnimatePresence>
  );
}
