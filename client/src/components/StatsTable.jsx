import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, clearStats } from '../store/linkSlice';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './StatsTable.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

export default function StatsTable({ shortCode }) {
  const dispatch = useDispatch();
  const { currentStats, loading } = useSelector((state) => state.links);

  useEffect(() => {
    if (shortCode) {
      dispatch(fetchStats(shortCode));
    }
    return () => {
      dispatch(clearStats());
    };
  }, [shortCode, dispatch]);

  if (loading) return <div className="stats-loading">Loading stats...</div>;
  if (!currentStats) return <div className="stats-empty">Enter a short code to see stats</div>;

  const browserData = Object.entries(currentStats.browserStats || {}).map(([name, value]) => ({ name, value }));
  const osData = Object.entries(currentStats.osStats || {}).map(([name, value]) => ({ name, value }));
  const countryData = Object.entries(currentStats.countryStats || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>📊 Статистика для ссылки</h2>
        <div className="stats-info">
          <div className="stat-card">
            <div className="stat-value">{currentStats.totalClicks}</div>
            <div className="stat-label">Всего переходов</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Object.keys(countryData).length}</div>
            <div className="stat-label">Стран</div>
          </div>
        </div>
      </div>

      {currentStats.totalClicks > 0 && (
        <>
          <div className="charts-container">
            <div className="chart-box">
              <h3>🌐 Браузеры</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={browserData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {browserData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h3>💻 Операционные системы</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={osData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h3>🌍 Страны</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={countryData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82CA9D" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="clicks-table-container">
            <h3>📋 Детальная статистика переходов</h3>
            <table className="clicks-table">
              <thead>
                <tr>
                  <th>📅 Дата и время</th>
                  <th>🌍 Страна</th>
                  <th>🌐 Браузер</th>
                  <th>💻 ОС</th>
                  <th>🔢 IP адрес</th>
                </tr>
              </thead>
              <tbody>
                {currentStats.clicks?.map((click, idx) => (
                  <tr key={idx}>
                    <td>{new Date(click.date).toLocaleString()}</td>
                    <td>{click.country === 'Localhost' ? '🏠 Локальный' : `🌍 ${click.country || 'Unknown'}`}</td>
                    <td><span className="badge badge-browser">{click.browser || 'Unknown'}</span></td>
                    <td><span className="badge badge-os">{click.os || 'Unknown'}</span></td>
                    <td><code>{click.ip}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}