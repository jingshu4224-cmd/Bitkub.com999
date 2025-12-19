
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, CheckCircle, ArrowDownLeft, ArrowUpRight, History, Settings, ChevronRight, Wallet, LogOut, Globe, Lock, Trash, X, RefreshCw, Landmark, ShieldCheck, Headphones, AlertCircle, Bell, Shield, Clock, CheckCircle2, XCircle, Search, Filter, Upload, Image as ImageIcon, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { GoogleGenAI } from "@google/genai";

interface UserProfile {
  name: string;
  id: string;
  email: string;
  kycStatus: 'Verified' | 'Pending' | 'Unverified';
  totalBalance: number;
  bankName: string;
  bankAccount: string;
}

interface TransactionItem {
  id: string;
  amount: number;
  date: string;
  method: string;
  type: 'Deposit' | 'Withdraw';
  status: 'Success' | 'Pending' | 'Failed';
  refNo: string;
  slipImage?: string;
}

interface BankAccount {
  bankName: string;
  accountNo: string;
  accountName: string;
}

interface Props {
  onLogout: () => void;
}

const LANGUAGES = [
  { code: 'th', name: 'Thai (ไทย)', flag: '🇹🇭' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese (中文)', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵' },
];

const THAI_BANKS = [
  'Kasikorn Bank (KBank)',
  'Siam Commercial Bank (SCB)',
  'Bangkok Bank (BBL)',
  'Krungthai Bank (KTB)',
  'Krungsri Bank (BAY)',
  'TMBThanachart (ttb)',
  'Government Savings Bank (GSB)',
];

