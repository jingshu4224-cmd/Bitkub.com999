
import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Clock, Wallet, CheckCircle, Zap, History, Users, Activity, X, AlertCircle, RefreshCw, ArrowUpRight, CheckCircle2, DollarSign, Calendar } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface TradingRoom {
  id: number;
  nameKey: string;
  min: number;
  max: number;
  duration: number; // in seconds
  profitPercent: number;
  color: string;
  bgColor: string;
}

interface TradeHistory {
  id: string;
  roomNameKey: string;
  amount: number;
  profit: number;
  startTime: string;
  endTime: string;
  status: 'Completed';
}

interface ActiveTrade {
  roomId: number;
  amount: number;
  startTime: number;
  endTime: number;
  remaining: number;
}

const ROOMS: TradingRoom[] = [
  { id: 1, nameKey: 'invest.room_1', min: 1000, max: 100000, duration: 300, profitPercent: 5, color: 'text-bk-green', bgColor: 'bg-bk-green/10' },
  { id: 2, nameKey: 'invest.room_2', min: 100000, max: 500000, duration: 300, profitPercent: 7, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
  { id: 3, nameKey: 'invest.room_3', min: 500000, max: 1000000, duration: 300, profitPercent: 10, color: 'text-purple-400', bgColor: 'bg-purple-400/10' },
  { id: 4, nameKey: 'invest.room_vip', min: 1000000, max: 1000000000, duration: 300, profitPercent: 20, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
];

const InvestScreen: React.FC = () => {
  const { t, locale } = useLanguage();
  
  // States
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('thb_balance');
    return saved ? parseFloat(saved) : 1450230.50;
  });
  
  const [history, setHistory] = useState<TradeHistory[]>(() => {
    const saved = localStorage.getItem('trade_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(() => {
    const saved = localStorage.getItem('active_trade');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    const now = Date.now();
    if (parsed.endTime < now) return null;
    return { ...parsed, remaining: Math.round((parsed.endTime - now) / 1000) };
  });

  const [selectedRoom, setSelectedRoom] = useState<TradingRoom | null>(null);
  const [inputAmount, setInputAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState<TradeHistory | null>(null);

  useEffect(() => {
    localStorage.setItem('thb_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('trade_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (activeTrade) {
      localStorage.setItem('active_trade', JSON.stringify(activeTrade));
    } else {
      localStorage.removeItem('active_trade');
    }
  }, [activeTrade]);

  useEffect(() => {
    if (!activeTrade) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const left = Math.round((activeTrade.endTime - now) / 1000);
      
      if (left <= 0) {
        finishTrade();
        clearInterval(interval);
      } else {
        setActiveTrade(prev => prev ? { ...prev, remaining: left } : null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTrade]);

  const startTrade = () => {
    if (!selectedRoom) return;
    const amount = parseFloat(inputAmount);
    
    if (isNaN(amount) || amount < selectedRoom.min) {
      setError(t('invest.err_min'));
      return;
    }
    if (amount > selectedRoom.max) {
      setError(t('invest.err_max'));
      return;
    }
    if (amount > balance) {
      setError(t('invest.err_balance'));
      return;
    }

    const now = Date.now();
    const trade: ActiveTrade = {
      roomId: selectedRoom.id,
      amount: amount,
      startTime: now,
      endTime: now + (selectedRoom.duration * 1000),
      remaining: selectedRoom.duration
    };

    setBalance(prev => prev - amount);
    setActiveTrade(trade);
    setSelectedRoom(null);
    setInputAmount('');
    setError(null);
  };

  const finishTrade = () => {
    if (!activeTrade) return;

    const room = ROOMS.find(r => r.id === activeTrade.roomId)!;
    const profit = activeTrade.amount * (room.profitPercent / 100);
    const totalReturn = activeTrade.amount + profit;

    const newHistory: TradeHistory = {
      id: `TR${Math.floor(Math.random() * 900000) + 100000}`,
      roomNameKey: room.nameKey,
      amount: activeTrade.amount,
      profit: profit,
      startTime: new Date(activeTrade.startTime).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US'),
      endTime: new Date().toLocaleString(locale === 'th' ? 'th-TH' : 'en-US'),
      status: 'Completed'
    };

    setBalance(prev => prev + totalReturn);
    setHistory(prev => [newHistory, ...prev]);
    setShowResultModal(newHistory);
    setActiveTrade(null);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-bk-bg min-h-screen pb-24 relative px-4 pt-6 overflow-x-hidden animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="text-bk-green fill-bk-green animate-pulse" size={24}/> 
                  {t('invest.title')}
              </h1>
              <div className="bg-[#1C2025] border border-bk-divider px-4 py-2 rounded-2xl flex items-center gap-3 shadow-inner">
                  <div className="bg-bk-green/20 p-1.5 rounded-full"><Wallet size={16} className="text-bk-green" /></div>
                  <div className="flex flex-col">
                      <span className="text-[10px] text-bk-subtext font-bold uppercase leading-none mb-1">{t('wallet.available_thb')}</span>
                      <span className="text-white font-mono font-bold text-sm leading-none">{balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
              </div>
          </div>

          {activeTrade && (
            <div className="bg-gradient-to-r from-bk-greenHover/20 to-transparent border border-bk-green/30 p-4 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group">
               <div className="absolute inset-0 bg-bk-green/5 animate-pulse"></div>
               <div className="relative z-10">
                   <p className="text-[10px] text-bk-green font-bold uppercase mb-1 tracking-wider">{t('invest.trading_active')}</p>
                   <p className="text-white text-xs font-medium">{t('invest.investing_label')}: <span className="font-bold">{activeTrade.amount.toLocaleString()} THB</span></p>
               </div>
               <div className="text-right relative z-10">
                   <div className="flex items-center gap-2 text-white font-mono text-2xl font-bold">
                       <Clock className="text-bk-green animate-spin-slow" size={20} />
                       {formatTime(activeTrade.remaining)}
                   </div>
                   <div className="w-24 h-1 bg-bk-divider rounded-full mt-2 overflow-hidden">
                       <div 
                         className="h-full bg-bk-green transition-all duration-1000" 
                         style={{ width: `${(activeTrade.remaining / (ROOMS.find(r => r.id === activeTrade.roomId)?.duration || 300)) * 100}%` }}
                       ></div>
                   </div>
               </div>
            </div>
          )}
      </div>

      <div className="grid gap-4 mb-8">
          <h3 className="text-xs font-bold text-bk-subtext mb-1 ml-1 uppercase flex items-center gap-2"><Users size={14} /> {t('invest.available_rooms')}</h3>
          {ROOMS.map(room => (
            <div 
              key={room.id} 
              onClick={() => !activeTrade && setSelectedRoom(room)}
              className={`bg-bk-card border border-bk-divider rounded-3xl p-5 relative overflow-hidden group shadow-lg transition-all active:scale-95 ${activeTrade ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-bk-green/40'}`}
            >
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <h2 className={`text-lg font-bold mb-1 ${room.color}`}>{t(room.nameKey)}</h2>
                        <div className="flex items-center gap-2 text-bk-subtext text-[10px] font-medium uppercase tracking-wider">
                            <Clock size={12} /> {t('invest.duration')}: <span className="text-white">{t('invest.5_mins')}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] text-bk-subtext mb-0.5 uppercase font-bold">{t('invest.profit_per_round')}</div>
                        <div className={`text-2xl font-black ${room.color}`}>+{room.profitPercent}%</div>
                    </div>
                </div>
                <div className="flex justify-between items-center relative z-10">
                    <div className={`${room.bgColor} rounded-xl px-4 py-2 border border-white/5`}>
                        <p className="text-[9px] text-bk-subtext mb-0.5 uppercase font-bold">{t('invest.limit')}</p>
                        <p className="text-white font-mono text-xs">{room.min.toLocaleString()} - {room.max.toLocaleString()} THB</p>
                    </div>
                    <button className={`p-3 rounded-full ${room.bgColor} ${room.color} transition-transform group-hover:rotate-45`}>
                        <ArrowUpRight size={20} />
                    </button>
                </div>
                <div className={`absolute -right-4 -top-4 w-24 h-24 ${room.bgColor} blur-3xl rounded-full opacity-20`}></div>
            </div>
          ))}
      </div>

      <div className="mb-10">
          <h3 className="text-xs font-bold text-bk-subtext mb-3 uppercase flex items-center gap-2"><History size={14} /> {t('invest.history')}</h3>
          {history.length === 0 ? (
            <div className="text-center py-10 text-bk-subtext opacity-50 bg-bk-card/30 rounded-3xl border border-bk-divider border-dashed">
                <Activity size={32} className="mx-auto mb-2" />
                <p className="text-xs">{t('history.not_found')}</p>
            </div>
          ) : (
            <div className="space-y-3">
               {history.map(item => (
                 <div key={item.id} className="bg-bk-card border border-bk-divider/50 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="bg-bk-green/10 p-2 rounded-lg"><CheckCircle2 size={16} className="text-bk-green" /></div>
                           <div className="flex flex-col">
                               <span className="text-xs font-bold text-white">{t(item.roomNameKey)}</span>
                               <span className="text-[9px] text-bk-subtext">{item.endTime}</span>
                           </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-bk-green">+{item.profit.toLocaleString()} THB</div>
                            <div className="text-[9px] text-bk-subtext">{t('invest.history.amount')}: {item.amount.toLocaleString()}</div>
                        </div>
                    </div>
                 </div>
               ))}
            </div>
          )}
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in backdrop-blur-md">
           <div className="bg-bk-card w-full max-w-sm rounded-3xl border border-bk-divider shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-bk-divider flex justify-between items-center bg-bk-bg/50">
                  <h3 className={`font-bold flex items-center gap-2 ${selectedRoom.color}`}><TrendingUp size={18}/> {t(selectedRoom.nameKey)}</h3>
                  <button onClick={() => { setSelectedRoom(null); setError(null); setInputAmount(''); }} className="p-2"><X size={24} className="text-bk-subtext" /></button>
              </div>
              <div className="p-6 space-y-6">
                  {error && (
                    <div className="bg-bk-red/10 border border-bk-red/20 p-3 rounded-xl flex items-center gap-2 text-bk-red text-xs animate-in shake-in">
                       <AlertCircle size={14} /> {error}
                    </div>
                  )}

                  <div className="bg-[#1C2025] rounded-2xl p-4 border border-bk-divider flex flex-col items-center">
                       <span className="text-[10px] text-bk-subtext font-bold uppercase mb-2">{t('wallet.balance')}</span>
                       <span className="text-xl font-bold text-white">{balance.toLocaleString()} THB</span>
                  </div>

                  <div className="space-y-2">
                      <label className="text-[10px] text-bk-subtext uppercase font-bold ml-1">{t('invest.amount')}</label>
                      <div className="relative">
                          <input 
                            type="number" 
                            placeholder={`${selectedRoom.min.toLocaleString()} - ${selectedRoom.max.toLocaleString()}`}
                            className="w-full bg-[#1C2025] border border-bk-divider rounded-2xl px-5 py-4 text-white font-mono focus:border-bk-green focus:outline-none transition-all"
                            value={inputAmount}
                            onChange={e => setInputAmount(e.target.value)}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-bk-subtext font-bold text-xs">THB</div>
                      </div>
                  </div>

                  <div className="bg-bk-green/10 p-4 rounded-2xl flex items-center gap-4 border border-bk-green/20">
                      <div className="bg-bk-green/20 p-2 rounded-full"><Clock size={16} className="text-bk-green" /></div>
                      <div className="flex-1">
                          <p className="text-[10px] text-bk-subtext uppercase font-bold">{t('invest.profit_per_round')}</p>
                          <p className="text-bk-green font-bold text-lg">+{selectedRoom.profitPercent}% <span className="text-xs font-normal text-bk-subtext">{t('invest.settlement_in_5')}</span></p>
                      </div>
                  </div>

                  <button 
                    onClick={startTrade}
                    className="w-full bg-bk-green text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-bk-green/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap size={18} fill="white" /> {t('invest.start_trade')}
                  </button>
              </div>
           </div>
        </div>
      )}

      {showResultModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 animate-in fade-in backdrop-blur-md">
           <div className="bg-bk-card w-full max-w-sm rounded-[40px] border border-bk-divider shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col p-8 items-center text-center">
               <div className="w-20 h-20 bg-bk-green/20 rounded-full flex items-center justify-center mb-6 border border-bk-green/40">
                   <CheckCircle size={40} className="text-bk-green" />
               </div>
               <h2 className="text-2xl font-black text-white mb-2">{t('invest.finish_title')}</h2>
               <p className="text-bk-subtext text-xs mb-8 uppercase tracking-widest font-bold">{t('invest.success_transaction')}</p>
               
               <div className="w-full space-y-4 mb-10">
                   <div className="flex justify-between items-center bg-[#1C2025] px-6 py-4 rounded-3xl border border-bk-divider">
                       <span className="text-xs text-bk-subtext font-bold uppercase">{t('invest.history.amount')}</span>
                       <span className="text-white font-bold">{showResultModal.amount.toLocaleString()} THB</span>
                   </div>
                   <div className="flex justify-between items-center bg-bk-green/10 px-6 py-4 rounded-3xl border border-bk-green/20">
                       <span className="text-xs text-bk-green font-bold uppercase">{t('invest.result_profit')}</span>
                       <span className="text-bk-green font-black text-lg">+{showResultModal.profit.toLocaleString()} THB</span>
                   </div>
               </div>

               <button 
                 onClick={() => setShowResultModal(null)}
                 className="w-full bg-bk-green text-white py-4 rounded-3xl font-bold text-sm shadow-xl shadow-bk-green/20 active:scale-95 transition-all"
               >
                 {t('common.confirm')}
               </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default InvestScreen;
