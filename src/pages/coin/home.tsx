import React, { useEffect, useState } from "react";
import { Segmented, Select } from "antd";
import CoinStore from "../../service/coin/store/coinStore";
import { Constant } from "../../util/Constant";
import CoinList from "../../components/coinList";
import { CoinType } from "../../type/type";

const List = () => {
  const { getCoinMarkets } = CoinStore();
  const [viewTypw, setViewType] = useState<string>(Constant.VIEW_TYPE.ALL);
  const [currency, setCurrency] = useState<string>(Constant.CURRENCY.KRW);
  const [page, setPage] = useState<Number>(1);
  const [pageSize, setPageSize] = useState<Number>(Constant.PAGE_SIZE.FIFTY);
  const [allList, setAllList] = useState<CoinType[]>([]);

  useEffect(() => {
    fetch();
  }, []);

  /**
   * 시세 목록 조회
   */
  const fetch = async () => {
    const data: any = await getCoinMarkets(currency, page, pageSize);
    let arr: CoinType[] = [];
    data.data.forEach((item: any) => {
      arr.push({
        bookmark: false,
        key: item.id,
        symbol: item.name,
        name: item.name,
        price: item.current_price,
        hour: item.price_change_percentage_1h_in_currency,
        day: item.price_change_percentage_24h_in_currency,
        week: item.price_change_percentage_7d_in_currency,
        volumes: item.market_cap_change_24h,
      });
    });
    setAllList(arr);
  };

  /**
   * 보기 방식 변경
   */
  const onChangeViewType = (value: string) => {
    setViewType(value);
  };

  /**
   * 통화 변경
   */
  const onChangeCurrency = (value: string) => {
    setCurrency(value);
  };

  /**
   * 표시 개수 변경
   */
  const onChangePageSize = (value: number) => {
    setPageSize(value);
  };

  return (
    <>
      <div className="w-9/12">
        <div>
          <Segmented<string>
            options={[
              { value: Constant.VIEW_TYPE.ALL, label: "가상자산 시세 목록" },
              { value: Constant.VIEW_TYPE.BOOKMARK, label: "북마크 목록" },
            ]}
            block
            value={viewTypw}
            onChange={(value) => {
              setViewType(value);
            }}
          />
        </div>
        <div className="float-right my-3">
          <Select
            defaultValue={Constant.VIEW_TYPE.ALL}
            style={{ width: 120 }}
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

        <CoinList data={allList} curreny={currency} />
      </div>
    </>
  );
};

export default List;
