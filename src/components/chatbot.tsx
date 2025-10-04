'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'stock-info';
}

const predefinedResponses: Record<string, string> = {
  'hello': 'Hello! 👋 I\'m your Stock Sense AI assistant. I can help with stock analysis, market trends, and investment advice.',
  'help': 'I can help with:\n• Stock analysis and prices\n• Market insights\n• Investment advice\n• Portfolio review\n\nTry asking about specific stocks like AAPL, GOOGL, or TSLA!',
  'apple': 'Apple (AAPL) is trading strong with solid iPhone sales growth. Want detailed analysis?',
  'tesla': 'Tesla (TSLA) has been volatile with global expansion. Interested in technical analysis?',
  'market': 'Current market shows mixed signals. Tech is strong, energy faces challenges. Need sector insights?',
  'portfolio': 'I can help analyze your portfolio for diversification and growth opportunities. Share your holdings?',
  'beginner': '🌟 **Beginner Tips:**\n• Start with basics\n• Diversify investments\n• Think long-term\n• Research first\n• Start small\n\nWhat would you like to learn more about?',
};

const quickSuggestions = [
  'Should I buy Apple stock?',
  'Best stocks for 2024?',
  'How to invest $10000?',
];

// Function to fetch real stock data via server API (proxies Alpha Vantage)
const fetchStockData = async (symbol: string) => {
  try {
    const res = await fetch('/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({} as any));
      throw new Error(errBody?.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      symbol: data.symbol,
      price: data.price,
      change: data.change,
      changePercent: data.changePercent,
      volume: data.volume,
      high: data.high,
      low: data.low,
      open: data.open,
      previousClose: data.previousClose,
    };
  } catch (error) {
    console.error('Error fetching stock data via API route:', error);
    return null;
  }
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 **Hi! I\'m Stock Sense AI**\n\nI provide specific, personalized investment advice! Try asking:\n\n• "Should I buy Apple stock?"\n• "How to invest $5000?"\n• "What\'s the best tech stock?"\n• "Is Tesla overvalued?"\n\n🔧 **For even smarter responses**: Add your Gemini API key to `.env.local`\n\n**What specific question do you have?**',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateGeminiResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: 'You are Stock Sense AI, a helpful financial advisor and stock market expert. Provide educational, accurate, and beginner-friendly responses about stocks, investing, market analysis, and financial planning. Always include practical tips and explain complex concepts simply. Use emojis and formatting to make responses engaging.'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.response || 'I apologize, but I encountered an issue generating a response. Please try again.';
      }
    } catch (error) {
      console.error('Gemini API error:', error);
    }
    
    // Fallback to local responses if Gemini fails
    return await generateLocalResponse(userMessage);
  };

  const generateLocalResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for predefined responses first
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Stock ticker pattern - fetch real data
    const tickerMatch = userMessage.match(/\b[A-Z]{2,5}\b/);
    if (tickerMatch) {
      const ticker = tickerMatch[0];
      const stockData = await fetchStockData(ticker);
      
      if (stockData) {
        const changeDirection = stockData.change >= 0 ? 'up' : 'down';
        const changeEmoji = stockData.change >= 0 ? '📈' : '📉';
        
        return `${changeEmoji} **${stockData.symbol} Live Analysis** (Alpha Vantage API)

💰 **Current Price:** $${stockData.price.toFixed(2)}
📊 **Change:** ${stockData.change >= 0 ? '+' : ''}$${stockData.change.toFixed(2)} (${stockData.changePercent})
📈 **Volume:** ${parseInt(stockData.volume).toLocaleString()}
📉 **Day Range:** $${stockData.low.toFixed(2)} - $${stockData.high.toFixed(2)}
🔄 **Previous Close:** $${stockData.previousClose.toFixed(2)}

**Market Insight:** The stock is trending ${changeDirection} today. ${stockData.change >= 0 ? 'This shows positive momentum! 🚀' : 'Consider this as a potential buying opportunity. 💡'}

**What's Next?**
• Ask for technical analysis
• Compare with other stocks
• Get investment recommendation
• Check sector performance

*Data powered by Alpha Vantage API (7ZRTF3ZANV19WD54)*`;
      } else {
        return `❌ **Unable to fetch data for ${ticker}**

**Possible reasons:**
• Invalid ticker symbol
• API rate limit reached
• Market is closed
• Network connectivity issue

**Try these popular stocks:**
• **AAPL** - Apple Inc.
• **GOOGL** - Alphabet Inc.
• **TSLA** - Tesla Inc.
• **MSFT** - Microsoft Corp.
• **AMZN** - Amazon.com Inc.

*Using Alpha Vantage API (7ZRTF3ZANV19WD54) for real-time data*`;
      }
    }

    // Educational responses for beginners
    if (lowerMessage.includes('what is') || lowerMessage.includes('explain') || lowerMessage.includes('how does')) {
      if (lowerMessage.includes('stock') || lowerMessage.includes('share')) {
        return `📚 **Understanding Stocks**

A **stock** represents ownership in a company. When you buy stocks, you become a shareholder.

**Key Concepts:**
• **Share Price**: Current market value of one stock
• **Market Cap**: Total company value (shares × price)  
• **Dividend**: Profit sharing with shareholders
• **Volatility**: How much the price fluctuates

**Why Prices Move:**
• Company earnings & performance
• Market sentiment & news
• Economic conditions
• Supply & demand

💡 **Beginner Tip**: Start with established companies and always diversify!`;
      }
      
      if (lowerMessage.includes('invest') || lowerMessage.includes('trading')) {
        return `💰 **Investment Basics**

**Getting Started:**
1. **Emergency Fund**: Save 3-6 months expenses first
2. **Risk Assessment**: Know your risk tolerance  
3. **Research**: Understand what you're buying
4. **Start Small**: Begin with amounts you can afford to lose
5. **Diversify**: Don't put all eggs in one basket

**Investment Options:**
• **Stocks**: Individual company shares
• **ETFs**: Diversified fund baskets
• **Index Funds**: Track market indices (low cost)

🎯 **Golden Rule**: Time in market beats timing the market!`;
      }
    }

    // Enhanced keyword responses
    if (lowerMessage.includes('buy') || lowerMessage.includes('invest')) {
      return `💡 **Investment Decision Framework**

**Before Buying:**
1. **Research**: What does the company do?
2. **Financials**: Check revenue, profit, debt
3. **Valuation**: Is the stock fairly priced?
4. **Risk**: Can you afford to lose this money?

**Key Questions:**
• Why this stock?
• How does it fit your portfolio?
• What's your exit strategy?

**For Beginners**: Consider index funds first. Which stock interests you?`;
    }

    if (lowerMessage.includes('sell') || lowerMessage.includes('exit')) {
      return `📉 **When to Consider Selling**

**Good Reasons:**
• Reached profit target
• Company fundamentals deteriorated  
• Found better opportunity
• Portfolio rebalancing needed

**Bad Reasons:**
• Panic during downturns
• Following crowd emotions
• Short-term fluctuations

💭 **Remember**: Don't let emotions drive decisions. Which stock are you considering?`;
    }

    if (lowerMessage.includes('risk') || lowerMessage.includes('safe')) {
      return `⚖️ **Risk Management**

**Risk Types:**
• **Market Risk**: Overall market decline
• **Company Risk**: Business-specific problems
• **Inflation Risk**: Money losing value

**Management Strategies:**
• **Diversification**: Spread across sectors
• **Position Sizing**: Don't risk too much on one stock
• **Stop-Loss**: Limit potential losses
• **Regular Review**: Monitor quarterly

🛡️ **Remember**: Higher returns usually mean higher risk!`;
    }

    if (lowerMessage.includes('portfolio') || lowerMessage.includes('diversif')) {
      return `📋 **Portfolio Building**

**Diversification Basics:**
• **Sectors**: Tech, healthcare, finance, etc.
• **Company Sizes**: Large, mid, small cap
• **Geography**: Domestic vs international
• **Asset Types**: Stocks, bonds, REITs

**Portfolio Allocation Tips:**
• **Age Rule**: 100 - your age = % in stocks
• **Core Holdings**: 60-80% in index funds
• **Satellite**: 20-40% in individual picks

📊 **Beginner Portfolio**: Start with broad market ETFs, then add individual stocks!`;
    }

    if (lowerMessage.includes('market') || lowerMessage.includes('trend')) {
      return `📈 **Understanding Markets**

**Market Basics:**
• **Bull Market**: Rising prices, optimism
• **Bear Market**: Falling prices, pessimism  
• **Market Hours (IST)**: US 9:30 PM - 4:00 AM

**Key Indicators:**
• **S&P 500**: Top 500 US companies
• **NASDAQ**: Tech-heavy index
• **Economic Data**: GDP, inflation, jobs

**Current Focus**: Markets are dynamic - prices change based on global events, earnings, and sentiment.

🔍 **Want specific analysis?** Ask about a particular stock or sector!`;
    }

    // Help and learning responses
    if (lowerMessage.includes('help') || lowerMessage.includes('guide') || lowerMessage.includes('learn')) {
      return `🎓 **Stock Sense AI - Your Learning Guide**

**I can help with:**
📚 **Education**: "What is a stock?", "How to invest?", "Explain risk"
📊 **Live Data**: Type stock symbols (AAPL, GOOGL, TSLA)  
💡 **Guidance**: Investment strategies, portfolio building
⚖️ **Risk**: Understanding and managing investment risks

**Popular Questions:**
• "What is diversification?"
• "How do I start with $1000?"
• "Analyze AAPL stock"
• "Explain bull vs bear market"

Ask me anything - I'll explain it simply! 🚀`;
    }

    // Enhanced generic response
    return `🤖 **Stock Sense AI Ready to Help!**

**I can assist with:**
📈 **Stock Analysis**: Type any ticker (AAPL, GOOGL, MSFT) for real-time data
📚 **Learning**: Ask "What is..." or "How to..." questions
💡 **Guidance**: Investment strategies and risk management
🎯 **Personalized**: Suitable for beginners and experienced investors

**Try asking:**
• "What is a stock?"
• "How to start investing?"  
• "Analyze TSLA"
• "Explain market trends"

I'm here to make investing accessible for everyone! 🌟`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay and generate response
    setTimeout(async () => {
      const responseText = await generateGeminiResponse(inputText);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:from-cyan-400 hover:to-emerald-400 transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '700px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden flex flex-col hover:shadow-3xl hover:border-gray-600 transition-all duration-300"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 relative">
                  <Bot className="h-4 w-4 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse" title="AI Enhanced"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Stock Sense AI</h3>
                  <p className="text-cyan-100 text-xs">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 p-1"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900 min-h-0">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-blue-500' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-800 text-gray-100'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Section */}
                <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-900">
                  {/* Quick Suggestions - Only show initially */}
                  {messages.length <= 1 && (
                    <div className="mb-3">
                      <div className="flex gap-2">
                        {quickSuggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs border-gray-600 bg-gray-800 text-white hover:bg-gray-700 hover:border-gray-500 active:bg-gray-600 focus:bg-gray-700 focus:border-gray-500"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Input Area */}
                  <div className="flex gap-2">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about stocks, market trends, or get investment advice..."
                      className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-700/80 hover:border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isTyping}
                      className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white border-0 px-4"
                    >
                      {isTyping ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
