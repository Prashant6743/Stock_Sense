'use client';

import { Button } from '@/components/ui/button';

interface RecentSearchesProps {
  searches: string[];
  onSearch: (ticker: string) => void;
  currentTicker: string | null;
}

export function RecentSearches({ searches, onSearch, currentTicker }: RecentSearchesProps) {
  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Recent:</span>
      {searches.map((ticker) => (
        <Button
          key={ticker}
          variant={currentTicker === ticker ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSearch(ticker)}
          className="rounded-full"
        >
          {ticker}
        </Button>
      ))}
    </div>
  );
}
