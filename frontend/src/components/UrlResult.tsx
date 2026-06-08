import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { Button } from './ui/Button';
import { CONSTANTS } from '../config/constants';
import styles from './UrlResult.module.css';

export const UrlResult: React.FC = () => {
  const { currentUrl, loading, error } = useSelector((state: RootState) => state.url);
  const { copy, copied } = useCopyToClipboard(CONSTANTS.COPY_TIMEOUT_MS || 2000);

  const getShortCode = (url: string) => {
    const match = url.match(/\/s\/([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
  };

  const handleOpenLink = () => {
    if (currentUrl) {
      window.open(currentUrl.shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleViewStats = () => {
    if (currentUrl) {
      const shortCode = getShortCode(currentUrl.shareUrl);
      window.open(`/stats/${shortCode}`, '_blank');
    }
  };

  if (loading) {
    return <div className={styles.loading}>⏳ Shortening your URL...</div>;
  }

  if (error) {
    return <div className={styles.error}>❌ Error: {error}</div>;
  }

  if (!currentUrl) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>✅ URL Shortened Successfully!</h3>
      
      <div className={styles.card}>
        <strong>🔗 Share URL:</strong>
        <code className={styles.code}>{currentUrl.shareUrl}</code>
        <div className={styles.buttonRow}>
          <Button onClick={() => copy(currentUrl.shareUrl)}>
            {copied ? '✓ Copied!' : '📋 Copy Share URL'}
          </Button>
          <Button variant="secondary" onClick={handleOpenLink}>
            🔗 Open Link
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <strong>📊 Statistics URL:</strong>
        <code className={styles.code}>{currentUrl.statsUrl}</code>
        <div className={styles.buttonRow}>
          <Button onClick={() => copy(currentUrl.statsUrl)}>
            {copied ? '✓ Copied!' : '📋 Copy Stats URL'}
          </Button>
          <Button variant="secondary" onClick={handleViewStats}>
            📈 View Statistics
          </Button>
        </div>
      </div>
    </div>
  );
};