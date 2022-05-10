import React from 'react';
import { useContext } from "react";
import AppContext from "../app-context";
import { PieChart, Pie, Cell } from 'recharts';
import { getRelevantTransactions, getFilteredTransactions, getFilteredTransactionsOther, countTotal } from "../Services/helper";

export function PieGraphTotal(props) {

  const { filters, transactions, excludeQueries } = useContext(AppContext);

  const relevantTransactions = getRelevantTransactions( excludeQueries, transactions );
  const total = countTotal(relevantTransactions)

  const data = filters.map( f => {
    const filterTransactions = getFilteredTransactions(f.queries, relevantTransactions)
    const filterTotal = countTotal(filterTransactions)
    const percent = (filterTotal / total) * 100
    return { name: f.title, value: percent }
  })
  
  const uncategorizedTranslations = getFilteredTransactionsOther(relevantTransactions, filters)
  const uncategorizedTotal = countTotal(uncategorizedTranslations)
  const percent = (uncategorizedTotal / total) * 100
  data.push({ name: 'uncategorized', value: percent })

  console.log(data);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const innerRadius = 36;
  const outerRadius = 50;
  const labelDistanceFromGraph = 50;
  const totalDiameter = outerRadius * 2 + labelDistanceFromGraph * 2 ;
  
  return (
    <div>
      <PieChart width={totalDiameter} height={totalDiameter}>
        <Pie
          data={data}
          cx={totalDiameter / 2}
          cy={totalDiameter / 2}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          label
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}

export default PieGraphTotal;
