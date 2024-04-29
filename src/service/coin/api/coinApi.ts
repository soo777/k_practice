import axios from 'axios';

export function CoinApi() {
  /**
   *  coin market list 조회
   */
  const getCoinMarketsApi = async (currency: string, page: number, pageSize: number) => {
    const data = await axios.get(
      `/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${pageSize}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d&locale=en`,
    );
    return data;
  };

  /**
   *  coin 상세 조회
   */
  const getCoinByNameApi = async (name: string) => {
    const data = await axios.get(`/api/v3/coins/${name}`);
    return data;
  };

  return {
    getCoinMarketsApi,
    getCoinByNameApi,
  };
}

export default CoinApi;
