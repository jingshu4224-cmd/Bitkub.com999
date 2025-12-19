
import React, { useState, useEffect } from 'react';
import { Star, MoreVertical, Bell, ChevronDown } from 'lucide-react';
import { COINS } from '../constants';
import CryptoChart from '../components/CryptoChart';
import { Coin } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  initialCoin?: Coin;
}

const TradeScreen: React.FC<Props> = ({ initialCoin }) => {
  const { t } = useLanguage();
  const [selectedCoin, setSelectedCoin] = useState<Coin>(initialCoin || COINS[0]);
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState('Limit');
  const [amount, setAmount] = useState('');

  return (
    <div className="bg-bk-bg min-h-screen pb-24 text-white font-sans animate-in fade-in duration-300">
      <div className="sticky top-0 z-20 bg-bk-bg border-b border-bk-divider p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <img src={selectedCoin.icon} alt={selectedCoin.symbol} className="w-8 h-8 rounded-full shadow-inner bg-white/5"/>
            <div>
                <div className="flex items-center gap-1 font-bold text-sm">{selectedCoin.symbol}/THB <ChevronDown size={14} className="text-bk-subtext"/></div>
                <div className={`text-[11px] font-medium ${selectedCoin.change24h >= 0 ? 'text-bk-green' : 'text-bk-red'}`}>{selectedCoin.price.toLocaleString()} ({selectedCoin.change24h}%)</div>
            </div>
        </div>
        <div className="flex gap-4"><Bell size={20} className="text-bk-subtext"/><Star size={20} className="text-bk-subtext"/><MoreVertical size={20} className="text-bk-subtext"/></div>
      </div>

      <CryptoChart coin={selectedCoin} />

      <div className="flex bg-[#15191E] border-b border-bk-divider min-h-[400px]">
        <div className="w-[45%] border-r border-bk-divider flex flex-col pt-2 opacity-50 px-2 italic text-[10px] items-center justify-center">Order Book Simulation</div>
        <div className="w-[55%] p-3 bg-bk-bg">
             <div className="flex bg-[#1C2025] rounded-lg p-1 mb-4 border border-bk-divider">
                 <button onClick={() => setSide('BUY')} className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${side === 'BUY' ? 'bg-bk-green text-white shadow-lg' : 'text-bk-subtext'}`}>{t('trade.buy')}</button>
                 <button onClick={() => setSide('SELL')} className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${side === 'SELL' ? 'bg-bk-red text-white shadow-lg' : 'text-bk-subtext'}`}>{t('trade.sell')}</button>
             </div>
             <div className="flex gap-1 mb-4">
                <button onClick={() => setOrderType('Limit')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md border ${orderType === 'Limit' ? 'bg-[#2A2E35] border-bk-green text-white' : 'border-bk-divider text-bk-subtext'}`}>{t('trade.limit')}</button>
                <button onClick={() => setOrderType('Market')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md border ${orderType === 'Market' ? 'bg-[#2A2E35] border-bk-green text-white' : 'border-bk-divider text-bk-subtext'}`}>{t('trade.market')}</button>
             </div>
             <div className="space-y-4">
                <div className="group"><label className="text-[10px] text-bk-subtext mb-1 block">{t('trade.price')}</label><input type="text" readOnly value={selectedCoin.price.toFixed(2)} className="w-full bg-[#1C2025] border border-bk-divider rounded-lg px-3 py-2.5 text-sm text-right focus:border-bk-green focus:outline-none" /></div>
                <div><label className="text-[10px] text-bk-subtext mb-1 block">{t('trade.amount')}</label><input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-[#1C2025] border border-bk-divider rounded-lg px-3 py-2.5 text-sm text-right focus:border-bk-green focus:outline-none" /></div>
                <button className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all active:scale-95 ${side === 'BUY' ? 'bg-bk-green' : 'bg-bk-red'}`}>{(side === 'BUY' ? t('trade.buy') : t('trade.sell'))} {selectedCoin.symbol}</button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default TradeScreen;
