import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStats } from '../api/client';
import { IStatsResponse } from '../types';
import styles from './StatsPage.module.css';

const StatsPage: React.FC = () => {
  const { shortCode } = useParams();
  const [data, setData] = useState<IStatsResponse | null>(null);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Нет данных';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

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

  const { url, stats } = data;
  const totalClicks = stats.totalClicks || 0;
  const browserData = Object.entries(stats.browserStats || {});
  const allClicks = stats.allClicks || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📊 Statistics</h1>
        <Link to="/" className={styles.homeLink}>🏠 Home</Link>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>🔗 Original URL:</span>
          <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
            {url.originalUrl}
          </a>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>📎 Short URL:</span>
          <a href={url.shareUrl} target="_blank" rel="noopener noreferrer">
            {url.shareUrl}
          </a>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>📅 Created:</span>
          <span>{formatDate(url.createdAt)}</span>
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
                <div className={styles.statCount}>
                  {count} ({Math.round((count / totalClicks) * 100)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {allClicks.length > 0 && (
        <div className={styles.section}>
          <h2>📋 Details</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>IP Address</th>
                  <th>Browser</th>
                  <th>Version</th>
                  <th>OS</th>
                </tr>
              </thead>
              <tbody>
                {allClicks.map((click) => (
                  <tr key={click.id}>
                    <td>{formatDate(click.clickedAt)}</td>
                    <td>{click.ipAddress || 'Unknown'}</td>
                    <td>{click.browser || 'Unknown'}</td>
                    <td>{click.browserVersion || 'Unknown'}</td>
                    <td>{click.os || 'Unknown'}</td>
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