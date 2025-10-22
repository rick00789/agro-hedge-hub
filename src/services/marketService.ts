// Central market simulation service
type MarketListener = (price: number) => void;

class MarketService {
  private currentMarketPrice: number = 4518;
  private priceHistory: { date: string; price: number; isForecast?: boolean }[] = [];
  private listeners: MarketListener[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private readonly MAX_HISTORY = 30;

  constructor() {
    this.initializePriceHistory();
  }

  private initializePriceHistory() {
    const now = new Date();
    // Generate 25 historical points
    for (let i = 25; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const randomChange = (Math.random() - 0.5) * 100;
      const price = Math.round(4500 + randomChange);
      this.priceHistory.push({
        date: date.toISOString().split('T')[0],
        price
      });
    }
    this.currentMarketPrice = this.priceHistory[this.priceHistory.length - 1].price;
    
    // Add 7 forecast points
    let lastPrice = this.currentMarketPrice;
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const forecastChange = (Math.random() - 0.45) * 20; // Slight upward bias
      lastPrice = Math.round(lastPrice + forecastChange);
      this.priceHistory.push({
        date: date.toISOString().split('T')[0],
        price: lastPrice,
        isForecast: true
      });
    }
  }

  private updateMarketPrice() {
    // Generate realistic price movement (-10 to +10)
    const change = (Math.random() - 0.5) * 20;
    this.currentMarketPrice = Math.round(this.currentMarketPrice + change);
    
    // Add new price point to history
    const now = new Date();
    
    // Remove forecast points
    this.priceHistory = this.priceHistory.filter(p => !p.isForecast);
    
    // Add new historical point
    this.priceHistory.push({
      date: now.toISOString().split('T')[0],
      price: this.currentMarketPrice
    });
    
    // Keep only last MAX_HISTORY points
    if (this.priceHistory.length > this.MAX_HISTORY) {
      this.priceHistory.shift();
    }
    
    // Regenerate forecast
    let lastPrice = this.currentMarketPrice;
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const forecastChange = (Math.random() - 0.45) * 20;
      lastPrice = Math.round(lastPrice + forecastChange);
      this.priceHistory.push({
        date: date.toISOString().split('T')[0],
        price: lastPrice,
        isForecast: true
      });
    }
    
    // Notify all listeners
    this.listeners.forEach(listener => listener(this.currentMarketPrice));
  }

  startMarketSimulation() {
    if (this.intervalId) return; // Already running
    
    this.intervalId = setInterval(() => {
      this.updateMarketPrice();
    }, 3000); // Update every 3 seconds
  }

  stopMarketSimulation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getCurrentPrice(): number {
    return this.currentMarketPrice;
  }

  getPriceHistory() {
    return [...this.priceHistory];
  }

  subscribe(listener: MarketListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

// Export singleton instance
export const marketService = new MarketService();
