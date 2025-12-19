
import React, { useState, useEffect } from 'react';
import { Bell, Search, QrCode, Zap, Wallet, Bitcoin, RefreshCcw, Gift, Eye, EyeOff, ArrowDownLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { COINS, QUICK_MENU } from '../constants';
import { Tab, Coin } from '../types';
import BannerCarousel from '../components/BannerCarousel';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
    setTab: (tab: Tab) => void;
}

const HomeScreen: React.FC<Props> = ({ setTab }) => {
  const { t } = useLanguage();
  const [showBalance, setShowBalance] = useState(false);
  const [liveCoins, setLiveCoins] = useState<Coin[]>(COINS);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCoins(prev => prev.map(coin => {
        const volatility = 0.0015;
        const drift = (Math.random() - 0.5) * (coin.price * volatility);
        const newPrice = Math.max(0.1, coin.price + drift);
        const changeDrift = (Math.random() - 0.5) * 0.02;
        return {
          ...coin,
          price: newPrice,
          change24h: coin.change24h + changeDrift
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-bk-bg min-h-screen pb-24 animate-in fade-in duration-500">
      <div className="bg-gradient-to-b from-bk-greenHover/20 to-bk-bg p-4 sticky top-0 z-20 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-bk-card/50 p-1 rounded-full border border-bk-green/30">
                <div className="w-8 h-8 bg-bk-green/20 rounded-full flex items-center justify-center">
                    <span className="text-bk-green text-xs font-bold">BK</span>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{t('home.welcome')}</span>
                    <span className="bg-bk-green/20 text-bk-green text-[10px] px-1.5 py-0.5 rounded">{t('home.level')} 3</span>
                </div>
            </div>
          </div>
          <div className="flex gap-4 text-white"><Search size={20} /><QrCode size={20} /><Bell size={20} /></div>
        </div>
      
        <div className="bg-gradient-to-br from-bk-green/90 to-bk-greenHover rounded-2xl p-4 shadow-lg mb-2 text-white relative overflow-hidden">
            <div className="relative z-10">
                <div className="mb-1">
                  <span className="text-sm opacity-90">{t('home.total_balance')}</span>
                  <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">{showBalance ? '1,450,230.50' : '******'} <span className="text-sm font-normal ml-1">THB</span></span>
                      <button onClick={() => setShowBalance(!showBalance)} className="p-1 rounded-full bg-white/10">{showBalance ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                  </div>
                </div>
            </div>
        </div>
      </div>

      <BannerCarousel />

      <div className="grid grid-cols-5 gap-2 px-4 mb-8">
        {QUICK_MENU.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-bk-card rounded-xl flex items-center justify-center text-bk-green border border-bk-divider shadow-sm">
                {item.id === 1 && <Zap size={20} />}
                {item.id === 2 && <ArrowDownLeft size={20} />}
                {item.id === 3 && <Bitcoin size={20} />}
                {item.id === 4 && <RefreshCcw size={20} />}
                {item.id === 5 && <Gift size={20} />}
            </div>
            <span className="text-[10px] text-bk-subtext text-center leading-tight font-medium">{t(`quick.${item.id}`) || item.label}</span>
          </div>
        ))}
      </div>

      <div className="px-4 mb-10">
        <div className="flex gap-6 border-b border-bk-divider mb-4 text-sm font-medium">
            <button className="text-white border-b-2 border-bk-green pb-2">{t('market.crypto')}</button>
            <button className="text-bk-subtext pb-2" onClick={() => setTab(Tab.MARKET)}>{t('home.top_volume')} <ChevronRight size={12} className="inline"/></button>
        </div>
        <div className="flex flex-col gap-4">
          {liveCoins.slice(0, 6).map((coin) => (
            <div key={coin.symbol} onClick={() => setTab(Tab.MARKET)} className="flex justify-between items-center p-1 rounded-lg transition-colors active:bg-white/5 cursor-pointer">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-bk-divider/20 shadow-sm aspect-square p-1.5">
                      <img 
                        src={coin.icon} 
                        alt={coin.symbol} 
                        className="w-full h-full object-contain" 
                        style={{ imageRendering: '-webkit-optimize-contrast' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=181B1F&color=27C052&bold=true`;
                        }}
                      />
                  </div>
                  <div>
                      <div className="text-sm font-bold text-white">{coin.symbol}<span className="text-bk-subtext text-xs ml-1">/THB</span></div>
                      <div className="text-[10px] text-bk-subtext font-light truncate max-w-[150px]">{coin.name}</div>
                  </div>
              </div>
              <div className="text-right">
                  <div className="text-sm font-bold text-white font-mono">{coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className={`text-xs font-medium ${coin.change24h >= 0 ? 'text-bk-green' : 'text-bk-red'}`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </div>
              </div>
            </div>
          ))}
          <button onClick={() => setTab(Tab.MARKET)} className="w-full py-4 text-bk-subtext text-xs font-bold hover:text-white transition-colors">
              {t('home.view_all_market')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
