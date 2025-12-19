
import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Pencil, Trash2, CalendarDays } from 'lucide-react';
import { Coin } from '../types';

interface Props {
  coin: Coin;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Generate data backwards from the current price so the chart ends at the live price
const generateMockData = (endPrice: number, timeframe: string) => {
  const data = [];
  let currentPrice = endPrice;
  const points = 60; // More points for smoother curve
  const now = Date.now();

  // Settings
  let timeStep = 15 * 60 * 1000; // 15m default
  let volatility = 0.005;

  if (timeframe === '7D') {
      // 7 Days
      timeStep = (7 * 24 * 60 * 60 * 1000) / points; 
      volatility = 0.08;
  } else if (timeframe === '1d') {
      timeStep = (24 * 60 * 60 * 1000) / points;
      volatility = 0.02;
  } else if (timeframe === '4h') {
      timeStep = (4 * 60 * 60 * 1000) / points;
      volatility = 0.01;
  }

  for (let i = 0; i < points; i++) {
    const date = new Date(now - (i * timeStep));
    let label = '';
    
    if (timeframe === '7D') {
         label = date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    } else {
         label = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    }

    data.unshift({
      time: label,
      fullDate: date.toLocaleString('th-TH', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      price: currentPrice
    });
    
    // Random walk backwards
    const change = (Math.random() - 0.5) * (endPrice * volatility);
    currentPrice -= change;
  }
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bk-card border border-bk-divider p-2 rounded shadow-lg text-xs z-50">
        <p className="text-bk-subtext mb-1">{data.fullDate}</p>
        <p className="text-white font-bold">{payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} THB</p>
      </div>
    );
  }
  return null;
};

const CryptoChart: React.FC<Props> = ({ coin }) => {
  const [timeframe, setTimeframe] = useState('15m');
  const [chartData, setChartData] = useState<any[]>([]);
  const prevSymbolRef = useRef(coin.symbol);

  // Drawing State
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Data when Symbol or Timeframe changes
  useEffect(() => {
    setChartData(generateMockData(coin.price, timeframe));
    prevSymbolRef.current = coin.symbol;
    // Clear lines when symbol changes
    setLines([]);
  }, [coin.symbol, timeframe]);

  // Handle Real-time Updates: Append new point when coin.price changes
  useEffect(() => {
    if (prevSymbolRef.current !== coin.symbol) return;
    // For 7D view, we might not want to shift the chart drastically every second, 
    // but updating the last point's price is good.
    
    setChartData(prev => {
        if (prev.length === 0) return prev;
        
        // Update the last point with the new price
        const lastPoint = prev[prev.length - 1];
        const newData = [...prev];
        newData[newData.length - 1] = {
            ...lastPoint,
            price: coin.price
        };
        return newData;
    });
  }, [coin.price]);

  // Drawing Handlers
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!chartContainerRef.current) return { x: 0, y: 0 };
    const rect = chartContainerRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingMode) return;
    const { x, y } = getCoordinates(e);
    setCurrentLine({ x1: x, y1: y, x2: x, y2: y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingMode || !currentLine) return;
    const { x, y } = getCoordinates(e);
    setCurrentLine(prev => prev ? { ...prev, x2: x, y2: y } : null);
  };

  const handleMouseUp = () => {
    if (!isDrawingMode || !currentLine) return;
    setLines(prev => [...prev, currentLine]);
    setCurrentLine(null);
  };
  
  const isUp = coin.change24h >= 0;
  const color = isUp ? '#27C052' : '#FF4D4F';

  const timeframes = ['15m', '1h', '4h', '1d', '7D'];

  return (
    <div className="relative">
      {/* Chart Toolbar */}
      <div className="flex justify-between items-center px-4 pt-2 bg-bk-bg">
         <div className="flex gap-4 text-xs font-medium text-bk-subtext">
            <span className="text-white border-b-2 border-bk-green pb-1 cursor-pointer">กราฟ</span>
            <span className="cursor-pointer hover:text-white transition-colors">รายการซื้อ/ขาย</span>
            <span className="cursor-pointer hover:text-white transition-colors">รายการล่าสุด</span>
         </div>
         
         <div className="flex gap-2">
            <button 
              onClick={() => setIsDrawingMode(!isDrawingMode)}
              className={`p-1.5 rounded transition-colors ${isDrawingMode ? 'bg-bk-green text-white' : 'bg-[#2A2E35] text-bk-subtext'}`}
              title="Draw Trendline"
            >
              <Pencil size={14} />
            </button>
            {lines.length > 0 && (
              <button 
                onClick={() => setLines([])}
                className="p-1.5 rounded bg-[#2A2E35] text-bk-red hover:bg-bk-red/10 transition-colors"
                title="Clear Lines"
              >
                <Trash2 size={14} />
              </button>
            )}
         </div>
      </div>

      <div className="flex gap-2 text-[10px] text-bk-subtext items-center px-4 py-2 bg-bk-bg overflow-x-auto no-scrollbar">
            {timeframes.map((tf) => (
                <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`transition-all px-3 py-1 rounded font-medium border border-transparent whitespace-nowrap ${
                        timeframe === tf 
                        ? 'bg-[#2A2E35] text-bk-green border-bk-green/30 shadow-sm' 
                        : 'text-bk-subtext hover:text-white hover:bg-[#1C2025]'
                    }`}
                >
                    {tf === '7D' ? <span className="flex items-center gap-1"><CalendarDays size={10}/> 7 Day</span> : tf}
                </button>
            ))}
            <span className="ml-auto text-[10px] text-bk-subtext hidden sm:inline-block">
              {isDrawingMode ? 'Drawing Mode Active' : 'Interactive Chart'}
            </span>
      </div>

      <div 
        ref={chartContainerRef}
        className={`h-[300px] w-full bg-bk-bg relative select-none ${isDrawingMode ? 'cursor-crosshair touch-none' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2E35" vertical={false} />
            <XAxis 
                dataKey="time" 
                hide={timeframe !== '7D' && timeframe !== '1d'} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8B959E', fontSize: 10 }}
                interval="preserveStartEnd"
                minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              orientation="right" 
              tick={{ fill: '#8B959E', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              width={60}
            />
            {!isDrawingMode && <Tooltip content={<CustomTooltip />} />}
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={color} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              strokeWidth={2}
              animationDuration={500}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Drawing Overlay Layer */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full z-10">
           {lines.map((line, i) => (
             <line 
               key={i}
               x1={line.x1} y1={line.y1}
               x2={line.x2} y2={line.y2}
               stroke="#FACC15" // Yellow lines
               strokeWidth="2"
               strokeDasharray="4 2"
             />
           ))}
           {currentLine && (
             <line 
               x1={currentLine.x1} y1={currentLine.y1}
               x2={currentLine.x2} y2={currentLine.y2}
               stroke="#FACC15"
               strokeWidth="2"
               strokeDasharray="4 2"
               opacity="0.8"
             />
           )}
        </svg>
      </div>
    </div>
  );
};

export default CryptoChart;
