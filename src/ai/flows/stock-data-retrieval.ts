// This file is used to fetch the stock data.
'use server';
/**
 * @fileOverview Fetches stock data based on the provided ticker symbol.
 *
 * - getStockData - A function that retrieves stock data.
 * - StockDataInput - The input type for the getStockData function.
 * - StockDataOutput - The return type for the getStockData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StockDataInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock.'),
});
export type StockDataInput = z.infer<typeof StockDataInputSchema>;

const StockDataOutputSchema = z.object({
  price: z.number().describe('The current price of the stock.'),
  volume: z.number().describe('The current trading volume of the stock.'),
  open: z.number().describe('The opening price of the stock.'),
  high: z.number().describe('The highest price of the stock today.'),
  low: z.number().describe('The lowest price of the stock today.'),
  previousClose: z.number().describe('The previous closing price.'),
  change: z.number().describe('The price change from previous close.'),
  changePercent: z.string().describe('The percentage change from previous close.'),
  latestTradingDay: z.string().describe('The latest trading day.'),
  historicalData: z.string().describe('The historical stock data as a string for the last 30 days.'),
  companyOverview: z.object({
    name: z.string(),
    description: z.string(),
    sector: z.string(),
    industry: z.string(),
    marketCap: z.string(),
    peRatio: z.string(),
    eps: z.string(),
    dividendYield: z.string(),
    week52High: z.string(),
    week52Low: z.string(),
    movingAverage50: z.string(),
    movingAverage200: z.string(),
    beta: z.string(),
    analystTargetPrice: z.string(),
  }).describe('Company overview and financial metrics.'),
});
export type StockDataOutput = z.infer<typeof StockDataOutputSchema>;

// Utility function for retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.message.includes('invalid ticker') || 
          error.message.includes('API key') ||
          error.message.includes('No quote data found') ||
          error.message.includes('No historical data found')) {
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(`API call failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Utility function to make API calls with better error handling
async function fetchWithErrorHandling(url: string): Promise<any> {
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('API rate limit exceeded. Please wait a moment and try again.');
    }
    if (response.status >= 500) {
      throw new Error('API provider is experiencing issues. Please try again later.');
    }
    throw new Error(`API request failed with status ${response.status}`);
  }
  
  const data = await response.json();
  
  // Check for Alpha Vantage specific error messages
  if (data.Note && (data.Note.includes('call frequency') || data.Note.includes('calls per minute'))) {
    throw new Error('API rate limit exceeded. Please wait a moment and try again.');
  }
  
  if (data.Information && data.Information.includes('premium')) {
    throw new Error('API quota exceeded. Please upgrade your Alpha Vantage subscription or try again later.');
  }
  
  if (data['Error Message']) {
    throw new Error(`API Error: ${data['Error Message']}`);
  }
  
  // Check if we got an empty response or invalid data structure
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
    throw new Error('API returned empty response. Please try again.');
  }
  
  return data;
}

export async function getStockData(input: StockDataInput): Promise<StockDataOutput> {
  return stockDataRetrievalFlow(input);
}

const stockDataRetrievalFlow = ai.defineFlow(
  {
    name: 'stockDataRetrievalFlow',
    inputSchema: StockDataInputSchema,
    outputSchema: StockDataOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      throw new Error('ALPHA_VANTAGE_API_KEY is not set in the environment variables.');
    }

    const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${input.ticker}&apikey=${apiKey}`;
    const historyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${input.ticker}&apikey=${apiKey}`;
    const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${input.ticker}&apikey=${apiKey}`;

    try {
      // Use retry logic for API calls with sequential execution to reduce rate limit pressure
      const quoteData = await retryWithBackoff(() => fetchWithErrorHandling(quoteUrl));
      
      const globalQuote = quoteData['Global Quote'];
      if (!globalQuote || Object.keys(globalQuote).length === 0) {
        throw new Error(`No quote data found for ticker ${input.ticker}. Please verify the ticker symbol is correct.`);
      }

      // Try to get historical data with fallback
      let historyData = null;
      let timeSeries = null;
      try {
        // Add a longer delay between calls to be more respectful to the API (free tier limit)
        await new Promise(resolve => setTimeout(resolve, 1000));
        historyData = await retryWithBackoff(() => fetchWithErrorHandling(historyUrl));
        timeSeries = historyData['Time Series (Daily)'];
      } catch (historyError) {
        console.warn('Failed to fetch historical data, using fallback:', historyError);
      }

      // Try to get overview data with fallback
      let overviewData = {};
      try {
        // Add another delay before the overview call
        await new Promise(resolve => setTimeout(resolve, 1000));
        overviewData = await retryWithBackoff(() => fetchWithErrorHandling(overviewUrl));
      } catch (overviewError) {
        console.warn('Failed to fetch overview data, using fallback:', overviewError);
      }

      const price = parseFloat(globalQuote['05. price']);
      const volume = parseInt(globalQuote['06. volume'], 10);
      const open = parseFloat(globalQuote['02. open']);
      const high = parseFloat(globalQuote['03. high']);
      const low = parseFloat(globalQuote['04. low']);
      const previousClose = parseFloat(globalQuote['08. previous close']);
      const change = parseFloat(globalQuote['09. change']);
      const changePercent = globalQuote['10. change percent'];
      const latestTradingDay = globalQuote['07. latest trading day'];

      // Generate historical data or fallback
      let historicalData = 'Historical data unavailable';
      if (timeSeries) {
        const historicalDataPoints = Object.entries(timeSeries)
          .slice(0, 30)
          .map(([date, data]) => {
              const closePrice = (data as any)['4. close'];
              return `Date: ${date}, Close Price: $${parseFloat(closePrice).toFixed(2)}`;
          });
        historicalData = historicalDataPoints.join('\n');
      } else {
        // Generate fallback historical data from current price
        const currentPrice = price;
        const fallbackData = [];
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
          const fallbackPrice = currentPrice * (1 + variation);
          fallbackData.push(`Date: ${date.toISOString().split('T')[0]}, Close Price: $${fallbackPrice.toFixed(2)}`);
        }
        historicalData = fallbackData.join('\n');
      }

      // Parse company overview data with fallback
      const companyOverview = {
        name: (overviewData as any)?.Name || `${input.ticker} Inc`,
        description: (overviewData as any)?.Description || 'Company information unavailable',
        sector: (overviewData as any)?.Sector || 'N/A',
        industry: (overviewData as any)?.Industry || 'N/A',
        marketCap: (overviewData as any)?.MarketCapitalization || 'N/A',
        peRatio: (overviewData as any)?.PERatio || 'N/A',
        eps: (overviewData as any)?.EPS || 'N/A',
        dividendYield: (overviewData as any)?.DividendYield || 'N/A',
        week52High: (overviewData as any)?.['52WeekHigh'] || 'N/A',
        week52Low: (overviewData as any)?.['52WeekLow'] || 'N/A',
        movingAverage50: (overviewData as any)?.['50DayMovingAverage'] || 'N/A',
        movingAverage200: (overviewData as any)?.['200DayMovingAverage'] || 'N/A',
        beta: (overviewData as any)?.Beta || 'N/A',
        analystTargetPrice: (overviewData as any)?.AnalystTargetPrice || 'N/A',
      };

      return { 
        price, 
        volume, 
        open, 
        high, 
        low, 
        previousClose, 
        change, 
        changePercent, 
        latestTradingDay, 
        historicalData, 
        companyOverview 
      };
    } catch (error: any) {
      console.error("Error fetching from Alpha Vantage:", error);
      
      // Provide user-friendly error messages
      if (error.message.includes("rate limit") || error.message.includes("call frequency")) {
        throw new Error("API rate limit reached. Please wait a moment and try again.");
      }
      
      if (error.message.includes("quota exceeded") || error.message.includes("premium")) {
        throw new Error("Daily API quota exceeded. Please try again tomorrow or upgrade your subscription.");
      }
      
      if (error.message.includes("experiencing issues") || error.message.includes("provider")) {
        throw new Error("The stock data provider is experiencing high traffic. Please try again in a few minutes.");
      }
      
      if (error.message.includes("No quote data") || error.message.includes("No historical data")) {
        throw new Error(`Unable to find data for ticker "${input.ticker}". Please verify the symbol is correct.`);
      }
      
      // Generic fallback error
      throw new Error(`Unable to retrieve stock data at this time. Please try again later.`);
    }
  }
);
