
import React, { useState, useEffect, useRef } from 'react';
import { Droplets, Gem, Sparkles } from 'lucide-react';

const BannerCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const BANNERS = [
    // Banner 1: SUI Campaign
    <div className="w-full h-full relative bg-gradient-to-r from-[#002b24] to-[#005a4e] overflow-hidden rounded-xl flex items-center justify-between px-5 py-3 border border-[#27C052]/20">
       <div className="absolute top-0 right-0 w-40 h-40 bg-[#27C052]/10 blur-[50px] rounded-full pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#3898EC]/10 blur-[40px] rounded-full pointer-events-none"></div>
       
       <div className="z-10 flex-1 flex flex-col justify-center h-full">
           <div className="flex items-center gap-1.5 mb-1.5">
               <span className="text-[9px] font-bold text-white tracking-wider opacity-90">LEARN TRADE & EARN</span>
               <div className="w-1 h-1 rounded-full bg-[#3898EC]"></div>
           </div>
           
           <div className="mb-0.5">
               <span className="text-white text-lg font-bold mr-1.5">รับเหรียญ</span>
               <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#3898EC] drop-shadow-sm">SUI</span>
           </div>
           
           <div className="text-white text-xl font-bold mb-2 tracking-tight">
               มูลค่า 2,000 บาท*
           </div>
           
           <div className="mt-auto">
               <p className="text-[8px] text-gray-300 font-medium">วันที่ 1 ธ.ค. 68 - 31 ธ.ค. 68</p>
               <p className="text-[8px] text-[#3898EC] font-medium">Powered by Sui</p>
           </div>
       </div>
       
       <div className="z-10 relative">
           <div className="w-20 h-20 bg-gradient-to-br from-[#3898EC] to-[#2B7FCA] rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(56,152,236,0.4)] border border-white/20 relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                <Droplets className="text-white fill-white relative z-10" size={36} strokeWidth={1.5} />
           </div>
           <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0B0E11] rounded-full flex items-center justify-center border border-[#2A2E35]">
                <div className="text-[#27C052] font-bold text-[8px]">Bitkub</div>
           </div>
       </div>
    </div>,

    // Banner 2: Bitkub Privilege
    <div className="w-full h-full relative bg-[#0a0a0a] overflow-hidden rounded-xl flex items-center px-6 border border-[#D4AF37]/20">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.15),transparent_60%)]"></div>
       <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent opacity-50"></div>
       
       <div className="z-10 w-2/3">
           <div className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black text-[9px] font-bold px-2 py-0.5 rounded-sm mb-2 shadow-[0_0_10px_rgba(212,175,55,0.3)]">
               ใหม่!
           </div>
           <h2 className="text-white text-xl font-serif tracking-widest leading-none mb-1">
               BITKUB
           </h2>
           <h2 className="text-[#e5e5e5] text-lg font-serif tracking-[0.2em] font-light mb-3">
               PRIVILEGE
           </h2>
           <div className="text-[9px] text-[#D4AF37] font-medium tracking-wide border-b border-[#D4AF37]/30 inline-block pb-0.5">
               www.bitkub.com/privilege
           </div>
       </div>
       
       <div className="z-10 flex-1 flex justify-center items-center relative">
           <div className="relative">
               <Gem className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] relative z-10" size={56} strokeWidth={1} />
               <Sparkles className="absolute -top-2 -right-2 text-[#D4AF37] animate-pulse" size={16} />
               <div className="absolute inset-0 bg-white/10 blur-xl rounded-full"></div>
           </div>
       </div>
    </div>,

    // Banner 3: Meme Coin
    <div className="w-full h-full relative bg-black overflow-hidden rounded-xl flex items-center justify-between px-5 border border-[#FACC15]/20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]"></div>
        <div className="absolute -right-6 top-0 h-full w-24 bg-gradient-to-l from-[#FACC15]/20 to-transparent skew-x-12 blur-md"></div>

        <div className="z-10 flex-1">
            <div className="text-white/80 text-[9px] font-bold italic mb-1 tracking-wider">
                NEW COIN ADDITION
            </div>
            <div className="text-white text-xl font-bold mb-1 leading-tight drop-shadow-md">
                Memecoin
            </div>
            <div className="text-[#FACC15] text-2xl font-black mb-2 tracking-tight drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
                (MEME)
            </div>
            <div className="text-[#27C052] text-[9px] font-bold bg-[#27C052]/10 px-2 py-1 rounded-md inline-block border border-[#27C052]/20">
                เทรดได้เลยวันนี้ <span className="text-white font-normal ml-1">ที่ Bitkub Exchange</span>
            </div>
        </div>

        <div className="z-10 relative">
             <div className="w-16 h-16 bg-[#FACC15] rounded-full border-[3px] border-black shadow-[0_0_20px_rgba(250,204,21,0.6)] flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
                  <div className="w-12 h-12 border-2 border-black/20 rounded-full flex items-center justify-center">
                     <span className="text-black font-black text-2xl drop-shadow-sm">M</span>
                  </div>
             </div>
             {/* Pixel art effects simulated with small blocks */}
             <div className="absolute -top-2 left-0 w-2 h-2 bg-white/80"></div>
             <div className="absolute bottom-1 -right-1 w-1.5 h-1.5 bg-[#FACC15]"></div>
        </div>
    </div>
  ];

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
        const bannerItemWidth = clientWidth * 0.85; // 85% width
        const gap = 8;
        const step = bannerItemWidth + gap;

        const maxScroll = scrollWidth - clientWidth;
        let nextScrollLeft = scrollLeft + step;
        
        let nextIndex = currentIndex + 1;

        if (scrollLeft >= maxScroll - (step / 2)) {
          nextScrollLeft = 0;
          nextIndex = 0;
        }

        scrollRef.current.scrollTo({
          left: nextScrollLeft,
          behavior: 'smooth'
        });
        
        // Update index calculation loosely based on scroll if needed, 
        // but for auto-scroll loop we can just track it.
        // However, better to rely on scroll listener for the dots.
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = () => {
      if (scrollRef.current) {
          const { scrollLeft, clientWidth } = scrollRef.current;
          const bannerItemWidth = clientWidth * 0.85;
          const index = Math.round(scrollLeft / bannerItemWidth);
          if (index >= 0 && index < BANNERS.length) {
             setCurrentIndex(index);
          }
      }
  };

  return (
    <div className="relative mb-6">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar gap-2 px-4 snap-x snap-mandatory scroll-smooth py-2"
          onScroll={handleScroll}
        >
          {BANNERS.map((banner, i) => (
            <div 
              key={i} 
              className="w-[85%] h-40 flex-shrink-0 snap-center transform transition-transform"
            >
              {banner}
            </div>
          ))}
        </div>
        
        {/* Banner Dots Indicator */}
        <div className="flex justify-center gap-1.5 mt-0">
            {BANNERS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-bk-green' : 'w-1.5 bg-bk-subtext/30'}`}
                />
            ))}
        </div>
    </div>
  );
};

export default BannerCarousel;
