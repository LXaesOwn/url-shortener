import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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
    clicksByDate: Record<string, number>;
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
      if (!shortCode || shortCode === 'all') {
        setError('Неверный формат ссылки');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching stats for shortCode:', shortCode);
        
        const response = await fetch(`http://localhost:5000/api/stats/${shortCode}`);
        const result = await response.json();
        
        console.log('Stats data:', result);
        
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
        }
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message || 'Не удалось загрузить статистику');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [shortCode]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <h2>Загрузка статистики...</h2>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h2>❌ Ошибка</h2>
          <p>{error || 'Не удалось загрузить статистику'}</p>
          <Link to="/" style={styles.backButton}>🏠 Вернуться на главную</Link>
        </div>
      </div>
    );
  }

  const totalClicks = data.stats?.totalClicks || 0;
  const browserData = Object.entries(data.stats?.browserStats || {});
  const osData = Object.entries(data.stats?.osStats || {});
  const countryData = Object.entries(data.stats?.countryStats || {});
  const allClicks = data.stats?.allClicks || [];

  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📊 Статистика переходов</h1>
        <Link to="/" style={styles.homeLink}>🏠 На главную</Link>
      </div>

      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>🔗 Оригинальная ссылка:</span>
          <a href={data.url.originalUrl} target="_blank" rel="noopener noreferrer" style={styles.infoLink}>
            {data.url.originalUrl}
          </a>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>📎 Короткая ссылка:</span>
          <a href={data.url.shareUrl} target="_blank" rel="noopener noreferrer" style={styles.shortLink}>
            {data.url.shareUrl}
          </a>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>📅 Создана:</span>
          <span>{new Date(data.url.createdAt).toLocaleString('ru-RU')}</span>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statEmoji}>👆</div>
          <div style={styles.statNumber}>{totalClicks}</div>
          <div style={styles.statText}>Всего переходов</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statEmoji}>🖥️</div>
          <div style={styles.statNumber}>{browserData.length}</div>
          <div style={styles.statText}>Разных браузеров</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statEmoji}>💿</div>
          <div style={styles.statNumber}>{osData.length}</div>
          <div style={styles.statText}>Операционных систем</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statEmoji}>🌍</div>
          <div style={styles.statNumber}>{countryData.length}</div>
          <div style={styles.statText}>Стран</div>
        </div>
      </div>

      {browserData.length > 0 && (
        <div style={styles.section}>
          <h2>🌐 Браузеры</h2>
          {browserData.map(([name, count], index) => (
            <div key={name} style={styles.statRow}>
              <div style={styles.statLabel}>{name}</div>
              <div style={styles.progressWrapper}>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${(count / totalClicks) * 100}%`,
                      backgroundColor: colors[index % colors.length]
                    }}
                  />
                </div>
                <div style={styles.statCount}>{count} ({Math.round((count / totalClicks) * 100)}%)</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {osData.length > 0 && (
        <div style={styles.section}>
          <h2>💿 Операционные системы</h2>
          {osData.map(([name, count], index) => (
            <div key={name} style={styles.statRow}>
              <div style={styles.statLabel}>{name}</div>
              <div style={styles.progressWrapper}>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${(count / totalClicks) * 100}%`,
                      backgroundColor: colors[(index + 2) % colors.length]
                    }}
                  />
                </div>
                <div style={styles.statCount}>{count} ({Math.round((count / totalClicks) * 100)}%)</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {countryData.length > 0 && countryData[0][0] !== 'Unknown Region' && (
        <div style={styles.section}>
          <h2>🌍 География</h2>
          {countryData.map(([name, count], index) => (
            <div key={name} style={styles.statRow}>
              <div style={styles.statLabel}>📍 {name}</div>
              <div style={styles.progressWrapper}>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${(count / totalClicks) * 100}%`,
                      backgroundColor: colors[(index + 4) % colors.length]
                    }}
                  />
                </div>
                <div style={styles.statCount}>{count} ({Math.round((count / totalClicks) * 100)}%)</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {allClicks.length > 0 && (
        <div style={styles.section}>
          <h2>📋 Детальная информация</h2>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Дата и время</th>
                  <th>IP адрес</th>
                  <th>Регион</th>
                  <th>Браузер</th>
                  <th>Версия</th>
                  <th>ОС</th>
                </tr>
              </thead>
              <tbody>
                {allClicks.map((click) => (
                  <tr key={click.id}>
                    <td>{new Date(click.clicked_at).toLocaleString('ru-RU')}</td>
                    <td>{click.ip_address}</td>
                    <td>{click.region || '-'}</td>
                    <td>{click.browser}</td>
                    <td>{click.browser_version || '-'}</td>
                    <td>{click.os}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalClicks === 0 && (
        <div style={styles.emptyCard}>
          <p>😢 Пока нет переходов по этой ссылке</p>
          <p>Поделитесь ссылкой: <code style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>{data.url.shareUrl}</code></p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1000px',
    margin: '0 auto 30px',
  },
  homeLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '8px',
  },
  loadingCard: {
    maxWidth: '500px',
    margin: '100px auto',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '20px',
    textAlign: 'center' as const,
  },
  errorCard: {
    maxWidth: '500px',
    margin: '100px auto',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '20px',
    textAlign: 'center' as const,
  },
  backButton: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid #f0f0f0',
    borderTopColor: '#667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  infoCard: {
    maxWidth: '1000px',
    margin: '0 auto 30px',
    padding: '25px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
  },
  infoRow: {
    marginBottom: '12px',
    wordBreak: 'break-all' as const,
  },
  infoLabel: {
    fontWeight: 'bold' as const,
    marginRight: '10px',
    color: '#555',
  },
  infoLink: {
    color: '#667eea',
    textDecoration: 'none',
  },
  shortLink: {
    color: '#4CAF50',
    textDecoration: 'none',
    fontWeight: 'bold' as const,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto 30px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '25px',
    textAlign: 'center' as const,
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
  },
  statEmoji: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    color: '#667eea',
  },
  statText: {
    color: '#666',
    fontSize: '14px',
    marginTop: '5px',
  },
  section: {
    maxWidth: '1000px',
    margin: '0 auto 30px',
    padding: '25px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
  },
  statRow: {
    marginBottom: '15px',
  },
  statLabel: {
    fontWeight: 'bold' as const,
    marginBottom: '5px',
    fontSize: '14px',
  },
  progressWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  progressBar: {
    flex: 1,
    height: '30px',
    backgroundColor: '#f0f0f0',
    borderRadius: '15px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '15px',
    transition: 'width 0.5s ease',
  },
  statCount: {
    minWidth: '70px',
    fontSize: '14px',
    color: '#666',
  },
  tableWrapper: {
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '14px',
  },
  emptyCard: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '15px',
    textAlign: 'center' as const,
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default StatsPage;