import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import type { TableProps } from "antd";
import { Constant } from "../util/Constant";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { CoinType } from "../type/type";
import { Link } from "react-router-dom";

const CoinList = (props: {
  data: CoinType[];
  currency: string;
  viewType: string;
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [dataSource, setDataSource] = useState<CoinType[]>(props.data);

  useEffect(() => {
    setDataSource(props.data);
  }, [props.data]);

  const columns: TableProps<any>["columns"] = [
    {
      title: "",
      dataIndex: "bookmark",
      key: "bookmark",
      render: (value: boolean, item: CoinType, index: number) => (
        <span
          className={
            value ? "text-yellow-200 cursor-pointer" : "cursor-pointer"
          }
          onClick={() => {
            onChangeBookMark(value, item, index);
          }}
        >
          {value ? <StarFilled /> : <StarOutlined />}
        </span>
      ),
    },
    {
      title: "자산",
      dataIndex: "name",
      key: "name",
      render: (value: boolean, item: CoinType) => (
        <span className="font-bold cursor-pointer">
          <Link to={`/coin?name=${item.id}`}>{value}</Link>
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "symbol",
      key: "symbol",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "end",
      render: (value, item: CoinType) => (
        <span className="font-bold">
          {item.currency === Constant.CURRENCY.KRW ? "₩" : "$"}
          {value && value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "1H",
      key: "hour",
      dataIndex: "hour",
      align: "end",
      render: (value) => {
        return {
          props: {
            style: {
              color: parseInt(value) > 0 ? "red" : "blue",
              fontWeight: 600,
            },
          },
          children: (
            <div>
              {value &&
                value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
              %
            </div>
          ),
        };
      },
    },
    {
      title: "24H",
      key: "day",
      dataIndex: "day",
      align: "end",
      render: (value) => {
        return {
          props: {
            style: {
              color: parseInt(value) > 0 ? "red" : "blue",
              fontWeight: 600,
            },
          },
          children: (
            <div>
              {value &&
                value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
              %
            </div>
          ),
        };
      },
    },
    {
      title: "7D",
      key: "week",
      dataIndex: "week",
      align: "end",
      render: (value) => {
        return {
          props: {
            style: {
              color: parseInt(value) > 0 ? "red" : "blue",
              fontWeight: 600,
            },
          },
          children: (
            <div>
              {value &&
                value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
              %
            </div>
          ),
        };
      },
    },
    {
      title: "24H Volume",
      key: "volumes",
      dataIndex: "volumes",
      align: "end",
      render: (value, item: CoinType) => (
        <span className="font-bold">
          {item.currency === Constant.CURRENCY.KRW ? "₩" : "$"}
          {value && value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  /**
   * 북마크 설정
   */
  const onChangeBookMark = (value: boolean, item: CoinType, index: number) => {
    if (props.viewType === Constant.VIEW_TYPE.ALL) {
      // 전체보기
      const changedItem = dataSource.filter(
        (data: CoinType) => data.id === item.id
      )[0];
      changedItem.bookmark = !value;
      changedItem.currency = props.currency;
      dataSource.splice(index, 1, changedItem);

      setDataSource(dataSource);

      if (!value) {
        // 북마크 추가
        let arr: CoinType[] = [];
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
          (bookmarkItem: CoinType) => bookmarkItem.id !== item.id
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
    } else {
      // 북마크 보기
      const arr = dataSource.filter((data) => data.id !== item.id);
      setDataSource(arr);

      let bookmarkArr = JSON.parse(localStorage.getItem("bookmark")!);
      bookmarkArr = bookmarkArr.filter(
        (bookmarkItem: CoinType) => bookmarkItem.id !== item.id
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
      content: `북마크에 ${!value ? "추가" : "삭제"} 되었습니다.`,
    });
  };

  return (
    <>
      <Table
        className="pt-3"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ y: 500 }}
      />
      {contextHolder}
    </>
  );
};

export default CoinList;
