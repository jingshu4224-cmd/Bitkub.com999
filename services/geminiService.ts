
import { GoogleGenAI } from "@google/genai";
import { Coin } from "../types";

const initGenAI = () => {
  if (!process.env.API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getMarketAnalysis = async (coin: Coin): Promise<string> => {
  const ai = initGenAI();
  if (!ai) return "กรุณาตั้งค่า API Key เพื่อใช้งานฟีเจอร์ AI Analysis";

  const prompt = `
    Analyze the current market situation for ${coin.name} (${coin.symbol}).
    Current Price (THB): ${coin.price}
    24h Change: ${coin.change24h}%
    24h Volume: ${coin.volume24h}
    24h High: ${coin.high24h}
    24h Low: ${coin.low24h}

    Provide a short, concise technical analysis in Thai language (max 3 sentences).
    Focus on whether it's a good time to buy or sell based on standard RSI/MACD theories (simulate these).
    End with a clear "Market Sentiment: Bullish/Bearish/Neutral".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "ไม่สามารถวิเคราะห์ข้อมูลได้ในขณะนี้ โปรดลองใหม่อีกครั้ง";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ไม่สามารถวิเคราะห์ข้อมูลได้ในขณะนี้ โปรดลองใหม่อีกครั้ง";
  }
};
