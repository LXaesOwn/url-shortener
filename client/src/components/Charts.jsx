import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Charts({ clicks }) {
  if (!clicks || clicks.length === 0) return null;

  const browserCount = clicks.reduce((acc, click) => {
    acc[click.browser] = (acc[click.browser] || 0) + 1;
    return acc;
  }, {});

  const browserData = Object.entries(browserCount).map(([name, value]) => ({ name, value }));

  const regionCount = clicks.reduce((acc, click) => {
    acc[click.region] = (acc[click.region] || 0) + 1;
    return acc;
  }, {});

  const regionData = Object.entries(regionCount).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ margin: '20px' }}>
        <h4>Browsers distribution</h4>
        <PieChart width={300} height={300}>
          <Pie data={browserData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {browserData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div style={{ margin: '20px' }}>
        <h4>Clicks by region</h4>
        <BarChart width={400} height={300} data={regionData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
}