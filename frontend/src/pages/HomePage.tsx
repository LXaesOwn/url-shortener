import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { shortenUrl } from '../api/client';
import { setLoading, setCurrentUrl, setError } from '../store/urlSlice';

const HomePage: React.FC = () => {
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();
  const { loading, currentUrl, error } = useSelector((state: RootState) => state.url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      dispatch(setError('Пожалуйста, введите URL'));
      return;
    }
    
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }
    
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      const result = await shortenUrl(finalUrl);
      dispatch(setCurrentUrl(result));
      setUrl('');
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Не удалось сократить URL. Проверьте подключение к бэкенду.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClear = () => {
    setUrl('');
    dispatch(setError(null));
  };

  const handleExample = () => {
    setUrl('https://www.google.com');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Ссылка скопирована!');
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1>🚀 Сокращатель URL-адресов</h1>
            <p className="subtitle">Сокращайте ссылки и отслеживайте их эффективность</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                className="url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Введите длинную ссылку (например: https://example.com)"
                disabled={loading}
              />
            </div>
            
            <div className="button-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Сокращение...' : '🔗 Сократить URL'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleClear} disabled={loading}>
                🧹 Очистить
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleExample} disabled={loading}>
                📝 Пример
              </button>
            </div>
          </form>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <div className="loading-text">Сокращаем ссылку...</div>
            </div>
          )}

          {error && !loading && (
            <div className="error-card">
              <strong>❌ Ошибка:</strong> {error}
              <div className="error-details">
                Убедитесь, что бэкенд запущен на http://localhost:5000
              </div>
            </div>
          )}

          {currentUrl && !loading && !error && (
            <div className="result-card">
              <h3>✅ Готово! Ваши ссылки:</h3>
              
              <div className="url-section">
                <strong>🔗 Короткая ссылка (для публикации):</strong>
                <div className="url-box">
                  <code>{currentUrl.shareUrl}</code>
                </div>
                <div className="button-row">
                  <button 
                    className="url-button url-button-copy"
                    onClick={() => copyToClipboard(currentUrl.shareUrl)}
                  >
                    📋 Скопировать
                  </button>
                  <button 
                    className="url-button url-button-open"
                    onClick={() => window.open(currentUrl.shareUrl, '_blank')}
                  >
                    🔗 Открыть
                  </button>
                </div>
              </div>

              <div className="url-section">
                <strong>📊 Ссылка для статистики:</strong>
                <div className="url-box">
                  <code>{currentUrl.statsUrl}</code>
                </div>
                <div className="button-row">
                  <button 
                    className="url-button url-button-copy"
                    onClick={() => copyToClipboard(currentUrl.statsUrl)}
                  >
                    📋 Скопировать
                  </button>
                  <button 
                    className="url-button url-button-stats"
                    onClick={() => window.open(currentUrl.statsUrl, '_blank')}
                  >
                    📈 Смотреть статистику
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="card-footer">
            <small>🔒 Безопасно • Быстро • Бесплатно</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
