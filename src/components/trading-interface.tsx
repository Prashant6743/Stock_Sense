'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, Minus, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap: string;
}

interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  quantity: number;
  price?: number;
  status: 'pending' | 'executed' | 'cancelled';
  timestamp: Date;
  totalValue: number;
}

interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  pnl: number;
  pnlPercent: number;
}

interface TradingInterfaceProps {
  stockData: StockData;
  onClose: () => void;
}

export function TradingInterface({ stockData, onClose }: TradingInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<number>(stockData.price);
  const [orders, setOrders] = useState<Order[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [availableBalance, setAvailableBalance] = useState<number>(50000);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock holdings data
  useEffect(() => {
    setHoldings([
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 10,
        avgPrice: 245.00,
        currentPrice: 255.45,
        totalValue: 2554.50,
        pnl: 104.50,
        pnlPercent: 4.27
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        quantity: 2,
        avgPrice: 2900.00,
        currentPrice: 2847.52,
        totalValue: 5695.04,
        pnl: -104.96,
        pnlPercent: -1.81
      }
    ]);
  }, []);

  const currentHolding = holdings.find(h => h.symbol === stockData.symbol);
  const totalValue = orderType === 'market' 
    ? quantity * stockData.price 
    : quantity * (limitPrice || stockData.price);

  const canBuy = totalValue <= availableBalance;
  const canSell = currentHolding && quantity <= currentHolding.quantity;

  const handlePlaceOrder = async () => {
    if (activeTab === 'buy' && !canBuy) {
      alert('Insufficient balance');
      return;
    }
    if (activeTab === 'sell' && !canSell) {
      alert('Insufficient holdings');
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD${Date.now()}`,
        symbol: stockData.symbol,
        type: activeTab,
        orderType,
        quantity,
        price: orderType === 'limit' ? limitPrice : undefined,
        status: orderType === 'market' ? 'executed' : 'pending',
        timestamp: new Date(),
        totalValue
      };

      setOrders(prev => [newOrder, ...prev]);

      // Update balance and holdings for market orders
      if (orderType === 'market') {
        if (activeTab === 'buy') {
          setAvailableBalance(prev => prev - totalValue);
          // Update or create holding
          setHoldings(prev => {
            const existingIndex = prev.findIndex(h => h.symbol === stockData.symbol);
            if (existingIndex >= 0) {
              const existing = prev[existingIndex];
              const newQuantity = existing.quantity + quantity;
              const newAvgPrice = ((existing.avgPrice * existing.quantity) + (stockData.price * quantity)) / newQuantity;
              const updated = {
                ...existing,
                quantity: newQuantity,
                avgPrice: newAvgPrice,
                totalValue: newQuantity * stockData.price,
                pnl: (stockData.price - newAvgPrice) * newQuantity,
                pnlPercent: ((stockData.price - newAvgPrice) / newAvgPrice) * 100
              };
              return [...prev.slice(0, existingIndex), updated, ...prev.slice(existingIndex + 1)];
            } else {
              return [...prev, {
                symbol: stockData.symbol,
                name: stockData.name,
                quantity,
                avgPrice: stockData.price,
                currentPrice: stockData.price,
                totalValue: totalValue,
                pnl: 0,
                pnlPercent: 0
              }];
            }
          });
        } else {
          // Sell order
          setAvailableBalance(prev => prev + totalValue);
          setHoldings(prev => {
            const existingIndex = prev.findIndex(h => h.symbol === stockData.symbol);
            if (existingIndex >= 0) {
              const existing = prev[existingIndex];
              const newQuantity = existing.quantity - quantity;
              if (newQuantity === 0) {
                return [...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)];
              } else {
                const updated = {
                  ...existing,
                  quantity: newQuantity,
                  totalValue: newQuantity * stockData.price,
                  pnl: (stockData.price - existing.avgPrice) * newQuantity,
                  pnlPercent: ((stockData.price - existing.avgPrice) / existing.avgPrice) * 100
                };
                return [...prev.slice(0, existingIndex), updated, ...prev.slice(existingIndex + 1)];
              }
            }
            return prev;
          });
        }
      }

      setIsProcessing(false);
      setQuantity(1);
      setLimitPrice(stockData.price);
    }, 2000);
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'executed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{stockData.symbol}</h2>
              <p className="text-cyan-100">{stockData.name}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${stockData.price.toFixed(2)}</p>
              <p className={`flex items-center gap-1 ${stockData.change >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {stockData.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {stockData.change >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trading Panel */}
            <div className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Place Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Buy/Sell Tabs */}
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')}>
                    <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                      <TabsTrigger value="buy" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                        Buy
                      </TabsTrigger>
                      <TabsTrigger value="sell" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                        Sell
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Order Type */}
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Order Type</label>
                    <div className="flex gap-2">
                      <Button
                        variant={orderType === 'market' ? 'default' : 'outline'}
                        onClick={() => setOrderType('market')}
                        className={orderType === 'market' 
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' 
                          : 'border-gray-600 text-gray-300'
                        }
                      >
                        Market
                      </Button>
                      <Button
                        variant={orderType === 'limit' ? 'default' : 'outline'}
                        onClick={() => setOrderType('limit')}
                        className={orderType === 'limit' 
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' 
                          : 'border-gray-600 text-gray-300'
                        }
                      >
                        Limit
                      </Button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Quantity</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="border-gray-600 text-gray-300"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="bg-gray-800 border-gray-600 text-white text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="border-gray-600 text-gray-300"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Limit Price */}
                  {orderType === 'limit' && (
                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm">Limit Price</label>
                      <Input
                        type="number"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(parseFloat(e.target.value) || stockData.price)}
                        className="bg-gray-800 border-gray-600 text-white"
                        step="0.01"
                      />
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Quantity:</span>
                      <span className="text-white">{quantity} shares</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-white">
                        ${orderType === 'market' ? stockData.price.toFixed(2) : limitPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t border-gray-600 pt-2">
                      <span className="text-gray-300">Total Value:</span>
                      <span className="text-white">${totalValue.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Available Balance/Holdings */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Available Balance:</span>
                      <span className="text-emerald-400">${availableBalance.toLocaleString()}</span>
                    </div>
                    {currentHolding && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Holdings:</span>
                        <span className="text-cyan-400">{currentHolding.quantity} shares</span>
                      </div>
                    )}
                  </div>

                  {/* Place Order Button */}
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || (activeTab === 'buy' && !canBuy) || (activeTab === 'sell' && !canSell)}
                    className={`w-full py-3 ${
                      activeTab === 'buy' 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' 
                        : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                    } text-white`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${quantity} Share${quantity > 1 ? 's' : ''}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Orders & Holdings */}
            <div className="space-y-6">
              {/* Recent Orders */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {orders.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No orders yet</p>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getOrderStatusIcon(order.status)}
                            <div>
                              <p className="text-white text-sm font-medium">
                                {order.type.toUpperCase()} {order.symbol}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {order.quantity} shares • {order.orderType}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-sm">${order.totalValue.toFixed(2)}</p>
                            <Badge className={`text-xs ${
                              order.status === 'executed' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Holdings */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Your Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {holdings.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No holdings</p>
                    ) : (
                      holdings.map((holding) => (
                        <div key={holding.symbol} className="p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-white font-medium">{holding.symbol}</p>
                              <p className="text-gray-400 text-xs">{holding.quantity} shares</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white">${holding.totalValue.toFixed(2)}</p>
                              <p className={`text-xs ${holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {holding.pnl >= 0 ? '+' : ''}${holding.pnl.toFixed(2)} ({holding.pnlPercent.toFixed(2)}%)
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            Avg: ${holding.avgPrice.toFixed(2)} • Current: ${holding.currentPrice.toFixed(2)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Close
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
