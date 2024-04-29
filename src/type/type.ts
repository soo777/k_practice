export interface CoinType {
  bookmark: boolean;
  key: string;
  symbol: string;
  name: string;
  price: number;
  hour: number;
  day: number;
  week: number;
  volumes: number;
  marketCapRank: number;
}

export interface CoinDetailType {
  bookmark: boolean;
  key: string;
  image: string;
  marketCapRank: number;
  website: string;
  localization_ko: string;
  symbol: string;
  name: string;
  price_krw: number;
  price_usd: number;
  hour: number;
  day: number;
  week: number;
  volumes_krw: number;
  volumes_usd: number;
  market_cap_krw: number;
  market_cap_usd: number;
  description_ko: string;
  dscription_en: string;
  price_change_24h_krw: number;
  price_change_24h_usd: number;
  price_change_24h_btc: number;
}
