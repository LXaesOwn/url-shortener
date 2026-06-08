import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStats } from '../api/client';
import styles from './StatsPage.module.css';

interface ClickData {
  id: number;
  ip_address: string;
  region: string;
  browser: string;
  browser_version: string;
  os: string;
  clicked_at: string;
}

interface StatsData {
  url: {
    originalUrl: string;
    shareUrl: string;
    statsUrl: string;
    totalClicks: number;
    createdAt: string;
  };
  stats: {
    totalClicks: number;
    browserStats: Record<string, number>;
    osStats: Record<string, number>;
    countryStats: Record<string, number>;
    allClicks: ClickData[];
  };
}

const StatsPage: React.FC = () => {
  const { shortCode } = useParams();
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!shortCode) return;
      try {
        const response = await getStats(shortCode);
        setData(response);
      } catch (err: any) {
        setError(err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [shortCode]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner}></div>
          <h2>Loading statistics...</h2>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>❌ Error</h2>
          <p>{error || 'Failed to load statistics'}</p>
          <Link to="/" className={styles.backButton}>🏠 Back to Home</Link>
        </div>
      </div>
    );
  }

  const totalClicks = data.stats?.totalClicks || 0;
  const browserData = Object.entries(data.stats?.browserStats || {});
  const osData = Object.entries(data.stats?.osStats || {});

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📊 Statistics</h1>
        <Link to="/" className={styles.homeLink}>🏠 Home</Link>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>🔗 Original URL:</span>
          <a href={data.url.originalUrl} target="_blank" rel="noopener noreferrer">
            {data.url.originalUrl}
          </a>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>📎 Short URL:</span>
          <a href={data.url.shareUrl} target="_blank" rel="noopener noreferrer">
            {data.url.shareUrl}
          </a>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalClicks}</div>
          <div className={styles.statLabel}>Total Clicks</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{browserData.length}</div>
          <div className={styles.statLabel}>Browsers</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{osData.length}</div>
          <div className={styles.statLabel}>OS</div>
        </div>
      </div>

      {browserData.length > 0 && (
        <div className={styles.section}>
          <h2>🌐 Browsers</h2>
          {browserData.map(([name, count]) => (
            <div key={name} className={styles.statRow}>
              <div className={styles.statLabel}>{name}</div>
              <div className={styles.progressWrapper}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${(count / totalClicks) * 100}%` }}
                  />
                </div>
                <div className={styles.statCount}>{count} ({Math.round((count / totalClicks) * 100)}%)</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.stats?.allClicks && data.stats.allClicks.length > 0 && (
        <div className={styles.section}>
          <h2>📋 Details</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr><th>Time</th><th>IP</th><th>Browser</th><th>OS</th></tr>
              </thead>
              <tbody>
                {data.stats.allClicks.map((click) => (
                  <tr key={click.id}>
                    <td>{new Date(click.clicked_at).toLocaleString()}</td>
                    <td>{click.ip_address}</td>
                    <td>{click.browser}</td>
                    <td>{click.os}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;