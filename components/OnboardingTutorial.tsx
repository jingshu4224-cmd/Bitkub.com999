import React, { useState, useEffect } from 'react';
import { X, ChevronRight, BarChart2, Repeat, History, User, Home, Check } from 'lucide-react';
import { Tab } from '../types';

interface Props {
  onComplete: () => void;
  onRequestTabChange: (tab: Tab) => void;
}

const STEPS = [
  {
    title: 'ยินดีต้อนรับสู่ Bitkub Clone',
    description: 'แพลตฟอร์มเทรดสินทรัพย์ดิจิทัลรูปแบบใหม่ พร้อมฟีเจอร์ AI อัจฉริยะ',
    targetTab: Tab.HOME,
    icon: Home,
  },
  {
    title: 'ตลาดซื้อขาย',
    description: 'ติดตามราคาเหรียญแบบเรียลไทม์ ค้นหาเหรียญที่น่าสนใจ และดูรายการเหรียญใหม่ๆ ได้ที่นี่',
    targetTab: Tab.MARKET,
    icon: BarChart2,
  },
  {
    title: 'หน้าจอเทรด',
    description: 'ดูกราฟราคาย้อนหลัง ดู Order Book และส่งคำสั่งซื้อขาย (Buy/Sell) ได้ทันที',
    targetTab: Tab.TRADE,
    icon: Repeat,
  },
  {
    title: 'ประวัติการสั่งซื้อ',
    description: 'ตรวจสอบประวัติการทำรายการย้อนหลัง รายละเอียดราคา และสถานะคำสั่งซื้อขายทั้งหมด',
    targetTab: Tab.WALLET,
    icon: History,
  },
  {
    title: 'จัดการบัญชี',
    description: 'ยืนยันตัวตน เพิ่มบัญชีธนาคาร และตั้งค่าความปลอดภัยได้ที่หน้าโปรไฟล์',
    targetTab: Tab.PROFILE,
    icon: User,
  }
];

const OnboardingTutorial: React.FC<Props> = ({ onComplete, onRequestTabChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay for animation on mount
    setTimeout(() => setIsVisible(true), 500);
    
    // Check local storage to see if tutorial was already completed
    const hasCompleted = localStorage.getItem('hasCompletedTutorial');
    if (hasCompleted) {
        onComplete();
    }
  }, []);

  useEffect(() => {
    if (STEPS[currentStep]) {
        onRequestTabChange(STEPS[currentStep].targetTab);
    }
  }, [currentStep, onRequestTabChange]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
      setIsVisible(false);
      localStorage.setItem('hasCompletedTutorial', 'true');
      setTimeout(onComplete, 300); // Wait for animation
  };

  const stepData = STEPS[currentStep];
  const Icon = stepData.icon;

  if (!stepData) return null;

  return (
    <div 
        className={`fixed inset-0 z-[100] flex items-end justify-center pb-24 px-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="bg-bk-card border border-bk-green/50 rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-bk-green/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-bk-green/20 flex items-center justify-center text-bk-green">
                 <Icon size={20} />
             </div>
             <div>
                 <h3 className="text-white font-bold text-lg leading-tight">{stepData.title}</h3>
                 <span className="text-[10px] text-bk-subtext font-medium">ขั้นตอนที่ {currentStep + 1}/{STEPS.length}</span>
             </div>
          </div>
          <button onClick={handleComplete} className="text-bk-subtext hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-300 mb-6 leading-relaxed min-h-[48px] relative z-10">
            {stepData.description}
        </p>

        {/* Progress Bar */}
        <div className="flex gap-1 mb-6">
            {STEPS.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`h-1 rounded-full flex-1 transition-all duration-300 ${idx <= currentStep ? 'bg-bk-green' : 'bg-bk-input'}`}
                />
            ))}
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between relative z-10">
            <button 
                onClick={handleComplete}
                className="text-xs text-bk-subtext hover:text-white px-2 py-1"
            >
                ข้ามการแนะนำ
            </button>
            <button 
                onClick={handleNext}
                className="bg-bk-green hover:bg-bk-greenHover text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-bk-green/20"
            >
                {currentStep === STEPS.length - 1 ? 'เริ่มต้นใช้งาน' : 'ถัดไป'}
                {currentStep === STEPS.length - 1 ? <Check size={16} /> : <ChevronRight size={16} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;