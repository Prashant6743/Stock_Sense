"use client";

import { useState, useEffect } from "react";
import type { StockInfoPayload } from "@/app/actions";
import { fetchStockInfo } from "@/app/actions";
import { Logo } from "@/components/icons";
import { RecentSearches } from "@/components/recent-searches";
import { StockDisplay } from "@/components/stock-display";
import { StockSearchForm } from "@/components/stock-search-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal } from "lucide-react";

export default function Home() {
  const [stockInfo, setStockInfo] = useState<StockInfoPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [currentTicker, setCurrentTicker] = useState<string | null>(null);

  useEffect(() => {
    try {
      const items = window.localStorage.getItem("stock-sense-recent");
      if (items) {
        setRecentSearches(JSON.parse(items));
      }
    } catch (error) {
      console.error("Failed to parse recent searches from localStorage", error);
    }
  }, []);

  const handleSearch = async (ticker: string) => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setStockInfo(null);
    setCurrentTicker(ticker.toUpperCase());

    const result = await fetchStockInfo({ ticker });

    if (result.error) {
      setError(result.error);
    } else {
      setStockInfo(result as StockInfoPayload);
      const newRecent = [
        ticker.toUpperCase(),
        ...recentSearches.filter((t) => t !== ticker.toUpperCase()),
      ].slice(0, 5);
      setRecentSearches(newRecent);
      try {
        window.localStorage.setItem(
          "stock-sense-recent",
          JSON.stringify(newRecent)
        );
      } catch (error) {
        console.error(
          "Failed to save recent searches to localStorage",
          error
        );
      }
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex flex-col items-center text-center space-y-2">
          <Logo className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold tracking-tighter text-primary font-headline">
            Stock Sense
          </h1>
          <p className="text-muted-foreground max-w-md">
            Enter a stock ticker to get AI-powered analysis and price
            prediction.
          </p>
        </header>

        <StockSearchForm onSubmit={handleSearch} loading={loading} />

        <RecentSearches
          searches={recentSearches}
          onSearch={handleSearch}
          currentTicker={currentTicker}
        />

        <div className="min-h-[400px]">
          {loading && <LoadingSkeleton />}
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {stockInfo && currentTicker && (
            <StockDisplay data={stockInfo} ticker={currentTicker} />
          )}
          {!loading && !error && !stockInfo && <InitialState />}
        </div>
        <footer className="text-center text-sm text-muted-foreground pt-8">
          <p>
            Disclaimer: Stock Sense is for informational purposes only and does
            not constitute financial advice.
          </p>
        </footer>
      </div>
    </main>
  );
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  </div>
);

const InitialState = () => (
  <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
       <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line></svg>
    </div>
    <h3 className="text-xl font-semibold text-primary mb-1">
      Ready for Analysis
    </h3>
    <p className="text-muted-foreground">
      Your stock insights will appear here.
    </p>
  </div>
);
