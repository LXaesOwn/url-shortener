import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <nav className="navbar">
            <div className="navbar-container">
              <Link to="/" className="navbar-logo">
                🚀 URL Shortener
              </Link>
              <Link to="/" className="navbar-link">
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
