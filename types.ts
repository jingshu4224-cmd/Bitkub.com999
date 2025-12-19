
export interface Coin {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  high24h: number;
  low24h: number;
  balance?: number;
  icon?: string;
  category?: string;
}

export interface StockPerformance {
  peRatio: number;
  marketCap: string;
  dividendYield: string;
  revenueGrowth: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  icon: string;
  category: 'SET50' | 'TECH' | 'ENERGY' | 'HEALTH' | 'RETAIL' | 'FINANCE';
  performance: StockPerformance;
  description: string;
}

export enum Tab {
  HOME = 'HOME',
  MARKET = 'MARKET',
  TRADE = 'TRADE',
  WALLET = 'WALLET',
  PROFILE = 'PROFILE',
  INVEST = 'INVEST'
}

export interface OrderBookItem {
  price: number;
  amount: number;
  total: number;
}
