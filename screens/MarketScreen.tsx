
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Star, ListFilter, TrendingUp, Info, ChevronRight, X } from 'lucide-react';
import { COINS } from '../constants';
import { Tab, Coin, Stock } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  setTab: (tab: Tab) => void;
  onCoinSelect: (coin: Coin) => void;
}

const MarketScreen: React.FC<Props> = ({ setTab, onCoinSelect }) => {
  const { t } = useLanguage();
  const [marketType, setMarketType] = useState<'CRYPTO' | 'STOCKS'>('CRYPTO');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [liveCoins, setLiveCoins] = useState<Coin[]>(COINS);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCoins(prev => prev.map(coin => {
        // Simulation of price fluctuation (random drift +/- 0.12%)
        const volatility = 0.0012;
        const drift = (Math.random() - 0.5) * (coin.price * volatility);
        const newPrice = Math.max(0.01, coin.price + drift);
        const changeDrift = (Math.random() - 0.5) * 0.03;
        return {
          ...coin,
          price: newPrice,
          change24h: coin.change24h + changeDrift
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredItems = useMemo(() => {
    // In this unified setup, all assets are under COINS for the Crypto/Market view
    return liveCoins.filter(coin => 
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
      coin.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, liveCoins]);

  return (
    <div className="bg-bk-bg min-h-screen pb-24 flex flex-col font-sans animate-in fade-in duration-300">
      <div className="px-4 pt-4 pb-2 sticky top-0 bg-bk-bg z-30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bk-subtext" size={18} />
          <input
            type="text"
            placeholder={t('market.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1C2025] border border-transparent focus:border-bk-divider rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-bk-subtext outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex bg-[#15191E] mx-4 my-2 p-1 rounded-xl border border-bk-divider">
          <button 
            onClick={() => setMarketType('CRYPTO')} 
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${marketType === 'CRYPTO' ? 'bg-bk-green text-white shadow-lg' : 'text-bk-subtext'}`}
          >
            {t('market.crypto')}
          </button>
          <button 
            onClick={() => setMarketType('STOCKS')} 
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${marketType === 'STOCKS' ? 'bg-blue-500 text-white shadow-lg' : 'text-bk-subtext'}`}
          >
            {t('market.stocks')}
          </button>
      </div>

      <div className="flex px-4 py-2 text-[10px] text-bk-subtext font-medium border-b border-bk-divider/20 uppercase bg-[#0B0E11]/80 backdrop-blur-md sticky top-[125px] z-10">
        <div className="w-1/2">{t('market.asset')}</div>
        <div className="w-1/4 text-right">{t('market.last_price')}</div>
        <div className="w-1/4 text-right">{t('market.change_24h')}</div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filteredItems.map((item: any) => (
          <div 
            key={item.symbol} 
            onClick={() => onCoinSelect(item)}
            className="flex items-center px-4 py-3.5 border-b border-bk-divider/10 transition-all hover:bg-white/5 cursor-pointer active:bg-white/10"
          >
            <div className="w-1/2 flex items-center gap-3">
              <Star size={16} className="text-bk-subtext opacity-30" />
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-bk-divider/10 shadow-sm aspect-square p-1.5">
                <img 
                  src={item.icon} 
                  alt={item.symbol} 
                  className="w-full h-full object-contain" 
                  loading="lazy"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.symbol}&background=181B1F&color=27C052&bold=true`;
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-none mb-1">{item.symbol}</span>
                <span className="text-[10px] text-bk-subtext truncate max-w-[120px]">{item.name}</span>
              </div>
            </div>
            <div className="w-1/4 text-right pr-2">
              <div className="text-[14px] font-bold text-white font-mono">
                {item.price.toLocaleString(undefined, { 
                  minimumFractionDigits: item.price < 100 ? 2 : 0,
                  maximumFractionDigits: 2 
                })}
              </div>
            </div>
            <div className="w-1/4 flex justify-end">
              <div className={`min-w-[70px] py-1.5 rounded-md text-center text-xs font-bold text-white ${item.change24h >= 0 ? 'bg-bk-green shadow-[0_0_10px_rgba(39,192,82,0.3)]' : 'bg-bk-red shadow-[0_0_10px_rgba(255,77,79,0.3)]'}`}>
                {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="py-20 text-center opacity-40 italic text-sm">
             {t('history.not_found')}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketScreen;
