import { NextRequest, NextResponse } from 'next/server';

// Enhanced local response generator when Gemini API is not available
function generateEnhancedLocalResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Educational responses for beginners
  if (lowerMessage.includes('what is') || lowerMessage.includes('explain') || lowerMessage.includes('how does')) {
    if (lowerMessage.includes('stock') || lowerMessage.includes('share')) {
      return `📚 **Understanding Stocks**

A **stock** represents ownership in a company. When you buy stocks, you become a shareholder and own a piece of that business.

**Key Concepts:**
• **Share Price**: Current market value of one stock
• **Market Cap**: Total company value (shares × price)
• **Dividend**: Profit sharing with shareholders
• **Volatility**: How much the price fluctuates

**Why Stock Prices Move:**
• Company performance & earnings
• Market sentiment & news
• Economic conditions
• Supply & demand

💡 **Beginner Tip**: Start with well-established companies (blue-chip stocks) and always diversify your investments!`;
    }
    
    if (lowerMessage.includes('invest') || lowerMessage.includes('trading')) {
      return `💰 **Investment Basics**

**Investing vs Trading:**
• **Investing**: Long-term wealth building (months/years)
• **Trading**: Short-term profit seeking (days/weeks)

**Getting Started:**
1. **Emergency Fund**: Save 3-6 months expenses first
2. **Risk Assessment**: Know your risk tolerance
3. **Diversification**: Don't put all eggs in one basket
4. **Research**: Understand what you're buying
5. **Start Small**: Begin with amounts you can afford to lose

**Investment Options:**
• **Stocks**: Individual company shares
• **ETFs**: Diversified fund baskets
• **Mutual Funds**: Professionally managed portfolios
• **Index Funds**: Track market indices (low cost)

🎯 **Golden Rule**: Time in market beats timing the market!`;
    }
  }
  
  // Risk and strategy questions
  if (lowerMessage.includes('risk') || lowerMessage.includes('safe') || lowerMessage.includes('strategy')) {
    return `⚖️ **Risk Management & Investment Strategy**

**Risk Types:**
• **Market Risk**: Overall market decline
• **Company Risk**: Specific business problems
• **Inflation Risk**: Money losing purchasing power
• **Liquidity Risk**: Difficulty selling investments

**Risk Management:**
1. **Diversification**: Spread investments across sectors
2. **Asset Allocation**: Mix stocks, bonds, cash
3. **Stop-Loss Orders**: Limit potential losses
4. **Regular Review**: Monitor and rebalance portfolio

**Investment Strategies:**
• **Dollar-Cost Averaging**: Invest fixed amounts regularly
• **Value Investing**: Buy undervalued companies
• **Growth Investing**: Focus on expanding companies
• **Index Investing**: Track market performance

🛡️ **Remember**: Higher potential returns usually mean higher risk. Never invest money you can't afford to lose!`;
  }

  // Buy/sell guidance
  if (lowerMessage.includes('buy') || lowerMessage.includes('invest')) {
    return `💡 **Investment Decision Framework**

**Before Buying Any Stock:**
1. **Research the Company**: What do they do? How do they make money?
2. **Check Financials**: Revenue growth, profit margins, debt levels
3. **Understand Valuation**: Is the stock fairly priced?
4. **Consider Timing**: Market conditions and your personal situation
5. **Risk Assessment**: Can you afford to lose this money?

**Key Questions:**
• Why do you want to buy this stock?
• How does it fit your portfolio?
• What's your exit strategy?
• Have you diversified enough?

**For Beginners**: Start with index funds or ETFs before picking individual stocks. Which stock are you considering?`;
  }

  if (lowerMessage.includes('sell') || lowerMessage.includes('exit')) {
    return `📉 **When to Consider Selling**

**Good Reasons to Sell:**
• Reached your target price/profit goal
• Company fundamentals have deteriorated
• Found a better investment opportunity
• Need money for emergencies
• Portfolio rebalancing required

**Bad Reasons to Sell:**
• Panic during market downturns
• Following crowd emotions
• Short-term price fluctuations
• Media hype or fear

**Exit Strategy Tips:**
• Set profit targets when you buy
• Use stop-loss orders to limit losses
• Review holdings regularly (quarterly)
• Don't let emotions drive decisions

💭 **Remember**: Selling at the wrong time can hurt long-term returns. Which stock are you considering selling?`;
  }

  // Market and trends
  if (lowerMessage.includes('market') || lowerMessage.includes('trend')) {
    return `📈 **Understanding Markets**

**Market Basics:**
• **Bull Market**: Rising prices, optimism
• **Bear Market**: Falling prices, pessimism
• **Market Hours (IST)**: US markets 9:30 PM - 4:00 AM IST

**Key Indicators:**
• **S&P 500**: Top 500 US companies
• **NASDAQ**: Tech-heavy index
• **Dow Jones**: 30 large US companies
• **NIFTY 50**: Top 50 Indian companies

**Market Factors:**
• **Economic Indicators**: GDP, inflation, employment
• **Company Earnings**: Quarterly profit reports
• **Global Events**: Politics, trade, natural disasters
• **Investor Sentiment**: Fear and greed cycles

📊 **Current Focus**: Markets are dynamic - prices change every second based on global events and investor sentiment!`;
  }

  // Help and learning
  if (lowerMessage.includes('help') || lowerMessage.includes('guide') || lowerMessage.includes('learn')) {
    return `🎓 **Stock Sense AI - Your Learning Companion**

I'm here to help you understand investing! Ask me about:

**📚 Learning Topics:**
• "What is a stock?" - Basic concepts
• "How to invest?" - Getting started guide
• "Explain market trends" - Market analysis
• "Risk management" - Protecting your money
• "Investment strategies" - Different approaches

**📊 Live Stock Data:**
• Type any stock symbol (AAPL, GOOGL, TSLA)
• Get real-time prices and analysis
• Understand price movements

**💡 Beginner-Friendly:**
• Simple explanations for complex topics
• Step-by-step guidance
• Risk awareness education
• Real-world examples

Ask me anything about stocks and investing - I'll explain it in simple terms! 🚀`;
  }

  // Stock ticker analysis
  const tickerMatch = message.match(/\b[A-Z]{2,5}\b/);
  if (tickerMatch) {
    const ticker = tickerMatch[0];
    return `📊 **${ticker} Analysis Request**

I can provide general information about **${ticker}**, but for real-time prices and detailed analysis, please use our **Stock Analyzer** feature in the app!

**General Investment Considerations:**
• **Research**: Look into the company's business model
• **Financials**: Check revenue, profit, and debt levels
• **Valuation**: Compare P/E ratio with industry peers
• **News**: Stay updated on company developments
• **Diversification**: Don't put all money in one stock

**Next Steps:**
1. Use the Stock Analyzer for live ${ticker} data
2. Check recent news and earnings reports
3. Consider your risk tolerance
4. Think about portfolio allocation

💡 **Tip**: Always do your own research before investing!`;
  }

  // Try to give more specific responses based on keywords
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `👋 **Hello! I'm Stock Sense AI**

I'm here to help you with specific investment questions! Instead of generic advice, I can provide:

**📊 Specific Analysis**: Ask about any stock (AAPL, GOOGL, TSLA)
**💰 Personal Guidance**: "Should I buy Tesla now?", "Is Apple overvalued?"
**📈 Market Insights**: "What's happening with tech stocks?", "Best sectors to invest in?"
**🎯 Action Plans**: "How to invest $5000?", "Best strategy for beginners?"

**What would you like to know specifically?** Ask me a direct question and I'll give you a focused answer!`;
  }

  if (lowerMessage.includes('today') || lowerMessage.includes('now') || lowerMessage.includes('current')) {
    return `📊 **Current Market Focus** (${new Date().toLocaleDateString('en-IN', {timeZone: 'Asia/Kolkata'})})

**Market Status**: US markets are ${new Date().getHours() >= 21 || new Date().getHours() < 4 ? '🟢 OPEN' : '🔴 CLOSED'} (IST time)

**Today's Focus Areas:**
• **Tech Stocks**: AI and cloud computing trends
• **Energy Sector**: Oil prices and renewable energy
• **Banking**: Interest rate impacts
• **Consumer Goods**: Inflation effects

**For Real-Time Data**: Use our Stock Analyzer for live prices and detailed analysis of specific stocks.

**What specific stock or sector interests you today?**`;
  }

  if (lowerMessage.includes('should i') || lowerMessage.includes('recommend')) {
    return `🎯 **Investment Recommendations**

I'd love to give you specific advice! To provide the best recommendation, I need to know:

**Your Situation:**
• Investment amount available?
• Risk tolerance (conservative/moderate/aggressive)?
• Investment timeline (short/long term)?
• Current portfolio holdings?

**Popular Current Strategies:**
• **Conservative**: Index funds (VTI, SPY)
• **Growth**: Tech stocks (AAPL, GOOGL, MSFT)
• **Value**: Undervalued blue-chips
• **Diversified**: ETFs across sectors

**Tell me more about your situation and I'll give you specific recommendations!**

What's your investment budget and risk comfort level?`;
  }

  // Default educational response
  return `🤖 **Stock Sense AI - Ask Me Anything Specific!**

Instead of generic information, ask me direct questions like:

**📊 Stock Questions:**
• "Should I buy Apple stock now?"
• "Is Tesla overvalued?"
• "What's the best tech stock?"

**💰 Investment Questions:**
• "How to invest $10,000?"
• "Best strategy for retirement?"
• "Should I sell my losing stocks?"

**📈 Market Questions:**
• "What's happening with crypto?"
• "Are we in a bull or bear market?"
• "Best sectors for 2024?"

**🎯 The more specific your question, the better my answer!**

What would you like to know right now?`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Gemini API configuration
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    console.log('Gemini API Key status:', GEMINI_API_KEY ? 'Present' : 'Missing');
    
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here' || GEMINI_API_KEY.length < 10) {
      console.warn('Gemini API key not properly configured. Please add GEMINI_API_KEY to .env.local');
      console.warn('Get your API key from: https://makersuite.google.com/app/apikey');
      
      // Return enhanced local response instead of error
      const enhancedResponse = generateEnhancedLocalResponse(message);
      return NextResponse.json({
        response: enhancedResponse + '\n\n🔧 **Note**: Add your Gemini API key to `.env.local` for even smarter responses!',
        timestamp: new Date().toISOString(),
        source: 'local_ai'
      });
    }

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    // Prepare the prompt with context
    const prompt = `You are Stock Sense AI, an expert financial advisor and stock market analyst. You provide personalized, specific, and actionable investment advice.

Context: ${context || 'You are helping users understand stocks, investing, and financial markets.'}

User Question: "${message}"

Instructions:
1. Give SPECIFIC, DIRECT answers to the user's exact question
2. If they ask about a stock ticker, provide detailed analysis and insights
3. If they ask "how to" questions, give step-by-step actionable advice
4. If they ask about concepts, explain with real examples
5. Use emojis and markdown formatting for better readability
6. Keep responses focused and practical
7. Always end with a follow-up question or next step suggestion

Current market context: It's ${new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})} IST. US markets are ${new Date().getHours() >= 21 || new Date().getHours() < 4 ? 'currently open' : 'currently closed'}.

Provide a specific, helpful response:`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      
      // Fallback to enhanced local response if Gemini fails
      const enhancedResponse = generateEnhancedLocalResponse(message);
      return NextResponse.json({
        response: enhancedResponse,
        timestamp: new Date().toISOString(),
        source: 'local_ai_fallback'
      });
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const generatedText = data.candidates[0].content.parts[0].text;
      
      return NextResponse.json({
        response: generatedText,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('Unexpected Gemini API response structure:', data);
      return NextResponse.json(
        { error: 'Invalid response from Gemini API' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Gemini chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
