import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { Constant } from "../util/Constant";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { CoinType } from "../type/type";

const CoinList = (props: { data: CoinType[]; curreny: String }) => {
  const columns: TableProps<any>["columns"] = [
    {
      title: "",
      dataIndex: "bookmark",
      key: "bookmark",
      render: (value: boolean) => (
        <span className={value ? "text-yellow-200" : ""}>
          {value ? <StarFilled /> : <StarOutlined />}
        </span>
      ),
    },
    {
      title: "자산",
      dataIndex: "name",
      key: "name",
      render: (value) => <span className="font-bold">{value}</span>,
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
      render: (value) => (
        <span className="font-bold">
          {props.curreny === Constant.CURRENCY.KRW ? "₩" : "$"}
          {value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "1H",
      key: "hour",
      dataIndex: "hour",
      align: "end",
      render(value) {
        return {
          props: {
            style: {
              color: parseInt(value) > 0 ? "red" : "blue",
              fontWeight: 600,
            },
          },
          children: (
            <div>
              {value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}%
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
      render(value) {
        return {
          props: {
            style: {
              color: parseInt(value) > 0 ? "red" : "blue",
              fontWeight: 600,
            },
          },
          children: (
            <div>
              {value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}%
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
      render(value) {
        return {
          props: {
            style: {
              color: parseInt(value) > 0 ? "red" : "blue",
              fontWeight: 600,
            },
          },
          children: (
            <div>
              {value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}%
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
      render: (value) => (
        <span className="font-bold">
          {props.curreny === Constant.CURRENCY.KRW ? "₩" : "$"}
          {value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={props.data}
        pagination={false}
        scroll={{ y: 500 }}
      />
    </>
  );
};

export default CoinList;
