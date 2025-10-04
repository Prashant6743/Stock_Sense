import { NextRequest, NextResponse } from 'next/server';
import { getStockData } from '@/ai/flows/stock-data-retrieval';

export async function POST(req: NextRequest) {
  try {
    const { symbol } = await req.json();
    if (!symbol || typeof symbol !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid symbol' }, { status: 400 });
    }

    const data = await getStockData({ ticker: symbol });

    return NextResponse.json({
      symbol,
      price: data.price,
      change: data.change,
      changePercent: data.changePercent,
      volume: data.volume,
      high: data.high,
      low: data.low,
      open: data.open,
      previousClose: data.previousClose,
      latestTradingDay: data.latestTradingDay,
      historicalData: data.historicalData,
      companyOverview: data.companyOverview,
    });
  } catch (err: any) {
    const message = err?.message || 'Failed to fetch stock data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
