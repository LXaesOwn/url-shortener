import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStats } from '../api/client';
import StatsTable from '../components/StatsTable';
import { IStatsResponse } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const StatsPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [stats, setStats] = useState<IStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!shortCode) return;
      
      try {
        const data = await getStats(shortCode);
        setStats(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [shortCode]);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading statistics...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: '#c62828' }}>{error}</div>;
  if (!stats) return null;

  const clicksByDate = stats.clicks.reduce((acc: any, click) => {
    const date = new Date(click.clicked_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(clicksByDate).map(([date, count]) => ({ date, clicks: count }));

  const browserStats = stats.clicks.reduce((acc: any, click) => {
    acc[click.browser] = (acc[click.browser] || 0) + 1;
    return acc;
  }, {});

  const browserChartData = Object.entries(browserStats).map(([browser, count]) => ({ browser, count }));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>URL Statistics</h1>
        <a href={stats.url.shareUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3', textDecoration: 'none' }}>
          {stats.url.shareUrl}
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>Total Clicks</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>{stats.url.totalClicks}</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>Original URL</h3>
          <div style={{ wordBreak: 'break-all' }}>{stats.url.originalUrl.substring(0, 60)}...</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>Created</h3>
          <div>{new Date(stats.url.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', overflowX: 'auto' }}>
          <h3>Clicks Over Time</h3>
          <LineChart width={800} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
          </LineChart>
        </div>
      )}

      {browserChartData.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', overflowX: 'auto' }}>
          <h3>Clicks by Browser</h3>
          <BarChart width={600} height={300} data={browserChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="browser" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>
      )}

      <StatsTable clicks={stats.clicks} />
    </div>
  );
};

export default StatsPage;