// Mock data for AgriHedge prototype

export interface PricePoint {
  date: string;
  price: number;
  isForecast?: boolean;
}

export interface MarketAlert {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  message: string;
  date: string;
}

export interface HedgePosition {
  id: string;
  date: string;
  quantity: number;
  hedgedPrice: number;
  currentPrice?: number;
}

export interface Contract {
  id: string;
  buyerName: string;
  quantity: number;
  agreedPrice: number;
  deliveryDate: string;
  transactionHash: string;
  status: 'Confirmed on Ledger' | 'Pending' | 'Completed';
  createdDate: string;
}

// Generate mock price data for the last 30 days + 7 day forecast
export const generatePriceData = (): PricePoint[] => {
  const data: PricePoint[] = [];
  const basePrice = 4500;
  const today = new Date();
  
  // Historical data (30 days)
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variation = Math.random() * 100 - 50; // +/- 50
    const price = Math.round(basePrice + variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price,
      isForecast: false
    });
  }
  
  // Forecast data (7 days)
  const lastPrice = data[data.length - 1].price;
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const trend = Math.random() * 60 - 20; // Slight upward bias
    const price = Math.round(lastPrice + trend);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price,
      isForecast: true
    });
  }
  
  return data;
};

export const mockAlerts: MarketAlert[] = [
  {
    id: '1',
    type: 'positive',
    title: 'Rising Demand',
    message: 'International demand for soybean oil is rising. Prices may increase by 2-3%.',
    date: new Date().toISOString()
  },
  {
    id: '2',
    type: 'neutral',
    title: 'Policy Update',
    message: 'Government to announce new MSP policy next week.',
    date: new Date().toISOString()
  },
  {
    id: '3',
    type: 'negative',
    title: 'Weather Alert',
    message: 'Higher than expected rainfall may impact crop quality. Watch for price dips.',
    date: new Date().toISOString()
  }
];

export const mockBuyers = [
  'AgroCorp Ltd',
  'Local Millers Inc',
  'Oilseed Traders Co.',
  'Rural Processing Unit'
];

// Generate random transaction hash
export const generateTransactionHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

export const getCurrentMarketPrice = (): number => {
  const priceData = generatePriceData();
  const currentPrice = priceData.find(p => !p.isForecast);
  return currentPrice ? currentPrice.price : 4500;
};
