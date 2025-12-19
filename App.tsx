
import React, { useState, useEffect } from 'react';
import { Tab, Coin } from './types';
import { COINS } from './constants';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import MarketScreen from './screens/MarketScreen';
import ProfileScreen from './screens/ProfileScreen';
import InvestScreen from './screens/InvestScreen';
import AuthScreen from './screens/AuthScreen';
import LanguageSelectionScreen from './screens/LanguageSelectionScreen';
import { LanguageProvider } from './i18n/LanguageContext';

const AppContent: React.FC = () => {
  const [hasChosenLanguage, setHasChosenLanguage] = useState<boolean>(() => {
    return localStorage.getItem('has_chosen_language') === 'true';
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('is_logged_in') === 'true';
  });
  
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [selectedCoin, setSelectedCoin] = useState<Coin>(COINS[0]);

  const handleAuthSuccess = (userData: { identifier: string; method: string }) => {
    localStorage.setItem('is_logged_in', 'true');
    localStorage.setItem('user_identifier', userData.identifier);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('user_identifier');
    // Clear other session-specific data but keep generic settings
    setIsLoggedIn(false);
  };

  const handleCoinSelect = (coin: Coin) => {
    setSelectedCoin(coin);
  };

  // Step 1: Choose Language
  if (!hasChosenLanguage) {
    return <LanguageSelectionScreen onLanguageSelected={() => setHasChosenLanguage(true)} />;
  }

  // Step 2: Auth (Login/Register)
  if (!isLoggedIn) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Step 3: Main App
  const renderScreen = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <HomeScreen setTab={setActiveTab} />;
      case Tab.MARKET:
        return <MarketScreen setTab={setActiveTab} onCoinSelect={handleCoinSelect} />; 
      case Tab.INVEST:
        return <InvestScreen />; 
      case Tab.PROFILE:
        return <ProfileScreen onLogout={handleLogout} />;
      default:
        return <HomeScreen setTab={setActiveTab} />;
    }
  };

  return (
    <div className="bg-bk-bg text-white font-sans min-h-screen max-w-lg mx-auto shadow-2xl overflow-hidden relative border-x border-bk-divider">
      <main className="min-h-screen">
        {renderScreen()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
