import { message } from "antd";
import axios from "axios";

export function CoinApi() {
  /**
   *  coin market list 조회
   */
  const getCoinMarketsApi = async (
    currency: String,
    page: Number,
    pageSize: Number
  ) => {
    try {
      const data = await axios.get(
        `/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${pageSize}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d&locale=en`
      );
      return data;
    } catch (e: any) {
      message.error(e.message);
      return false;
    }
  };

  return {
    getCoinMarketsApi,
  };
}

export default CoinApi;
