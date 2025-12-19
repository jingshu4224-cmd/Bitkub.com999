
import { Coin } from "../types";

const API_URL = 'http://localhost:5000/api';

export const api = {
    // Auth
    login: async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return await res.json();
        } catch (e) { return null; }
    },

    // Get Data (Wallet + Market)
    getData: async (token: string) => {
        try {
            const res = await fetch(`${API_URL}/data`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await res.json();
        } catch (e) { return null; }
    },

    // Trade
    trade: async (token: string, type: 'BUY' | 'SELL', symbol: string, amount: number) => {
        try {
            const res = await fetch(`${API_URL}/trade`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type, symbol, amount })
            });
            return await res.json();
        } catch (e) { return { success: false, message: 'Connection Error' }; }
    }
};
