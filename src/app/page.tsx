"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/icons";
import { SplashScreen } from "@/components/splash-screen";
import { LandingPage } from "@/components/landing-page";
import { SignUpPage } from "@/components/signup-page";
import { AppHeader } from "@/components/app-header";
import { NewsSection } from "@/components/news-section";
import { EventsSection } from "@/components/events-section";
import { ProfileSection } from "@/components/profile-section";
import { Chatbot } from "@/components/chatbot";
import { DashboardOverview } from "@/components/dashboard-overview";
import { EnhancedStockAnalyzer } from "@/components/enhanced-stock-analyzer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal } from "lucide-react";

type PageView = 'splash' | 'landing' | 'signup' | 'app';
type AppView = 'dashboard' | 'events' | 'news' | 'profile';

export default function Home() {
  const [currentView, setCurrentView] = useState<PageView>('splash');
  const [currentAppView, setCurrentAppView] = useState<AppView>('dashboard');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('John Doe');

  const handleSplashComplete = () => {
    setCurrentView('landing');
  };

  const handleGetStarted = () => {
    setCurrentView('app');
    setIsSignedIn(true);
  };

  const handleSignUp = (data: { name: string; email: string; password: string; phone?: string }) => {
    console.log('Sign up data:', data);
    setUserName(data.name);
    setIsSignedIn(true);
    setCurrentView('app');
  };

  const handleSignIn = () => {
    setIsSignedIn(true);
    setCurrentView('app');
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setCurrentView('landing');
  };

  const handleHeaderSearch = (query: string) => {
    // Navigate to dashboard - the enhanced analyzer will handle the search
    setCurrentAppView('dashboard');
  };

  // Render different views based on current state
  if (currentView === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentView === 'landing') {
    return (
      <LandingPage
        onGetStarted={handleGetStarted}
        onSignUp={() => setCurrentView('signup')}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <SignUpPage
        onBack={() => setCurrentView('landing')}
        onSignUp={handleSignUp}
      />
    );
  }

  // Main app view
  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader
        onSearch={handleHeaderSearch}
        currentView={currentAppView}
        onViewChange={setCurrentAppView}
        isSignedIn={isSignedIn}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        userName={userName}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentAppView === 'dashboard' && (
          <div className="space-y-8">
            {/* Dashboard Overview */}
            <DashboardOverview />
            
            {/* Enhanced Stock Analyzer */}
            <EnhancedStockAnalyzer />
          </div>
        )}

        {currentAppView === 'news' && <NewsSection />}
        {currentAppView === 'events' && <EventsSection />}
        {currentAppView === 'profile' && <ProfileSection />}
      </main>

      <Chatbot />
      
      <footer className="bg-gray-900/50 border-t border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            Disclaimer: Stock Sense is for informational purposes only and does not constitute financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

