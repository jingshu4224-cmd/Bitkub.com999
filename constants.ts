
import { Coin, Stock } from './types';

export const getLogoUrl = (symbol: string): string => {
  const directUrls: Record<string, string> = {
    // Crypto
    'BTC': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=035',
    'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=035',
    'KUB': 'https://s2.coinmarketcap.com/static/img/coins/64x64/16982.png',
    
    // 20 Famous Companies (Global Stocks)
    'NVDA': 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    'MSFT': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    'AAPL': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    'AMZN': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    'GOOGL': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'META': 'https://upload.wikimedia.org/wikipedia/commons/0/01/Meta_Platforms_Inc._logo.svg',
    'ARAMCO': 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Saudi_Aramco_logo.svg',
    'AVGO': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Broadcom_logo.svg',
    'TSM': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/TSMC_logo.svg',
    'TSLA': 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg',
    'BRK': 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Berkshire_Hathaway_logo.svg',
    'JPM': 'https://upload.wikimedia.org/wikipedia/commons/5/52/JPMorgan_Chase_logo.svg',
    'WMT': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg',
    'LLY': 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Eli_Lilly_and_Company_logo.svg',
    'V': 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_2021_logo.svg',
    'NFLX': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    'MA': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    'XOM': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/ExxonMobil_Logo.svg',
    'COST': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Costco_Wholesale_logo_2010-10-26.svg',
    'JNJ': 'https://upload.wikimedia.org/wikipedia/commons/0/09/Johnson_%26_Johnson_logo.svg'
  };
  return directUrls[symbol] || `https://ui-avatars.com/api/?name=${symbol}&background=181B1F&color=27C052&bold=true`;
};