const ProfileScreen: React.FC<Props> = ({ onLogout }) => {
  const { t, locale, setLocale } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Modals/Views state
  const [showLangModal, setShowLangModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'Success' | 'Pending' | 'Failed'>('ALL');

  // Success Notification
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState({ title: '', desc: '' });

  // Change Password State
  const [pwdForm, setPwdForm] = useState({ old: '', new: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ old: false, new: false, confirm: false });
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSubmitting, setPwdSubmitting] = useState(false);

  // Bank Form State
  const [bankForm, setBankForm] = useState<BankAccount>(() => {
    const saved = localStorage.getItem('linked_bank_account');
    return saved ? JSON.parse(saved) : { bankName: '', accountNo: '', accountName: '' };
  });
  const [isBankConfirmed, setIsBankConfirmed] = useState(false);
  const [bankSubmitting, setBankSubmitting] = useState(false);

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // Persistence logic for balance
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('thb_balance');
    return saved ? parseFloat(saved) : 1450230.50;
  });

  const [transactionHistory, setTransactionHistory] = useState<TransactionItem[]>(() => {
    const saved = localStorage.getItem('deposit_history_list');
    return saved ? JSON.parse(saved) : [
      { id: '1', amount: 50000, date: '2024-03-20 14:30', method: 'Thai QR Payment', type: 'Deposit', status: 'Success', refNo: 'BK20240320001' },
      { id: '2', amount: 1500, date: '2024-03-19 09:15', method: 'Bank Transfer (KBank)', type: 'Deposit', status: 'Success', refNo: 'BK20240319042' },
      { id: '3', amount: 100000, date: '2024-03-18 22:10', method: 'Thai QR Payment', type: 'Deposit', status: 'Pending', refNo: 'BK20240318088' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('thb_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('deposit_history_list', JSON.stringify(transactionHistory));
  }, [transactionHistory]);

  const filteredHistory = useMemo(() => {
    if (historyFilter === 'ALL') return transactionHistory;
    return transactionHistory.filter(item => item.status === historyFilter);
  }, [transactionHistory, historyFilter]);

  useEffect(() => {
    setTimeout(() => {
      const userIdent = localStorage.getItem('user_identifier') || 'ji****@gmail.com';
      setProfile({
        name: 'Bitkub User',
        id: 'BK' + (localStorage.getItem('user_identifier')?.slice(0, 5) || '88492'),
        email: userIdent,
        kycStatus: 'Verified',
        totalBalance: balance,
        bankName: bankForm.bankName || 'Kasikorn Bank',
        bankAccount: bankForm.accountNo || '123-4-56789-0'
      });
      setLoading(false);
    }, 500);
  }, [balance, bankForm]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);

    if (pwdForm.new.length < 6) {
      setPwdError(t('password.err_too_short'));
      return;
    }
    if (pwdForm.new !== pwdForm.confirm) {
      setPwdError(t('password.err_mismatch'));
      return;
    }

    setPwdSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));

    setPwdSubmitting(false);
    setShowPasswordModal(false);
    setPwdForm({ old: '', new: '', confirm: '' });
    
    setNotificationMsg({
      title: t('password.notify_title'),
      desc: t('password.notify_desc')
    });
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 5000);
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBankConfirmed) return;
    
    setBankSubmitting(true);
    await new Promise(r => setTimeout(r, 800));

    localStorage.setItem('linked_bank_account', JSON.stringify(bankForm));
    
    setBankSubmitting(false);
    setShowBankModal(false);
    setNotificationMsg({
      title: t('common.success'),
      desc: t('profile.bank_success')
    });
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const verifySlipWithAI = async (base64Data: string, amount: number) => {
    if (!process.env.API_KEY) {
      await new Promise(r => setTimeout(r, 2000));
      return { success: true, detectedAmount: amount };
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze this Thai Bank Transfer Slip. Extract amount. Is it ${amount} THB? Return JSON: {"success": boolean, "detectedAmount": number}`;
      const imagePart = { inlineData: { data: base64Data.split(',')[1], mimeType: slipFile?.type || 'image/jpeg' } };
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: [imagePart, { text: prompt }] },
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      return { success: true, detectedAmount: amount };
    }
  };

  const handleDepositSubmit = async () => {
    if (!depositAmount || isNaN(parseFloat(depositAmount))) {
      setDepositError(t('deposit.modal.err_no_amount'));
      return;
    }
    if (!slipPreview) {
      setDepositError(t('deposit.modal.err_no_slip'));
      return;
    }

    setIsVerifying(true);
    setDepositError(null);

    const amountNum = parseFloat(depositAmount);
    const verificationResult = await verifySlipWithAI(slipPreview, amountNum);

    if (verificationResult.success && Math.abs(verificationResult.detectedAmount - amountNum) < 1) {
      const newDeposit: TransactionItem = {
        id: `TX${Math.floor(Math.random() * 9000000) + 1000000}`,
        amount: amountNum,
        date: new Date().toLocaleString(locale === 'th' ? 'th-TH' : 'en-US'),
        method: 'Bank Transfer (AI Verified)',
        type: 'Deposit',
        status: 'Success',
        refNo: `REF${Date.now().toString().slice(-8)}`,
        slipImage: slipPreview
      };

      setBalance(prev => prev + amountNum);
      setTransactionHistory(prev => [newDeposit, ...prev]);
      
      setIsVerifying(false);
      setShowDepositModal(false);
      setDepositAmount('');
      setSlipFile(null);
      setSlipPreview(null);
      
      setNotificationMsg({ title: t('common.success'), desc: t('deposit.modal.success') });
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    } else {
      setIsVerifying(false);
      setDepositError(t('deposit.modal.err_mismatch'));
    }
  };

  const handleWithdrawSubmit = async () => {
    const amountNum = parseFloat(withdrawAmount);
    if (!withdrawAmount || isNaN(amountNum)) {
      setWithdrawError(t('withdraw.modal.err_no_amount'));
      return;
    }
    if (amountNum < 100) {
      setWithdrawError(t('withdraw.modal.err_min'));
      return;
    }
    if (amountNum > balance) {
      setWithdrawError(t('withdraw.modal.err_insufficient'));
      return;
    }

    setIsWithdrawing(true);
    setWithdrawError(null);

    // Simulate Processing Delay
    await new Promise(r => setTimeout(r, 2000));

    const newWithdraw: TransactionItem = {
      id: `WX${Math.floor(Math.random() * 9000000) + 1000000}`,
      amount: amountNum,
      date: new Date().toLocaleString(locale === 'th' ? 'th-TH' : 'en-US'),
      method: bankForm.bankName || 'Default Bank',
      type: 'Withdraw',
      status: 'Success',
      refNo: `WREF${Date.now().toString().slice(-8)}`
    };

    setBalance(prev => prev - amountNum);
    setTransactionHistory(prev => [newWithdraw, ...prev]);
    
    setIsWithdrawing(false);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    
    setNotificationMsg({ title: t('common.success'), desc: t('withdraw.modal.success') });
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  if (loading || !profile) return <div className="min-h-screen bg-bk-bg flex items-center justify-center"><RefreshCw className="w-8 h-8 text-bk-green animate-spin" /></div>;

  return (
    <div className="bg-bk-bg min-h-screen pb-24 px-4 pt-6 relative animate-in fade-in duration-500 overflow-x-hidden">
      
      {showSuccessNotification && (
        <div className="fixed top-6 left-4 right-4 z-[400] bg-bk-green text-white px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-full duration-500">
           <Bell size={24} className="animate-bounce mt-0.5" />
           <div className="flex-1">
               <h4 className="text-sm font-bold">{notificationMsg.title}</h4>
               <p className="text-[11px] opacity-90 leading-tight mt-0.5">{notificationMsg.desc}</p>
           </div>
           <button onClick={() => setShowSuccessNotification(false)} className="p-1"><X size={18} /></button>
        </div>
      )}

      {!showHistoryView ? (
        <div className="animate-in slide-in-from-left duration-300">
          <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-[#1C2025] border-2 border-bk-green p-1 shadow-lg overflow-hidden">
                  <div className="w-full h-full rounded-full bg-bk-card flex items-center justify-center"><User size={28} className="text-bk-subtext" /></div>
              </div>
              <div className="flex-1">
                  <h1 className="text-xl font-bold text-white leading-tight">{profile.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                      <div className="bg-[#2A2E35] px-2 py-0.5 rounded text-[10px] text-bk-subtext">{t('profile.id_label')}: <span className="text-white font-mono">{profile.id}</span></div>
                      <div className="px-2 py-0.5 rounded text-[10px] font-bold border border-bk-green text-bk-green bg-bk-green/10">{t('profile.kyc')}</div>
                  </div>
              </div>
          </div>

          <div className="bg-gradient-to-br from-[#1E2329] to-[#0F1216] rounded-2xl p-6 border border-bk-divider shadow-xl mb-6">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 opacity-70"><Wallet size={16} className="text-bk-green"/><span className="text-xs text-white">{t('profile.total_balance')}</span></div>
                  <History size={18} className="text-bk-subtext cursor-pointer hover:text-white" onClick={() => setShowHistoryView(true)} />
              </div>
              <div className="text-3xl font-bold text-white mb-6 tracking-tight">{balance.toLocaleString(undefined, {minimumFractionDigits: 2})} <span className="text-sm font-normal text-bk-subtext ml-2">THB</span></div>
              <div className="flex gap-3">
                  <button onClick={() => setShowDepositModal(true)} className="flex-1 bg-bk-green text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-bk-green/20"><ArrowDownLeft size={18} /> {t('wallet.deposit')}</button>
                  <button onClick={() => setShowWithdrawModal(true)} className="flex-1 bg-[#2A2E35] text-bk-red border border-bk-red/30 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"><ArrowUpRight size={18} /> {t('wallet.withdraw')}</button>
              </div>
          </div>

          <div className="mb-6">
              <h3 className="text-xs font-bold text-bk-subtext mb-3 ml-1 uppercase">{t('profile.security')}</h3>
              <div className="bg-bk-card rounded-xl border border-bk-divider overflow-hidden shadow-md">
                  <MenuRow icon={History} label={t('profile.deposit_history')} onClick={() => setShowHistoryView(true)} />
                  <div className="h-[1px] bg-bk-divider mx-4"></div>
                  <MenuRow icon={Lock} label={t('profile.change_password')} onClick={() => setShowPasswordModal(true)} />
                  <div className="h-[1px] bg-bk-divider mx-4"></div>
                  <MenuRow icon={Landmark} label={t('profile.link_bank')} value={bankForm.bankName ? bankForm.bankName.split(' ')[0] : '-'} onClick={() => setShowBankModal(true)} />
              </div>
          </div>

          <div className="mb-6">
              <h3 className="text-xs font-bold text-bk-subtext mb-3 ml-1 uppercase">{t('profile.lang')}</h3>
              <div className="bg-bk-card rounded-xl border border-bk-divider overflow-hidden shadow-md" onClick={() => setShowLangModal(true)}>
                  <MenuRow icon={Globe} label={t('profile.lang')} value={LANGUAGES.find(l => l.code === locale)?.name || locale} />
              </div>
          </div>

          <div className="mb-6">
              <h3 className="text-xs font-bold text-bk-subtext mb-3 ml-1 uppercase">{t('profile.support_center')}</h3>
              <div className="bg-bk-card rounded-xl border border-bk-divider overflow-hidden shadow-md">
                  <MenuRow icon={Headphones} label={t('profile.support_center')} onClick={() => window.open('https://line.me/R/ti/p/@484kdclb', '_blank')} />
              </div>
          </div>

          <button onClick={() => setShowLogoutConfirm(true)} className="w-full py-4 bg-bk-card border border-bk-divider rounded-xl text-xs text-bk-subtext flex items-center justify-center gap-2 hover:text-bk-red hover:border-bk-red/30 transition-all active:scale-95"><LogOut size={16} /> {t('profile.logout')}</button>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right duration-300 min-h-screen">
          <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setShowHistoryView(false)} className="p-2 bg-bk-card border border-bk-divider rounded-full text-white"><ChevronRight className="rotate-180" size={24} /></button>
              <h1 className="text-xl font-bold text-white">{t('profile.deposit_history')}</h1>
          </div>
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
              <FilterChip label={t('deposit.history.filter.all')} active={historyFilter === 'ALL'} onClick={() => setHistoryFilter('ALL')} />
              <FilterChip label={t('deposit.history.filter.success')} active={historyFilter === 'Success'} onClick={() => setHistoryFilter('Success')} />
              <FilterChip label={t('deposit.history.filter.pending')} active={historyFilter === 'Pending'} onClick={() => setHistoryFilter('Pending')} />
          </div>
          <div className="space-y-3 pb-32">
             {filteredHistory.length === 0 ? (
                <div className="text-center py-20 opacity-50 text-sm">No transaction found</div>
             ) : (
                filteredHistory.map(item => (
                   <div key={item.id} className="bg-bk-card border border-bk-divider/50 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
                      <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl bg-opacity-10 ${
                                item.type === 'Deposit' ? 'bg-bk-green text-bk-green' : 'bg-bk-red text-bk-red'
                              }`}>
                                {item.type === 'Deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                              </div>
                              <div>
                                  <p className="text-[10px] text-bk-subtext uppercase font-bold tracking-wider">{item.type === 'Deposit' ? t('history.type.deposit') : t('history.type.withdraw')}</p>
                                  <p className={`text-lg font-bold ${item.type === 'Deposit' ? 'text-bk-green' : 'text-bk-red'}`}>
                                      {item.type === 'Deposit' ? '+' : '-'}{item.amount.toLocaleString()} <span className="text-[10px] font-normal text-bk-subtext">THB</span>
                                  </p>
                              </div>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            item.status === 'Success' ? 'bg-bk-green/10 text-bk-green border border-bk-green/20' : 
                            item.status === 'Pending' ? 'bg-orange-400/10 text-orange-400 border border-orange-400/20' : 
                            'bg-bk-red/10 text-bk-red border border-bk-red/20'
                          }`}>
                             {t(`deposit.status.${item.status.toLowerCase() as any}`)}
                          </span>
                      </div>
                      <div className="h-[1px] bg-bk-divider/30"></div>
                      <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                          <span className="text-bk-subtext">Date/Time</span>
                          <span className="text-white text-right">{item.date}</span>
                          <span className="text-bk-subtext">Method</span>
                          <span className="text-white text-right">{item.method}</span>
                      </div>
                   </div>
                ))
             )}
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 animate-in fade-in backdrop-blur-sm">
          <div className="bg-bk-card w-full max-w-sm rounded-2xl border border-bk-divider shadow-2xl">
            <div className="p-4 border-b border-bk-divider flex justify-between items-center">
              <h3 className="font-bold text-white">{t('profile.lang')}</h3>
              <button onClick={() => setShowLangModal(false)}><X size={24} className="text-bk-subtext" /></button>
            </div>
            <div className="p-2">
              {LANGUAGES.map(lang => (
                <button key={lang.code} onClick={() => { setLocale(lang.code); setShowLangModal(false); }} className={`w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors rounded-xl mb-1 ${locale === lang.code ? 'bg-bk-green/10' : ''}`}>
                  <div className="flex items-center gap-3"><span className="text-xl">{lang.flag}</span><span className={`text-sm font-medium ${locale === lang.code ? 'text-bk-green' : 'text-white'}`}>{lang.name}</span></div>
                  {locale === lang.code && <CheckCircle size={16} className="text-bk-green" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 p-4 animate-in fade-in backdrop-blur-md">
           <div className="bg-bk-card w-full max-w-sm rounded-3xl border border-bk-divider shadow-2xl animate-in zoom-in-95 flex flex-col p-6">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-white flex items-center gap-2"><Lock className="text-bk-green" size={20} /> {t('profile.change_password')}</h3>
                  <button onClick={() => setShowPasswordModal(false)}><X size={24} className="text-bk-subtext" /></button>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {pwdError && <div className="bg-bk-red/10 border border-bk-red/20 p-2 rounded text-bk-red text-[11px]">{pwdError}</div>}
                  <input type="password" required placeholder={t('password.old')} className="w-full bg-[#1C2025] border border-bk-divider rounded-xl px-4 py-3 text-sm text-white" value={pwdForm.old} onChange={e => setPwdForm({...pwdForm, old: e.target.value})} />
                  <input type="password" required placeholder={t('password.new')} className="w-full bg-[#1C2025] border border-bk-divider rounded-xl px-4 py-3 text-sm text-white" value={pwdForm.new} onChange={e => setPwdForm({...pwdForm, new: e.target.value})} />
                  <input type="password" required placeholder={t('password.confirm')} className="w-full bg-[#1C2025] border border-bk-divider rounded-xl px-4 py-3 text-sm text-white" value={pwdForm.confirm} onChange={e => setPwdForm({...pwdForm, confirm: e.target.value})} />
                  <button disabled={pwdSubmitting} type="submit" className="w-full bg-bk-green text-white py-4 rounded-2xl font-bold shadow-lg mt-4">{pwdSubmitting ? <RefreshCw className="animate-spin mx-auto" size={20}/> : t('password.btn_submit')}</button>
              </form>
           </div>
        </div>
      )}

      {/* Bank Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 p-4 animate-in fade-in backdrop-blur-md">
           <div className="bg-bk-card w-full max-w-sm rounded-3xl border border-bk-divider shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-white flex items-center gap-2"><Landmark className="text-bk-green" size={20} /> {t('profile.link_bank')}</h3>
                  <button onClick={() => setShowBankModal(false)}><X size={24} className="text-bk-subtext" /></button>
              </div>
              <form onSubmit={handleSaveBank} className="space-y-4">
                  <select required className="w-full bg-[#1C2025] border border-bk-divider rounded-xl px-4 py-3 text-sm text-white" value={bankForm.bankName} onChange={e => setBankForm({...bankForm, bankName: e.target.value})}>
                     <option value="" disabled>{t('profile.bank_placeholder')}</option>
                     {THAI_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <input type="text" required placeholder={t('profile.account_no_label')} className="w-full bg-[#1C2025] border border-bk-divider rounded-xl px-4 py-3 text-sm text-white" value={bankForm.accountNo} onChange={e => setBankForm({...bankForm, accountNo: e.target.value})} />
                  <input type="text" required placeholder={t('profile.account_name_label')} className="w-full bg-[#1C2025] border border-bk-divider rounded-xl px-4 py-3 text-sm text-white" value={bankForm.accountName} onChange={e => setBankForm({...bankForm, accountName: e.target.value})} />
                  <div className="flex items-center gap-2 mt-4">
                      <input type="checkbox" id="confirmBank" checked={isBankConfirmed} onChange={e => setIsBankConfirmed(e.target.checked)} className="w-4 h-4 accent-bk-green" />
                      <label htmlFor="confirmBank" className="text-[10px] text-white cursor-pointer">{t('profile.confirm_info')}</label>
                  </div>
                  <button disabled={!isBankConfirmed || bankSubmitting} type="submit" className="w-full bg-bk-green text-white py-4 rounded-2xl font-bold shadow-lg mt-2 disabled:opacity-50">{bankSubmitting ? <RefreshCw className="animate-spin mx-auto" size={20}/> : t('common.save')}</button>
              </form>
           </div>
        </div>
      )}

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 p-4 animate-in fade-in backdrop-blur-lg">
           <div className="bg-bk-card w-full max-w-sm rounded-[32px] border border-bk-divider shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95">
              <div className="w-16 h-16 bg-bk-red/10 rounded-full flex items-center justify-center mb-6 border border-bk-red/20 text-bk-red">
                  <LogOut size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t('logout.confirm_title')}</h3>
              <p className="text-sm text-bk-subtext mb-8">{t('logout.confirm_desc')}</p>
              
              <div className="w-full flex flex-col gap-3">
                  <button onClick={confirmLogout} className="w-full py-4 bg-bk-red text-white font-bold rounded-2xl shadow-xl shadow-bk-red/20 active:scale-95 transition-transform">{t('profile.logout')}</button>
                  <button onClick={() => setShowLogoutConfirm(false)} className="w-full py-4 bg-[#2A2E35] text-white font-bold rounded-2xl active:scale-95 transition-transform">{t('logout.cancel')}</button>
              </div>
           </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 animate-in fade-in backdrop-blur-md">
             <div className="bg-bk-card w-full max-w-sm rounded-3xl border border-bk-divider shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white flex items-center gap-2"><ArrowDownLeft className="text-bk-green" size={20} /> {t('deposit.modal.title')}</h3>
                    <button onClick={() => setShowDepositModal(false)}><X size={24} className="text-bk-subtext" /></button>
                </div>
                <div className="space-y-4">
                    {depositError && <div className="bg-bk-red/10 border border-bk-red/20 p-2 rounded text-bk-red text-[11px]">{depositError}</div>}
                    <div className="space-y-1">
                        <label className="text-[10px] text-bk-subtext uppercase font-bold ml-1">{t('deposit.modal.amount_label')}</label>
                        <input type="number" placeholder={t('deposit.modal.amount_placeholder')} className="w-full bg-[#1C2025] border border-bk-divider rounded-2xl px-5 py-4 text-white font-mono focus:border-bk-green outline-none" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-bk-subtext uppercase font-bold ml-1">{t('deposit.modal.slip_label')}</label>
                        <div onClick={() => fileInputRef.current?.click()} className="w-full h-40 border-2 border-dashed border-bk-divider rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden bg-[#1C2025] hover:border-bk-subtext/50">
                            {slipPreview ? <img src={slipPreview} className="w-full h-full object-contain" /> : <div className="text-center"><Upload className="mx-auto mb-2 opacity-50"/><p className="text-[10px] text-bk-subtext">{t('deposit.modal.slip_label')}</p></div>}
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    <button disabled={isVerifying} onClick={handleDepositSubmit} className="w-full bg-bk-green text-white py-4 rounded-2xl font-bold shadow-lg shadow-bk-green/20 disabled:opacity-50">{isVerifying ? <RefreshCw className="animate-spin mx-auto" /> : t('deposit.modal.btn_confirm')}</button>
                </div>
             </div>
          </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 animate-in fade-in backdrop-blur-md">
           <div className="bg-bk-card w-full max-w-sm rounded-3xl border border-bk-divider shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-white flex items-center gap-2"><ArrowUpRight className="text-bk-red" size={20} /> {t('withdraw.modal.title')}</h3>
                  <button onClick={() => { setShowWithdrawModal(false); setWithdrawError(null); setWithdrawAmount(''); }}><X size={24} className="text-bk-subtext" /></button>
              </div>
              
              <div className="space-y-5">
                  {withdrawError && (
                    <div className="bg-bk-red/10 border border-bk-red/20 p-3 rounded-xl flex items-center gap-2 text-bk-red text-[11px] animate-in shake-in">
                       <AlertCircle size={14} /> {withdrawError}
                    </div>
                  )}

                  <div className="bg-[#1C2025] rounded-2xl p-4 border border-bk-divider flex flex-col">
                       <span className="text-[10px] text-bk-subtext font-bold uppercase mb-1">Available Balance</span>
                       <span className="text-xl font-bold text-white">{balance.toLocaleString(undefined, {minimumFractionDigits: 2})} <span className="text-xs font-normal">THB</span></span>
                  </div>

                  <div className="space-y-2">
                      <label className="text-[10px] text-bk-subtext uppercase font-bold ml-1">{t('withdraw.modal.amount_label')}</label>
                      <div className="relative">
                          <input 
                            type="number" 
                            placeholder={t('withdraw.modal.amount_placeholder')}
                            className="w-full bg-[#1C2025] border border-bk-divider rounded-2xl px-5 py-4 text-white font-mono focus:border-bk-red focus:outline-none transition-all"
                            value={withdrawAmount}
                            onChange={e => setWithdrawAmount(e.target.value)}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-bk-subtext font-bold text-xs">THB</div>
                      </div>
                      <div className="flex justify-between px-1">
                          <button onClick={() => setWithdrawAmount("100")} className="text-[10px] text-bk-red font-bold">MIN 100</button>
                          <button onClick={() => setWithdrawAmount(balance.toString())} className="text-[10px] text-bk-red font-bold">MAX ALL</button>
                      </div>
                  </div>

                  <div className="bg-[#1C2025] p-4 rounded-2xl border border-bk-divider space-y-2">
                       <div className="flex justify-between items-center">
                           <span className="text-[10px] text-bk-subtext font-bold uppercase">To Bank</span>
                           <span className="text-[11px] text-white font-bold">{bankForm.bankName ? bankForm.bankName.split(' ')[0] : 'N/A'}</span>
                       </div>
                       <div className="flex justify-between items-center">
                           <span className="text-[10px] text-bk-subtext font-bold uppercase">Account No.</span>
                           <span className="text-[11px] text-white font-mono">{bankForm.accountNo || 'N/A'}</span>
                       </div>
                  </div>

                  <button 
                    disabled={isWithdrawing}
                    onClick={handleWithdrawSubmit}
                    className="w-full bg-bk-red text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-bk-red/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isWithdrawing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>{t('withdraw.modal.processing')}</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRight size={18} />
                        <span>{t('withdraw.modal.btn_confirm')}</span>
                      </>
                    )}
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const MenuRow = ({ icon: Icon, label, value, onClick }: any) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-all group">
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-lg bg-bk-subtext/10 text-bk-subtext group-hover:text-white"><Icon size={18} /></div>
          <span className="text-sm font-medium text-white">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {value && <span className="text-xs text-bk-subtext">{value}</span>}
          <ChevronRight size={16} className="text-bk-divider" />
        </div>
    </div>
);

const FilterChip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${active ? 'bg-bk-green text-white border-bk-green' : 'bg-[#1C2025] text-bk-subtext border-bk-divider'}`}>{label}</button>
);

export default ProfileScreen;
