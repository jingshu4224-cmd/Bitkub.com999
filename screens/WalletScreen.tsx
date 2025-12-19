
import React, { useState, useEffect, useMemo } from 'react';
import { History, Search, CheckCircle2, XCircle, Wallet, ArrowDownLeft, ArrowUpRight, Eye, EyeOff, FileText, PieChart, Landmark, ChevronRight, X, Clock, AlertCircle, RefreshCw, ExternalLink, Filter, Bell, CheckCircle } from 'lucide-react';
import { COINS } from '../constants';
import { useLanguage } from '../i18n/LanguageContext';

interface Transaction {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  price: number;
  total: number;
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
  icon: string | null | undefined;
  slipImage?: string;
  channel?: string;
  bankAccountName?: string;
  bankAccountNo?: string;
  balanceAfter: number;
}

const WalletScreen: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ASSETS' | 'HISTORY'>('ASSETS');
  const [showBalance, setShowBalance] = useState(true);
  const [thbBalance, setThbBalance] = useState(1450230.50);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const transactions: Transaction[] = useMemo(() => [
    {
      id: 'TX9948201',
      symbol: 'THB',
      type: 'DEPOSIT',
      amount: 25000,
      price: 1,
      total: 25000,
      date: '15/01/2024, 09:15:30',
      status: 'Success',
      icon: null,
      channel: 'KBank (Kasikorn)',
      bankAccountName: 'RUENG*** PAN***',
      bankAccountNo: '1234567890',
      balanceAfter: 1450230.50,
      slipImage: 'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?q=80&w=400&auto=format&fit=crop'
    }
  ], []);

  const maskAccountNo = (no?: string) => {
    if (!no) return '-';
    return `****${no.slice(-4)}`;
  };

  return (
    <div className="bg-bk-bg min-h-screen pb-24 font-sans animate-in fade-in duration-500 relative">
      {/* Header */}
      <div className="bg-[#0B0E11] p-4 sticky top-0 z-20 border-b border-bk-divider/50 backdrop-blur-md flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Wallet className="text-bk-green" /> {t('nav.wallet')}</h1>
          <button onClick={() => setActiveTab('HISTORY')} className={`transition-colors ${activeTab === 'HISTORY' ? 'text-bk-green' : 'text-bk-subtext'}`}><FileText size={20}/></button>
      </div>

      <div className="px-4 py-6">
          {/* Balance */}
          <div className="bg-gradient-to-br from-[#1E2329] to-[#0F1216] rounded-3xl p-6 shadow-2xl border border-bk-divider mb-6">
               <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-2"><Landmark size={16} className="text-bk-green"/><span className="text-xs font-medium text-bk-subtext">{t('wallet.balance')}</span></div>
                   <button onClick={() => setShowBalance(!showBalance)} className="text-bk-subtext">{showBalance ? <Eye size={18}/> : <EyeOff size={18}/>}</button>
               </div>
               <div className="text-3xl font-bold text-white mb-6">
                   {showBalance ? thbBalance.toLocaleString() : '******'} <span className="text-sm font-normal text-bk-subtext ml-1">THB</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <button className="flex items-center justify-center gap-2 bg-bk-green text-white py-3 rounded-2xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-bk-green/20"><ArrowDownLeft size={18} /> {t('wallet.deposit')}</button>
                   <button className="flex items-center justify-center gap-2 bg-[#2A2E35] text-white py-3 rounded-2xl font-bold text-sm border border-bk-divider active:scale-95 transition-all"><ArrowUpRight size={18} /> {t('wallet.withdraw')}</button>
               </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#181B1F] rounded-2xl p-1 mb-6 border border-bk-divider">
              <button onClick={() => setActiveTab('ASSETS')} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'ASSETS' ? 'bg-[#2A2E35] text-white shadow-lg' : 'text-bk-subtext'}`}>{t('wallet.assets')}</button>
              <button onClick={() => setActiveTab('HISTORY')} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'HISTORY' ? 'bg-[#2A2E35] text-white shadow-lg' : 'text-bk-subtext'}`}>{t('wallet.history')}</button>
          </div>

          {/* Content */}
          {activeTab === 'HISTORY' ? (
            <div className="animate-in fade-in duration-300 space-y-3">
                {transactions.map(tx => (
                    <div key={tx.id} onClick={() => setSelectedTx(tx)} className="bg-[#181B1F] p-4 rounded-2xl border border-bk-divider/50 hover:border-bk-green/30 transition-all cursor-pointer">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-bk-green/10 flex items-center justify-center text-bk-green"><ArrowDownLeft size={20}/></div>
                                <div><h4 className="text-sm font-bold text-white">{t('history.type.deposit')}</h4><p className="text-[10px] text-bk-subtext mt-1">{tx.date}</p></div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-bk-green">+{tx.total.toLocaleString()} THB</p>
                                <div className="text-[9px] font-bold mt-1 text-bk-green flex items-center justify-end gap-1"><CheckCircle2 size={10}/> {t('deposit.success')}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          ) : (
            <div className="space-y-3">
                {COINS.map(coin => (
                    <div key={coin.symbol} className="flex justify-between items-center p-4 bg-[#181B1F]/40 border-b border-bk-divider/30 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <img src={coin.icon} className="w-10 h-10 rounded-full bg-white/5 p-1" />
                            <div><div className="font-bold text-sm text-white">{coin.symbol}</div><div className="text-[10px] text-bk-subtext">{coin.name}</div></div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-sm text-white">{showBalance ? (coin.balance || 0).toLocaleString() : '******'}</div>
                        </div>
                    </div>
                ))}
            </div>
          )}
      </div>

      {/* Transaction Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
           <div className="bg-bk-card w-full max-w-sm rounded-3xl border border-bk-divider shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              <div className="p-4 border-b border-bk-divider flex justify-between items-center bg-bk-bg/50">
                  <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-bk-green"/> {t('history.title')}</h3>
                  <button onClick={() => setSelectedTx(null)} className="p-2"><X size={24} className="text-bk-subtext" /></button>
              </div>
              <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
                  <div className="text-center py-6 bg-bk-bg/50 rounded-3xl border border-bk-divider/50">
                      <p className="text-[10px] text-bk-subtext uppercase font-bold tracking-widest mb-1">{t('history.type')}</p>
                      <div className="text-3xl font-bold mb-3 text-bk-green">+{selectedTx.total.toLocaleString()} ฿</div>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold bg-bk-green/20 text-bk-green">
                         <CheckCircle size={14}/> {t('history.status.success')}
                      </div>
                  </div>
                  <div className="space-y-4 px-1 pb-4">
                      <DetailRow label={t('history.tx_id')} value={selectedTx.id} />
                      <DetailRow label={t('history.date')} value={selectedTx.date} />
                      <DetailRow label={t('history.method')} value={selectedTx.channel} />
                      <DetailRow label={t('history.account_name')} value={selectedTx.bankAccountName} />
                      <DetailRow label={t('history.account_no')} value={maskAccountNo(selectedTx.bankAccountNo)} />
                      <DetailRow label={t('history.balance_after')} value={`${selectedTx.balanceAfter.toLocaleString()} THB`} isGreen />
                  </div>
              </div>
              <div className="p-6 border-t border-bk-divider">
                  <button onClick={() => setSelectedTx(null)} className="w-full py-4 rounded-2xl bg-[#2A2E35] text-white font-bold text-sm shadow-xl">{t('common.confirm')}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value, isGreen = false }: any) => (
    <div className="flex justify-between items-start gap-4">
        <span className="text-[10px] text-bk-subtext uppercase font-bold tracking-wider pt-0.5">{label}</span>
        <span className={`text-xs text-right overflow-hidden truncate ${isGreen ? 'text-bk-green font-bold' : 'text-white'}`}>{value}</span>
    </div>
);

export default WalletScreen;