export const COINS: Coin[] = [
  // Crypto Primary
  { symbol: 'BTC', name: 'Bitcoin', price: 3452100.50, change24h: 1.25, volume24h: '315.4M', high24h: 3500000, low24h: 3400000, icon: getLogoUrl('BTC'), category: 'CRYPTO' },
  { symbol: 'ETH', name: 'Ethereum', price: 92450.75, change24h: -1.42, volume24h: '180.2M', high24h: 94000, low24h: 91000, icon: getLogoUrl('ETH'), category: 'CRYPTO' },
  { symbol: 'KUB', name: 'Bitkub Coin', price: 42.85, change24h: 3.12, volume24h: '25.8M', high24h: 44.20, low24h: 38.50, icon: getLogoUrl('KUB'), category: 'CRYPTO' },
  
  // 20 Companies (Global Market Integration)
  { symbol: 'NVDA', name: 'NVIDIA', price: 4620.50, change24h: 2.15, volume24h: '18.4B', high24h: 4700, low24h: 4550, icon: getLogoUrl('NVDA'), category: 'TECH' },
  { symbol: 'MSFT', name: 'Microsoft', price: 14520.10, change24h: 0.95, volume24h: '9.1B', high24h: 14600, low24h: 14400, icon: getLogoUrl('MSFT'), category: 'TECH' },
  { symbol: 'AAPL', name: 'Apple', price: 7950.40, change24h: 1.22, volume24h: '13.2B', high24h: 8000, low24h: 7850, icon: getLogoUrl('AAPL'), category: 'TECH' },
  { symbol: 'AMZN', name: 'Amazon', price: 6840.20, change24h: -0.35, volume24h: '10.1B', high24h: 6900, low24h: 6780, icon: getLogoUrl('AMZN'), category: 'RETAIL' },
  { symbol: 'GOOGL', name: 'Alphabet', price: 5920.80, change24h: -1.15, volume24h: '7.2B', high24h: 6000, low24h: 5880, icon: getLogoUrl('GOOGL'), category: 'TECH' },
  { symbol: 'META', name: 'Meta Platforms', price: 18450.30, change24h: 3.45, volume24h: '11.5B', high24h: 18600, low24h: 18000, icon: getLogoUrl('META'), category: 'TECH' },
  { symbol: 'ARAMCO', name: 'Saudi Aramco', price: 325.60, change24h: 0.25, volume24h: '1.8B', high24h: 330, low24h: 322, icon: getLogoUrl('ARAMCO'), category: 'ENERGY' },
  { symbol: 'AVGO', name: 'Broadcom', price: 5680.90, change24h: 1.85, volume24h: '3.8B', high24h: 5750, low24h: 5600, icon: getLogoUrl('AVGO'), category: 'TECH' },
  { symbol: 'TSM', name: 'TSMC', price: 6120.45, change24h: 5.12, volume24h: '8.4B', high24h: 6200, low24h: 6000, icon: getLogoUrl('TSM'), category: 'TECH' },
  { symbol: 'TSLA', name: 'Tesla', price: 8250.60, change24h: -3.15, volume24h: '12.4B', high24h: 8500, low24h: 8100, icon: getLogoUrl('TSLA'), category: 'TECH' },
  { symbol: 'BRK', name: 'Berkshire Hathaway', price: 14850.00, change24h: 0.65, volume24h: '1.5B', high24h: 14950, low24h: 14700, icon: getLogoUrl('BRK'), category: 'FINANCE' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 7450.20, change24h: 0.82, volume24h: '2.8B', high24h: 7550, low24h: 7350, icon: getLogoUrl('JPM'), category: 'FINANCE' },
  { symbol: 'WMT', name: 'Walmart', price: 2540.30, change24h: 0.45, volume24h: '2.1B', high24h: 2580, low24h: 2520, icon: getLogoUrl('WMT'), category: 'RETAIL' },
  { symbol: 'LLY', name: 'Eli Lilly', price: 29150.50, change24h: 2.15, volume24h: '4.8B', high24h: 29400, low24h: 28800, icon: getLogoUrl('LLY'), category: 'HEALTH' },
  { symbol: 'V', name: 'Visa', price: 9640.80, change24h: 0.95, volume24h: '2.4B', high24h: 9750, low24h: 9550, icon: getLogoUrl('V'), category: 'FINANCE' },
  { symbol: 'NFLX', name: 'Netflix', price: 23150.00, change24h: 1.85, volume24h: '3.9B', high24h: 23500, low24h: 22800, icon: getLogoUrl('NFLX'), category: 'TECH' },
  { symbol: 'MA', name: 'Mastercard', price: 16850.40, change24h: 1.12, volume24h: '2.2B', high24h: 17100, low24h: 16600, icon: getLogoUrl('MA'), category: 'FINANCE' },
  { symbol: 'XOM', name: 'Exxon Mobil', price: 4280.50, change24h: -1.15, volume24h: '3.1B', high24h: 4350, low24h: 4200, icon: getLogoUrl('XOM'), category: 'ENERGY' },
  { symbol: 'COST', name: 'Costco', price: 28450.70, change24h: 1.25, volume24h: '1.9B', high24h: 28700, low24h: 28200, icon: getLogoUrl('COST'), category: 'RETAIL' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 5580.40, change24h: -0.25, volume24h: '2.9B', high24h: 5650, low24h: 5550, icon: getLogoUrl('JNJ'), category: 'HEALTH' }
];

export const STOCKS: Stock[] = []; // Unified under COINS as requested

export const QUICK_MENU = [
  { id: 1, label: 'เทรดด่วน', icon: 'zap' },
  { id: 2, label: 'ฝากเงินบาท', icon: 'wallet-plus' },
  { id: 3, label: 'ฝากเหรียญ', icon: 'bitcoin' },
  { id: 4, label: 'แลกเหรียญ KUB', icon: 'refresh-ccw' },
  { id: 5, label: 'บิทคับ รีวอร์ด', icon: 'gift' },
];

export const COUNTRY_CODES = [
  { name: 'Thailand', code: '+66', flag: '🇹🇭' },
  { name: 'Laos', code: '+856', flag: '🇱🇦' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Vietnam', code: '+84', flag: '🇻🇳' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
  { name: 'Myanmar', code: '+95', flag: '🇲🇲' },
  { name: 'Cambodia', code: '+855', flag: '🇰🇭' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷' },
  { name: 'China', code: '+86', flag: '🇨🇳' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
];
