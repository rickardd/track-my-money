import "./Graph.css";
import { useContext } from "react";
import AppContext from "../app-context";
import { TRANSACTION_VALUE, TRANSACTION_DATE } from "../settings";
// import { formatMoney } from "../Services/helper";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getFilteredTransactions } from "../Services/helper";

export function Graph(props) {
  const { filter } = props;
  const { transactions } = useContext(AppContext);

  const getData = () => {
    const filteredTransactions = getFilteredTransactions(
      filter.queries,
      transactions
    );

    return filteredTransactions
      .map((t) => {
        return {
          Name: t[TRANSACTION_DATE],
          Value: Math.round(Math.abs(t[TRANSACTION_VALUE])),
        };
      })
      .reverse();
  };

  return (
    <div className="graph">
      <LineChart width={452} height={152} data={getData()}>
        <Line
          type="monotone"
          dataKey="Value"
          label={{ fill: "#9261a5", fontSize: 12 }}
          stroke="#9261a5"
        />
        <CartesianGrid stroke="#ddd" strokeDasharray="5 5" />
        <XAxis dataKey="Name" stroke="#9261a5" fontSize="12" />
        <YAxis stroke="#9261a5" fontSize="12" />
        {/* <Tooltip /> */}
      </LineChart>
    </div>
  );
}

export default Graph;
