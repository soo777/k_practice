import React, { useEffect, useState } from "react";
import { Button, Segmented, Select } from "antd";
import CoinStore from "../../service/coin/store/coinStore";
import { Constant } from "../../util/Constant";
import CoinList from "../../components/coinList";
import { CoinType } from "../../type/type";

const List = () => {
  const { getCoinMarkets } = CoinStore();
  const [viewType, setViewType] = useState<string>(Constant.VIEW_TYPE.ALL);
  const [currency, setCurrency] = useState<string>(Constant.CURRENCY.KRW);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(Constant.PAGE_SIZE.FIFTY);
  const [allList, setAllList] = useState<CoinType[]>([]);
  const [bookMarkList, setBookMarkList] = useState<CoinType[]>([]);

  useEffect(() => {
    fetch(currency, page, pageSize);
  }, []);

  /**
   * 시세 목록 조회
   */
  const fetch = async (currency: string, page: number, pageSize: number) => {
    let bookmarkJson = localStorage.getItem("bookmark");
    const data: any = await getCoinMarkets(currency, page, pageSize);
    if (data.status === 200) {
      let arr: CoinType[] = [];
      data.data.forEach((item: any) => {
        arr.push({
          bookmark: bookmarkJson
            ? checkBookMark(bookmarkJson, item.name)
            : false,
          key: item.name,
          symbol: item.name,
          name: item.name,
          price: item.current_price,
          hour: item.price_change_percentage_1h_in_currency,
          day: item.price_change_percentage_24h_in_currency,
          week: item.price_change_percentage_7d_in_currency,
          volumes: item.market_cap_change_24h,
          marketCapRank: item.market_cap_rank,
        });
      });
      setAllList(allList.concat(arr));
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
   * 보기 방식 변경
   */
  const onChangeViewType = (value: string) => {
    let bookMarkJson = localStorage.getItem("bookmark");

    console.log(viewType);
    if (viewType === Constant.VIEW_TYPE.ALL) {
      setBookMarkList(bookMarkJson !== null ? JSON.parse(bookMarkJson) : []);
    } else {
      let arr: CoinType[] = [];
      allList.forEach((item: CoinType) => {
        arr.push({
          bookmark: bookMarkJson
            ? checkBookMark(bookMarkJson, item.key)
            : false,
          key: item.name,
          symbol: item.name,
          name: item.name,
          price: item.price,
          hour: item.hour,
          day: item.day,
          week: item.week,
          volumes: item.volumes,
          marketCapRank: item.marketCapRank,
        });
      });
      setAllList(arr);
    }

    setViewType(value);
  };

  /**
   * 통화 변경
   */
  const onChangeCurrency = (value: string) => {
    fetch(value, page, pageSize);
    setCurrency(value);
  };

  /**
   * 표시 개수 변경
   */
  const onChangePageSize = (value: number) => {
    fetch(currency, page, value);
    setPageSize(value);
  };

  /**
   * 더보기
   */
  const loadNextPage = () => {
    fetch(currency, page + 1, pageSize);
    setPage(page + 1);
  };

  return (
    <>
      <div className="w-9/12">
        <div>
          <Segmented<string>
            value={viewType}
            options={[
              { value: Constant.VIEW_TYPE.ALL, label: "가상자산 시세 목록" },
              { value: Constant.VIEW_TYPE.BOOKMARK, label: "북마크 목록" },
            ]}
            block
            onChange={(value) => {
              onChangeViewType(value);
            }}
          />
        </div>

        {viewType === Constant.VIEW_TYPE.ALL && (
          <div className="float-right my-3">
            <Select
              defaultValue={Constant.VIEW_TYPE.ALL}
              style={{ width: 120 }}
              value={viewType}
              onChange={(value) => {
                onChangeViewType(value);
              }}
              options={[
                { value: Constant.VIEW_TYPE.ALL, label: "전체 보기" },
                { value: Constant.VIEW_TYPE.BOOKMARK, label: "북마크 보기" },
              ]}
            />
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
            <Select
              defaultValue={Constant.PAGE_SIZE.FIFTY}
              style={{ width: 120 }}
              onChange={(value) => {
                onChangePageSize(value);
              }}
              options={[
                { value: Constant.PAGE_SIZE.TEN, label: "10개 보기" },
                { value: Constant.PAGE_SIZE.THIRTY, label: "30개 보기" },
                { value: Constant.PAGE_SIZE.FIFTY, label: "50개 보기" },
              ]}
            />
          </div>
        )}

        <CoinList
          data={viewType === Constant.VIEW_TYPE.ALL ? allList : bookMarkList}
          curreny={currency}
          viewType={
            viewType === Constant.VIEW_TYPE.ALL
              ? Constant.VIEW_TYPE.ALL
              : Constant.VIEW_TYPE.BOOKMARK
          }
        />

        {viewType === Constant.VIEW_TYPE.ALL &&
          allList.length > 0 &&
          allList.length % pageSize === 0 && (
            <Button className="w-full" onClick={loadNextPage}>
              + 더보기
            </Button>
          )}
      </div>
    </>
  );
};

export default List;
