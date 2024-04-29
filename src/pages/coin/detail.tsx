import React, { useEffect, useState } from "react";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DownOutlined,
  StarFilled,
  StarOutlined,
  UpOutlined,
} from "@ant-design/icons";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import CoinStore from "../../service/coin/store/coinStore";
import { Divider, Image, Input, Select, Spin, message } from "antd";
import { Constant } from "../../util/Constant";
import { CoinDetailType, CoinType } from "../../type/type";

const Detail = () => {
  const query = queryString.parse(useLocation().search);
  const { getCoinByName } = CoinStore();
  const [messageApi, contextHolder] = message.useMessage();

  const [currency, setCurrency] = useState<string>(Constant.CURRENCY.KRW);
  const [openDiscription, setOpenDiscription] = useState<boolean>(false);
  const [coinData, setCoinData] = useState<CoinDetailType>();
  const [cryptValue, setCryptValue] = useState<string>("1");
  const [currencyValue, setCurrencyValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch(query.name);
  }, []);

  useEffect(() => {
    console.log(coinData);
  }, [coinData]);

  /**
   * 코인 상세 정보 조회
   */
  const fetch = async (name: string | (string | null)[] | null) => {
    let bookMarkJson = localStorage.getItem("bookmark");
    setLoading(true);
    const data: any = await getCoinByName(String(name).toLowerCase());
    setLoading(false);

    if (data.status === 200) {
      const item = data.data;
      let coinData: CoinDetailType = {
        bookmark: bookMarkJson
          ? checkBookMark(bookMarkJson, item.symbol)
          : false,
        id: item.id,
        key: item.name,
        image: item.image.thumb,
        marketCapRank: item.market_cap_rank,
        website: item.links.homepage[0],
        localization_ko: item.localization.ko,
        symbol: item.symbol,
        name: item.name,
        price_krw: item.market_data.current_price.krw,
        price_usd: item.market_data.current_price.usd,
        hour: item.market_data.price_change_percentage_1h_in_currency,
        day: item.market_data.price_change_percentage_24h_in_currency,
        week: item.market_data.price_change_percentage_7d_in_currency,
        volumes_krw: item.market_data.total_volume.krw,
        volumes_usd: item.market_data.total_volume.usd,
        market_cap_krw: item.market_data.market_cap.krw,
        market_cap_usd: item.market_data.market_cap.usd,
        description_ko: item.description.ko,
        dscription_en: item.description.en,
        price_change_24h_krw:
          item.market_data.price_change_percentage_24h_in_currency.krw,
        price_change_24h_usd:
          item.market_data.price_change_percentage_24h_in_currency.usd,
        price_change_24h_btc:
          item.market_data.price_change_percentage_24h_in_currency.btc,
      };
      console.log(coinData);
      setCoinData(coinData);
      setCurrencyValue(
        currency === Constant.CURRENCY.KRW
          ? coinData.price_krw
          : coinData.price_usd
      );
    }
  };

  /**
   * 북마크 여부 판별
   */
  const checkBookMark = (bookmarkJson: string, key: string) => {
    return JSON.parse(bookmarkJson).filter((item: CoinType) => item.key === key)
      .length > 0
      ? true
      : false;
  };

  /**
   * 통화 변경
   */
  const onChangeCurrency = (value: string) => {
    setCurrency(value);
    let price =
      value === Constant.CURRENCY.KRW
        ? coinData!.price_krw
        : coinData!.price_usd;
    setCryptValue("1");
    setCurrencyValue(price);
  };

  /**
   * 북마크 설정
   */
  const changeBookMark = () => {
    let tmp: CoinDetailType = JSON.parse(JSON.stringify(coinData!));
    tmp!.bookmark = !coinData?.bookmark;
    setCoinData(tmp);

    if (!coinData?.bookmark) {
      // 북마크 추가
      let arr: CoinType[] = [];
      let changedItem = {
        bookmark: !coinData!.bookmark,
        id: coinData!.id,
        key: coinData!.symbol,
        symbol: coinData!.symbol,
        name: coinData!.name,
        price: coinData!.price_krw,
        hour: coinData!.hour,
        day: coinData!.day,
        week: coinData!.week,
        volumes: coinData!.volumes_krw,
        marketCapRank: coinData!.marketCapRank,
      };
      let bookmark = localStorage.getItem("bookmark");
      if (bookmark !== null) {
        arr = JSON.parse(bookmark).concat(changedItem);
      } else {
        arr.push(changedItem);
      }
      localStorage.setItem(
        "bookmark",
        JSON.stringify(
          arr.sort(
            (a: CoinType, b: CoinType) => a.marketCapRank - b.marketCapRank
          )
        )
      );
    } else {
      // 북마크 삭제
      let bookmarkArr = JSON.parse(localStorage.getItem("bookmark")!);
      bookmarkArr = bookmarkArr.filter(
        (bookmarkItem: CoinType) => bookmarkItem.key !== coinData?.key
      );
      localStorage.setItem(
        "bookmark",
        JSON.stringify(
          bookmarkArr.sort(
            (a: CoinType, b: CoinType) => a.marketCapRank - b.marketCapRank
          )
        )
      );
    }
    messageApi.open({
      type: "success",
      content: `북마크에 ${!coinData?.bookmark ? "추가" : "삭제"} 되었습니다.`,
    });
  };

  /**
   * 가격 계산(코인)
   */
  const onChangeCryptValue = (e: any) => {
    const value = e.target.value.replace(/[^-\.0-9]/g, "");
    const arr = value.split(".");

    let price =
      currency === Constant.CURRENCY.KRW
        ? coinData!.price_krw
        : coinData!.price_usd;

    if (arr.length > 2) {
      return;
    }
    if (arr[1] && arr[1].length > 8) {
      return;
    }
    if (value === "") {
      setCurrencyValue(price);
      setCryptValue("1");
    } else {
      setCurrencyValue(Number(value) * price);
      setCryptValue(value);
    }
  };

  /**
   * 가격 계산(통화)
   */
  const onChangeCurrencyValue = (e: any) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    console.log(value);
    let price =
      currency === Constant.CURRENCY.KRW
        ? coinData!.price_krw
        : coinData!.price_usd;
    if (currency === Constant.CURRENCY.KRW && value === "") {
      setCryptValue((1 / price).toFixed(8));
      setCurrencyValue(1);
      return;
    } else {
      setCryptValue((Number(value) / price).toFixed(8));
      setCurrencyValue(Number(value));
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="p-10">
        <div className="flex justify-between">
          <div>
            {coinData?.bookmark ? (
              <StarFilled className="text-xl" onClick={changeBookMark} />
            ) : (
              <StarOutlined className="text-xl" onClick={changeBookMark} />
            )}
            <span className="mr-2 ml-2">
              <Image className="w-7" src={coinData?.image} />
            </span>
            <span className="text-2xl font-bold">
              {coinData?.localization_ko} ({coinData?.symbol})
            </span>
          </div>
          <div>
            <Select
              defaultValue={Constant.CURRENCY.KRW}
              style={{ width: 120 }}
              onChange={(value) => {
                onChangeCurrency(value);
              }}
              options={[
                { value: Constant.CURRENCY.KRW, label: "KRW 보기" },
                { value: Constant.CURRENCY.USD, label: "USD 보기" },
              ]}
            />
          </div>
        </div>
        <div className="flex mt-8">
          <div className="w-1/2">
            <table className="w-full order-collapse border-solid border-2 border-black-100">
              <tbody>
                <tr className="border-solid border-2 border-black-100 ">
                  <th className="w-2/5 border-solid border-2 border-black-100 p-3 text-left font-bold">
                    시가총액 Rank
                  </th>
                  <td className="p-3">rank {coinData?.marketCapRank}</td>
                </tr>
                <tr>
                  <th className="w-1/4 border-solid border-2 border-black-100 p-3 text-left font-bold">
                    웹사이트
                  </th>
                  <td className="p-3">{coinData?.website}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-1/2 grid justify-end">
            <div className=" ">
              <div className="text-right flex justify-end">
                <div className="text-2xl font-bold">
                  {currency === Constant.CURRENCY.KRW
                    ? `₩${coinData?.price_krw.toLocaleString("ko-KR", {
                        maximumFractionDigits: 2,
                      })}`
                    : `$${coinData?.price_usd.toLocaleString("ko-KR", {
                        maximumFractionDigits: 2,
                      })}`}
                </div>
                <div className="text-lg w-20">
                  <span
                    className={
                      coinData && coinData!.price_change_24h_krw > 0
                        ? "text-red-600"
                        : "text-blue-600"
                    }
                  >
                    {coinData?.price_change_24h_krw.toLocaleString("ko-KR", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  %
                </div>
              </div>
              <div className="ml-8 text-right flex justify-end">
                <div>1.00000000 {coinData?.symbol.toUpperCase()}</div>
                <div className="w-20">{coinData?.price_change_24h_btc}%</div>
              </div>
            </div>
            <div className="flex mt-3">
              <div className="text-right">
                <div>시가총액</div>
                <div>
                  {currency === Constant.CURRENCY.KRW
                    ? `₩${coinData?.market_cap_krw.toLocaleString("ko-KR", {
                        maximumFractionDigits: 2,
                      })}`
                    : `$${coinData?.market_cap_usd.toLocaleString("ko-KR", {
                        maximumFractionDigits: 2,
                      })}`}
                </div>
              </div>
              <div className="ml-16 text-right">
                <div>24시간 거래대금</div>
                <div>
                  {currency === Constant.CURRENCY.KRW
                    ? `₩${coinData?.volumes_krw.toLocaleString("ko-KR", {
                        maximumFractionDigits: 2,
                      })}`
                    : `$${coinData?.volumes_usd.toLocaleString("ko-KR", {
                        maximumFractionDigits: 2,
                      })}`}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-300 mt-6">
          <div className="pt-5 px-5 font-bold">가격계산</div>
          <div className="flex pl-5 pt-3 pb-8 justify-center">
            <div className="w-2/5">
              <table className="w-full">
                <tbody>
                  <tr>
                    <th className="w-1/3 border-solid  bg-gray-200 p-3">
                      {coinData?.symbol.toUpperCase()}
                    </th>
                    <td className="w-2/3 bg-gray-50 p-3 text-right">
                      <Input
                        className="p-1 text-right"
                        type="text"
                        value={Number(cryptValue).toLocaleString("ko-KR", {
                          maximumFractionDigits: 2,
                        })}
                        onChange={(e) => {
                          onChangeCryptValue(e);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="ml-5 mr-5 flex flex-col-reverse self-center">
              <ArrowLeftOutlined />
              <ArrowRightOutlined />
            </div>
            <div className="w-2/5">
              <table className="w-full">
                <tbody>
                  <tr>
                    <th className="w-1/3 border-solid  bg-gray-200 p-3">
                      {currency.toUpperCase()}
                    </th>
                    <td className="w-2/3 bg-gray-50 p-3 text-right">
                      <Input
                        className="p-1 text-right"
                        type="text"
                        value={currencyValue!.toLocaleString("ko-KR", {
                          maximumFractionDigits: 2,
                        })}
                        onChange={(e) => {
                          onChangeCurrencyValue(e);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {(coinData?.description_ko || coinData?.dscription_en) && (
          <>
            <div className="p-5 flex justify-center">
              <span className="mr-3">설명보기</span>
              {openDiscription ? (
                <UpOutlined
                  className="cursor-pointer"
                  onClick={() => setOpenDiscription(!openDiscription)}
                />
              ) : (
                <DownOutlined
                  className="cursor-pointer"
                  onClick={() => setOpenDiscription(!openDiscription)}
                />
              )}
            </div>
            <Divider />
            {openDiscription && (
              <div className="whitespace-pre-line">
                {coinData?.description_ko
                  ? coinData?.description_ko
                  : coinData?.dscription_en}
              </div>
            )}
          </>
        )}
        {contextHolder}
      </div>
    </Spin>
  );
};

export default Detail;
