import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Sprout, TrendingUp } from 'lucide-react';
import PriceChart from '@/components/PriceChart';
import AlertCard from '@/components/AlertCard';
import { mockAlerts, PricePoint, MarketAlert } from '@/data/mockData';
import { marketService } from '@/services/marketService';

const Dashboard = () => {
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [previousPrice, setPreviousPrice] = useState<number>(0);
  const [alerts] = useState<MarketAlert[]>(mockAlerts);
  
  useEffect(() => {
    // Start market simulation
    marketService.startMarketSimulation();
    
    // Initial data load
    const initialHistory = marketService.getPriceHistory();
    setPriceData(initialHistory);
    const initialPrice = marketService.getCurrentPrice();
    setCurrentPrice(initialPrice);
    setPreviousPrice(initialPrice);
    
    // Subscribe to price updates
    const unsubscribe = marketService.subscribe((newPrice) => {
      setPreviousPrice(currentPrice);
      setCurrentPrice(newPrice);
      setPriceData(marketService.getPriceHistory());
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  const historicalPrices = priceData.filter(p => !p.isForecast);
  const lastHistoricalPrice = historicalPrices[historicalPrices.length - 1]?.price || currentPrice;
  const forecastPrice = priceData.find(p => p.isForecast)?.price || currentPrice + 50;
  const priceChange = currentPrice - lastHistoricalPrice;
  const priceChangePercent = lastHistoricalPrice ? ((priceChange / lastHistoricalPrice) * 100).toFixed(2) : '0.00';
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary-foreground/20 p-2 rounded-full">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AgriHedge</h1>
            <p className="text-sm opacity-90">Welcome, Farmer Ramesh</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Current Price Card */}
        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Soybean Price Today</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-foreground">₹{currentPrice}</h2>
                <span className="text-sm text-muted-foreground">per quintal</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
              priceChange >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
            }`}>
              <TrendingUp className="h-4 w-4" />
              <span>{priceChangePercent}%</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mb-2">
            7-Day AI Forecast: ₹{forecastPrice}
          </div>
          
          <PriceChart data={priceData} />
        </Card>
        
        {/* Market Alerts */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full"></div>
            Market Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Active Hedges</p>
            <p className="text-2xl font-bold text-primary">3</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <p className="text-sm text-muted-foreground mb-1">E-Contracts</p>
            <p className="text-2xl font-bold text-accent">2</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
