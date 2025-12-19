
import React from 'react';
import { Home, BarChart2, Repeat, Wallet, User, Zap } from 'lucide-react';
import { Tab } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  
  const navItems = [
    { id: Tab.HOME, label: t('nav.home'), icon: Home },
    { id: Tab.MARKET, label: t('nav.market'), icon: BarChart2 },
    { id: Tab.INVEST, label: t('nav.invest'), icon: Zap }, 
    { id: Tab.PROFILE, label: t('nav.profile'), icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bk-card border-t border-bk-divider pb-safe pt-1.5 px-1 z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] py-1.5 transition-colors ${
                isActive ? 'text-bk-green' : 'text-bk-subtext'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[9px] mt-1 font-medium whitespace-nowrap`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
