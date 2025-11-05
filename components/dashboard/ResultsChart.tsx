
import React from 'react';
import { Area } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  area: Area;
  total: number;
}

interface ResultsChartProps {
  data: ChartData[];
}

const COLORS = ['#818cf8', '#fb923c', '#4ade80', '#f87171', '#60a5fa'];

const ResultsChart: React.FC<ResultsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="area" tick={{ fill: '#94a3b8' }} fontSize={12} />
        <YAxis tick={{ fill: '#94a3b8' }} fontSize={12} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            borderColor: '#334155',
            color: '#cbd5e1'
          }}
          cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
        />
        <Bar dataKey="total" name="Resultados Tangibles">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResultsChart;
