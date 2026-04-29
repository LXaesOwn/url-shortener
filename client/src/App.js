import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AddLinkForm from './components/AddLinkForm';
import StatsTable from './components/StatsTable';
import './styles/App.css';

function AppContent() {
  const [statsCode, setStatsCode] = useState('');

  return (
    <div className="app">
      <header className="header">
        <h1>🔗 URL Shortener Service</h1>
        <p>Сокращайте ссылки и отслеживайте статистику переходов</p>
      </header>

      <section className="section">
        <h2>✨ Создать короткую ссылку</h2>
        <AddLinkForm />
      </section>

      <section className="section">
        <h2>📈 Статистика переходов</h2>
        <input
          type="text"
          className="stats-code-input"
          placeholder="Введите код короткой ссылки (например, abc123)"
          value={statsCode}
          onChange={(e) => setStatsCode(e.target.value)}
        />
        {statsCode && <StatsTable shortCode={statsCode} />}
      </section>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;