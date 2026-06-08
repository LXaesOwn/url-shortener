import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { UrlForm } from '../components/UrlForm';
import { UrlResult } from '../components/UrlResult';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const { error, loading } = useSelector((state: RootState) => state.url);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>🚀 URL Shortener</h1>
          <p>Shorten your links and track their performance</p>
        </div>

        <UrlForm />
        
        {error && (
          <div className={styles.errorCard}>
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        <UrlResult />
        
        <div className={styles.footer}>
          <small>🔒 Secure • Fast • Free</small>
        </div>
      </div>
    </div>
  );
};

export default HomePage;