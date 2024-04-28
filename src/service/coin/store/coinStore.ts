import { message } from "antd";
import CoinApi from "../api/coinApi";

export function CoinStore() {
  const { getCoinMarketsApi } = CoinApi();

  /**
   * message 등록
   */
  const getCoinMarkets = async (
    currency: String,
    page: Number,
    pageSize: Number
  ) => {
    try {
      const data = await getCoinMarketsApi(currency, page, pageSize);
      return data;
    } catch (e: any) {
      message.error(e.message);
      return false;
    }
  };

  return {
    getCoinMarkets,
  };
}

export default CoinStore;
