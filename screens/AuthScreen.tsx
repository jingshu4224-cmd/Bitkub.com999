
import React, { useState, useMemo } from 'react';
import { Mail, Phone, Lock, ChevronRight, ArrowLeft, ShieldCheck, Smartphone, CheckCircle2, AlertCircle, Loader2, Search, X, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { COUNTRY_CODES } from '../constants';

interface Props {
  onAuthSuccess: (userData: { identifier: string; method: 'email' | 'phone' }) => void;
}

const AuthScreen: React.FC<Props> = ({ onAuthSuccess }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('REGISTER');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Country Selector
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const filteredCountries = useMemo(() => {
    return COUNTRY_CODES.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
      c.code.includes(countrySearch)
    );
  }, [countrySearch]);

  // Secure Hashing using SHA-256
  const hashPassword = async (pwd: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const formatToE164 = (phone: string, countryCode: string) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    return `${countryCode}${cleaned}`;
  };

  const validateInput = () => {
    if (method === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        setError(t('auth.err_invalid_email'));
        return false;
      }
    } else {
      const phoneRegex = /^\d{8,15}$/;
      if (!phoneRegex.test(identifier)) {
        setError(t('auth.err_invalid_phone'));
        return false;
      }
    }
    return true;
  };

  const getFullId = () => {
    return method === 'phone' ? formatToE164(identifier, selectedCountry.code) : identifier.toLowerCase();
  };

  const handleNext = async () => {
    setError(null);
    if (step === 1) {
      if (!identifier) return;
      if (!validateInput()) return;
      
      const fullId = getFullId();
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const userExists = users.some((u: any) => u.identifier === fullId);

      if (mode === 'REGISTER' && userExists) {
        setError(t('auth.err_duplicate'));
        return;
      }
      
      if (mode === 'LOGIN' && !userExists) {
        setError(t('history.not_found'));
        return;
      }

      setStep(2);
    } else if (step === 2) {
      if (password.length < 6) {
        setError(t('auth.err_short_password'));
        return;
      }
      if (mode === 'REGISTER' && password !== confirmPassword) {
        setError(t('auth.err_password_mismatch'));
        return;
      }
      
      await finalizeAuth();
    }
  };

  const finalizeAuth = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate Network Delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const fullId = getFullId();
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const hashedPassword = await hashPassword(password);

      if (mode === 'REGISTER') {
        // Double check duplicate before saving
        if (users.some((u: any) => u.identifier === fullId)) {
          setError(t('auth.err_duplicate'));
          setIsSubmitting(false);
          return;
        }

        // Create User with Hashed Password
        users.push({ 
          identifier: fullId, 
          passwordHash: hashedPassword, 
          method,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('mock_users', JSON.stringify(users));
      } else {
        // Login Verification
        const user = users.find((u: any) => u.identifier === fullId && u.passwordHash === hashedPassword);
        if (!user) {
          setError(t('auth.password_err') || 'รหัสผ่านไม่ถูกต้อง');
          setIsSubmitting(false);
          return;
        }
      }

      // Success
      setIsSubmitting(false);
      onAuthSuccess({ identifier: fullId, method });
    } catch (e) {
      setError(t('common.error'));
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-bk-bg flex flex-col p-6 animate-in fade-in duration-500 relative overflow-hidden">
      {/* Header */}
      <div className="mb-10 pt-8">
        {step > 1 && (
          <button onClick={handlePrev} className="mb-6 p-2 bg-bk-card rounded-full border border-bk-divider text-white transition-transform active:scale-90">
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="flex items-center gap-3 mb-2">
           <div className="w-12 h-12 bg-bk-green rounded-2xl flex items-center justify-center shadow-lg shadow-bk-green/20">
              <ShieldCheck className="text-white" size={28} />
           </div>
           <div>
             <h1 className="text-2xl font-black text-white leading-none mb-1">{mode === 'REGISTER' ? t('auth.register') : t('auth.login')}</h1>
             <p className="text-bk-subtext text-[10px] uppercase font-bold tracking-widest">{t('auth.subtitle')}</p>
           </div>
        </div>
      </div>

      {/* Progress Line */}
      {mode === 'REGISTER' && (
        <div className="flex gap-2 mb-8 px-1">
          {[1, 2].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-bk-green' : 'bg-bk-divider'}`} />
          ))}
        </div>
      )}

      {error && (
        <div className="mb-6 animate-in shake-in">
           <div className="bg-bk-red/10 border border-bk-red/20 p-4 rounded-2xl flex items-center gap-3 text-bk-red text-xs">
              <AlertCircle size={18} />
              <span className="font-medium">{error}</span>
           </div>
        </div>
      )}

      <div className="flex-1">
        {step === 1 && (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="flex bg-bk-card p-1 rounded-2xl border border-bk-divider mb-6 shadow-inner">
              <button 
                onClick={() => { setMethod('email'); setError(null); }} 
                className={`flex-1 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${method === 'email' ? 'bg-[#2A2E35] text-white shadow-lg' : 'text-bk-subtext'}`}
              >
                <Mail size={16} /> {t('auth.email_tab')}
              </button>
              <button 
                onClick={() => { setMethod('phone'); setError(null); }} 
                className={`flex-1 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${method === 'phone' ? 'bg-[#2A2E35] text-white shadow-lg' : 'text-bk-subtext'}`}
              >
                <Smartphone size={16} /> {t('auth.phone_tab')}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                {method === 'phone' && (
                  <button 
                    onClick={() => setShowCountryModal(true)}
                    className="flex items-center gap-2 bg-[#1C2025] border border-bk-divider rounded-2xl py-4.5 px-4 text-white text-sm font-bold min-w-[100px] justify-between"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                  </button>
                )}
                <div className="relative group flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-bk-subtext group-focus-within:text-bk-green transition-colors">
                    {method === 'email' ? <Mail size={18} /> : null}
                  </div>
                  <input 
                    type={method === 'email' ? 'email' : 'tel'} 
                    placeholder={method === 'email' ? t('auth.email_placeholder') : t('auth.phone_placeholder')}
                    className={`w-full bg-[#1C2025] border border-bk-divider rounded-2xl py-4.5 ${method === 'email' ? 'pl-12' : 'px-4'} pr-4 text-white focus:border-bk-green focus:bg-bk-bg outline-none transition-all shadow-sm font-medium`}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value.replace(/\s+/g, ''))}
                  />
                </div>
              </div>
              
              <button 
                disabled={!identifier}
                onClick={handleNext}
                className="w-full bg-bk-green text-white py-4.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-bk-green/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {t('auth.btn_next')} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right duration-300 space-y-4">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-bk-subtext group-focus-within:text-bk-green transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder={t('auth.password_placeholder')}
                className="w-full bg-[#1C2025] border border-bk-divider rounded-2xl py-4.5 pl-12 pr-12 text-white focus:border-bk-green focus:bg-bk-bg outline-none transition-all font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-bk-subtext hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {mode === 'REGISTER' && (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-bk-subtext group-focus-within:text-bk-green transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder={t('auth.password_confirm')}
                  className="w-full bg-[#1C2025] border border-bk-divider rounded-2xl py-4.5 pl-12 pr-4 text-white focus:border-bk-green focus:bg-bk-bg outline-none transition-all font-mono"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <button 
              disabled={isSubmitting || !password || (mode === 'REGISTER' && !confirmPassword)}
              onClick={handleNext}
              className="w-full bg-bk-green text-white py-4.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-bk-green/20 active:scale-95 transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {mode === 'REGISTER' ? (
                    <>
                      <UserPlus size={18} />
                      <span>{t('auth.register')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('auth.login')}</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="mt-auto pt-10 text-center relative z-10">
        <button 
          onClick={() => { setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN'); setStep(1); setError(null); setPassword(''); setConfirmPassword(''); }}
          className="text-xs font-bold text-bk-subtext uppercase tracking-widest hover:text-white transition-colors"
        >
          {mode === 'REGISTER' ? t('auth.switch_to_login') : t('auth.switch_to_register')}
        </button>
      </div>

      {/* Country Selection Modal */}
      {showCountryModal && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200">
           <div className="flex items-center justify-between p-6 border-b border-bk-divider">
              <h2 className="text-xl font-bold text-white">{t('auth.select_country')}</h2>
              <button onClick={() => setShowCountryModal(false)} className="p-2"><X size={24} className="text-bk-subtext"/></button>
           </div>
           
           <div className="p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bk-subtext" size={18} />
                <input 
                  type="text" 
                  placeholder={t('auth.search_country')}
                  className="w-full bg-[#1C2025] border border-bk-divider rounded-2xl py-4 pl-12 pr-4 text-white focus:border-bk-green outline-none"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto no-scrollbar pb-10 px-4">
              {filteredCountries.map((c) => (
                <button 
                  key={c.code + c.name}
                  onClick={() => { setSelectedCountry(c); setShowCountryModal(false); setCountrySearch(''); }}
                  className="w-full flex items-center justify-between py-5 border-b border-bk-divider/30 hover:bg-white/5 px-4 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4">
                     <span className="text-2xl">{c.flag}</span>
                     <span className="text-white font-medium">{c.name}</span>
                  </div>
                  <span className="text-bk-green font-bold">{c.code}</span>
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Security Info Footer */}
      <div className="mt-4 flex items-center justify-center gap-2 opacity-50 grayscale">
          <ShieldCheck size={14} className="text-bk-green" />
          <span className="text-[10px] text-white font-medium">Secured with SHA-256 Encryption</span>
      </div>

      {/* Decorative Circles */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-bk-green/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-bk-green/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default AuthScreen;
