import { NextRequest, NextResponse } from 'next/server';
import { stockService } from '@/lib/stock-service';

export async function POST(req: NextRequest) {
  try {
    const { symbol } = await req.json();
    
    if (!symbol || typeof symbol !== 'string') {
      return NextResponse.json(
        { error: 'Symbol is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate symbol format (1-5 uppercase letters)
    const cleanSymbol = symbol.trim().toUpperCase();
    if (!/^[A-Z]{1,5}$/.test(cleanSymbol)) {
      return NextResponse.json(
        { error: `"${symbol}" is not a valid ticker symbol. Please use symbols like AAPL, GOOGL, MSFT.` },
        { status: 400 }
      );
    }

    const analysis = await stockService.analyzeStock(cleanSymbol);
    
    return NextResponse.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Stock analysis API error:', error);
    
    // Handle specific error types
    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please wait a moment and try again.' },
        { status: 429 }
      );
    }
    
    if (error.message.includes('No data found')) {
      return NextResponse.json(
        { error: `No data available for symbol "${error.message.split(' ').pop()}". Please check the symbol and try again.` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to analyze stock. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  
  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  try {
    const analysis = await stockService.analyzeStock(symbol.toUpperCase());
    
    return NextResponse.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to analyze stock' },
      { status: 500 }
    );
  }
}
