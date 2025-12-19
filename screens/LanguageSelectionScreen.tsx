
import React from 'react';
import { Globe, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onLanguageSelected: () => void;
}

const LANGUAGES = [
  { code: 'th', name: 'ภาษาไทย', sub: 'Thai', flag: '🇹🇭' },
  { code: 'en', name: 'English', sub: 'อังกฤษ', flag: '🇺🇸' },
];

const LanguageSelectionScreen: React.FC<Props> = ({ onLanguageSelected }) => {
  const { locale, setLocale } = useLanguage();

  const handleSelect = (code: string) => {
    setLocale(code);
    localStorage.setItem('has_chosen_language', 'true');
    onLanguageSelected();
  };

  return (
    <div className="min-h-screen bg-bk-bg flex flex-col p-6 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="w-20 h-20 bg-bk-green/10 rounded-3xl flex items-center justify-center mb-8 border border-bk-green/20 shadow-2xl shadow-bk-green/10">
          <Globe className="text-bk-green animate-pulse" size={40} />
        </div>
        
        <h1 className="text-2xl font-black text-white mb-2">ยินดีต้อนรับสู่ Bitkub</h1>
        <p className="text-bk-subtext text-sm mb-12">กรุณาเลือกภาษาเพื่อเริ่มต้นใช้งาน<br/>Please select your language to continue</p>

        <div className="w-full space-y-4 max-w-xs">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full group relative overflow-hidden bg-bk-card border ${
                locale === lang.code ? 'border-bk-green' : 'border-bk-divider'
              } p-5 rounded-2xl flex items-center justify-between transition-all active:scale-95 hover:border-bk-green/50 shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{lang.flag}</span>
                <div className="text-left">
                  <div className={`font-bold text-lg ${locale === lang.code ? 'text-bk-green' : 'text-white'}`}>
                    {lang.name}
                  </div>
                  <div className="text-[10px] text-bk-subtext uppercase font-bold tracking-widest">{lang.sub}</div>
                </div>
              </div>
              <ChevronRight 
                size={20} 
                className={`${locale === lang.code ? 'text-bk-green' : 'text-bk-divider'} group-hover:translate-x-1 transition-transform`} 
              />
              {locale === lang.code && (
                <div className="absolute top-0 right-0 w-2 h-full bg-bk-green"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="py-8 text-center">
        <p className="text-[10px] text-bk-subtext font-medium opacity-50 uppercase tracking-widest">
          Bitkub Digital Asset Exchange
        </p>
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;
