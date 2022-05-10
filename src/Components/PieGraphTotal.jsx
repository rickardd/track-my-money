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
  data.push({ name: 'Uncategorized', value: percent })


  const COLORS = [
    'hsla(283, 27%, 51%, 1)',
    'hsla(359, 94%, 62%, 1)',
    'hsla(21, 89%, 56%, 1)',
    'hsla(33, 94%, 55%, 1)',
    'hsla(42, 93%, 64%, 1)',
    'hsla(94, 38%, 59%, 1)',
    'hsla(162, 43%, 46%, 1)',
    'hsla(208, 25%, 45%, 1)',
  ]

  const innerRadius = 46;
  const outerRadius = 60;
  const labelVerticalDistance = 26;
  const labelHorizontalDistance = 150;
  const totalHeight = outerRadius * 2 + labelVerticalDistance * 2 ;
  const totalWidth = outerRadius * 2 + labelHorizontalDistance * 2 ;
  
  return (
    <div>
      <PieChart width={totalWidth} height={totalHeight}>
        <Pie
          data={data}
          cx={totalWidth / 2}
          cy={totalHeight / 2}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          label={entry => entry.name}
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
