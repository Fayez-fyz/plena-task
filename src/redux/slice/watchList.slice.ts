import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Coin } from '@/types/coins';

export interface WatchlistToken {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  price_btc: number;
  price?: number;
  price_change_percentage_24h_usd?: number;
  sparkline?: string;
  holdings: number;
  value: number;
}

interface WatchlistState {
  tokens: WatchlistToken[];
  lastUpdated: string | null;
}

const initialState: WatchlistState = {
  tokens: [],
  lastUpdated: null,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addTokens: (state, action: PayloadAction<Coin[]>) => {
      const newTokens = action.payload.map((coin) => ({
        id: coin.item.id,
        coin_id: coin.item.coin_id,
        name: coin.item.name,
        symbol: coin.item.symbol,
        market_cap_rank: coin.item.market_cap_rank,
        thumb: coin.item.thumb,
        small: coin.item.small,
        large: coin.item.large,
        price_btc: coin.item.price_btc,
        price: coin.item.data?.price || 0,
        price_change_percentage_24h_usd: coin.item.data?.price_change_percentage_24h?.usd || 0,
        sparkline: coin.item.data?.sparkline || '',
        holdings: 0,
        value: 0,
      }));
      const existingIds = new Set(state.tokens.map(token => token.id));
      const uniqueNewTokens = newTokens.filter(token => !existingIds.has(token.id));
      
      state.tokens.push(...uniqueNewTokens);
      state.lastUpdated = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    },
    removeToken: (state, action: PayloadAction<string>) => {
      state.tokens = state.tokens.filter(token => token.id !== action.payload);
    },
    updateHoldings: (state, action: PayloadAction<{ id: string; holdings: number }>) => {
      const { id, holdings } = action.payload;
      const token = state.tokens.find(token => token.id === id);
      if (token) {
        token.holdings = holdings;
        token.value = holdings * (token.price || 0);
      }
    },
    updatePrices: (state, action: PayloadAction<{ id: string; price: number; change24h: number; sparkline?: string }[]>) => {
      action.payload.forEach(({ id, price, change24h, sparkline }) => {
        const token = state.tokens.find(token => token.id === id);
        if (token) {
          token.price = price;
          token.price_change_percentage_24h_usd = change24h;
          if (sparkline) token.sparkline = sparkline;
          token.value = token.holdings * price;
        }
      });
      state.lastUpdated = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    },
  },
});

export const { addTokens, removeToken, updateHoldings, updatePrices } = watchlistSlice.actions;
export default watchlistSlice.reducer;