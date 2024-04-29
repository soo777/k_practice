import { message } from "antd";
import CoinApi from "../api/coinApi";

export function CoinStore() {
  const { getCoinMarketsApi, getCoinByNameApi } = CoinApi();

  /**
   * coin market list 조회
   */
  const getCoinMarkets = async (
    currency: string,
    page: number,
    pageSize: number
  ) => {
    try {
      const data = await getCoinMarketsApi(currency, page, pageSize);
      return data;
    } catch (e: any) {
      message.error(e.message);
      return false;
    }
  };

  /**
   * coin 상세 조회
   */
  const getCoinByName = async (name: string) => {
    try {
      const data = await getCoinByNameApi(name);
      return data;
    } catch (e: any) {
      message.error(e.message);
      return false;
    }
  };

  return {
    getCoinMarkets,
    getCoinByName,
  };
}

export default CoinStore;
