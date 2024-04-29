import { message } from 'antd';
import CoinApi from '../api/coinApi';
import { CoinDetailType, CoinType } from '../../../type/type';
import { checkBookMark } from '../../../util/Util';
import { Constant } from '../../../util/Constant';

export function CoinStore() {
  const { getCoinMarketsApi, getCoinByNameApi } = CoinApi();

  /**
   * coin market list 조회
   */
  const getCoinMarkets = async (currency: string, page: number, pageSize: number) => {
    try {
      const data = await getCoinMarketsApi(currency, page, pageSize);

      let bookmarkJson = localStorage.getItem('bookmark');
      let arr: CoinType[] = [];
      data.data.forEach((item: any) => {
        arr.push({
          bookmark: bookmarkJson ? checkBookMark(bookmarkJson, item.id) : false,
          id: item.id,
          key: item.symbol,
          symbol: item.name,
          name: item.name,
          price: item.current_price,
          hour: item.price_change_percentage_1h_in_currency,
          day: item.price_change_percentage_24h_in_currency,
          week: item.price_change_percentage_7d_in_currency,
          volumes: item.total_volume,
          marketCapRank: item.market_cap_rank,
          currency: undefined,
        });
      });

      return arr;
    } catch (e: any) {
      if (e.response.status === 429) {
        message.error('잠시후에 다시 요청해주세요.');
      } else {
        message.error(e.message);
      }
      return false;
    }
  };

  /**
   * coin 상세 조회
   */
  const getCoinByName = async (name: string, currency: string) => {
    try {
      const data = await getCoinByNameApi(name);

      let bookMarkJson = localStorage.getItem('bookmark');
      const item = data.data;
      let coinData: CoinDetailType = {
        bookmark: bookMarkJson ? checkBookMark(bookMarkJson, item.id) : false,
        id: item.id,
        key: item.symbol,
        image: item.image.thumb,
        marketCapRank: item.market_cap_rank,
        website: item.links.homepage[0],
        localization_ko: item.localization.ko,
        symbol: item.symbol,
        name: item.name,
        price_krw: item.market_data.current_price.krw,
        price_usd: item.market_data.current_price.usd,
        hour:
          currency === Constant.CURRENCY.KRW
            ? item.market_data.price_change_percentage_1h_in_currency.krw
            : item.market_data.price_change_percentage_1h_in_currency.usd,
        day:
          currency === Constant.CURRENCY.KRW
            ? item.market_data.price_change_percentage_24h_in_currency.krw
            : item.market_data.price_change_percentage_24h_in_currency.usd,
        week:
          currency === Constant.CURRENCY.KRW
            ? item.market_data.price_change_percentage_7d_in_currency.krw
            : item.market_data.price_change_percentage_7d_in_currency.usd,
        volumes_krw: item.market_data.total_volume.krw,
        volumes_usd: item.market_data.total_volume.usd,
        market_cap_krw: item.market_data.market_cap.krw,
        market_cap_usd: item.market_data.market_cap.usd,
        description_ko: item.description.ko,
        dscription_en: item.description.en,
        price_change_24h_krw: item.market_data.price_change_percentage_24h_in_currency.krw,
        price_change_24h_usd: item.market_data.price_change_percentage_24h_in_currency.usd,
        price_change_24h_btc: item.market_data.price_change_percentage_24h_in_currency.btc,
      };
      return coinData;
    } catch (e: any) {
      if (e.response.status === 429) {
        message.error('잠시후에 다시 요청해주세요.');
      } else {
        message.error(e.message);
      }
    }
  };

  return {
    getCoinMarkets,
    getCoinByName,
  };
}

export default CoinStore;
