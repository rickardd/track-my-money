import "./Graph.css";
import { useContext } from "react";
import AppContext from "../app-context";
import { getTransactionsGroupedByMonth, countTotal } from "../Services/helper";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  Tooltip,
  AreaChart,
} from "recharts";

import { getFilteredTransactions } from "../Services/helper";

export function Graph(props) {
  const { filter } = props;
  const { transactions: allTransactions } = useContext(AppContext);

  const transactions = getFilteredTransactions(filter.queries, allTransactions);

  const getData = () => {
    const groupedTranslations = getTransactionsGroupedByMonth(transactions);

    const data = Object.entries(groupedTranslations)
      .map(([label, transactions]) => {
        return {
          Name: label,
          Value: countTotal(transactions),
        };
      })
      .reverse();

    return data;
  };

  return (
    <div className="graph">
      <AreaChart width={452} height={152} data={getData()}>
        <CartesianGrid stroke="#ddd" strokeDasharray="5 5" />
        <XAxis dataKey="Name" stroke="#9261a5" fontSize="12" />
        <YAxis stroke="#9261a5" fontSize="12" />
        <Area dataKey="Value" stroke="#9261a5" fill="#9261a5" />
        <Tooltip />
      </AreaChart>
    </div>
  );
}

export default Graph;
