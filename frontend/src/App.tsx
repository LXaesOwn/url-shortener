import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <nav style={{ 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            padding: '15px 0',
            position: 'sticky',
            top: 0,
            zIndex: 1000
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
                🚀 URL Shortener
              </Link>
              <Link to="/" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)' }}>
                🏠 Главная
              </Link>
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