import './Graph.css';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';



export function Graph(props) {

  const { filter } = props;

  // Get transactoion data
  // getFilteredTransactions(filter.queries, transactions)
  
  const data = [
    {name: 'Jan', uv: 200},
    {name: 'Feb', uv: 500},
    {name: 'Mar', uv: 600},
  ];
  
  return (
    <div className="graph">
      <LineChart width={452} height={152} data={data}>
        <Line type="monotone" dataKey="uv" label={{ fill: '#9261a5', fontSize: 12 }} stroke="#9261a5" />
        <CartesianGrid stroke="#ddd" strokeDasharray="5 5" />
        <XAxis dataKey="name" stroke="#9261a5" fontSize="12" />
        <YAxis stroke="#9261a5" fontSize="12"/>
        <Tooltip />
      </LineChart>
    </div>
  );
}

export default Graph;
