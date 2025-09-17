export interface PriceChangePercentage24h {
  [currency: string]: number;
}

export interface CoinData {
  price: number;
  price_btc: string;
  price_change_percentage_24h: PriceChangePercentage24h;
  market_cap: string;
  market_cap_btc: string;
  total_volume: string;
  total_volume_btc: string;
  sparkline: string;
  content: string | null;
}

export interface CoinItem {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
  data: CoinData;
}

export interface Coin {
  item: CoinItem;
}

export type CoinsResponse = Coin[];
