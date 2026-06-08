import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <nav className={styles.navbar}>
            <div className={styles.navContainer}>
              <Link to="/" className={styles.logo}>🚀 URL Shortener</Link>
              <Link to="/" className={styles.navLink}>Home</Link>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats/:shortCode" element={<StatsPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;