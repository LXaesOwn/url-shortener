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
      dispatch(setError(err.response?.data?.error || 'Не удалось сократить URL'));
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} скопирована!`);
  };

  
  const getShortCodeFromUrl = (url: string) => {
    const match = url.match(/\/s\/([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
  };


  const openStats = () => {
    if (currentUrl) {
      const shortCode = getShortCodeFromUrl(currentUrl.shareUrl);
      if (shortCode) {
        window.open(`/stats/${shortCode}`, '_blank');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px' }}>🚀 Сокращатель URL-адресов</h1>
            <p style={{ color: '#666' }}>Сокращайте ссылки и отслеживайте их эффективность</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                style={{ width: '100%', padding: '15px', fontSize: '16px', border: '2px solid #e0e0e0', borderRadius: '10px' }}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Введите длинную ссылку (например: https://example.com)"
                disabled={loading}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }} disabled={loading}>
                {loading ? 'Сокращение...' : '🔗 Сократить URL'}
              </button>
              <button type="button" style={{ flex: 1, padding: '12px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', background: '#f0f0f0', color: '#333' }} onClick={handleClear} disabled={loading}>
                🧹 Очистить
              </button>
              <button type="button" style={{ flex: 1, padding: '12px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', background: '#f0f0f0', color: '#333' }} onClick={handleExample} disabled={loading}>
                📝 Пример
              </button>
            </div>
          </form>

          {loading && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <div className="spinner"></div>
              <p>Сокращаем ссылку...</p>
            </div>
          )}

          {error && !loading && (
            <div style={{ marginTop: '30px', padding: '15px', background: '#fff5f5', borderRadius: '10px', borderLeft: '4px solid #dc3545', color: '#dc3545' }}>
              <strong>❌ Ошибка:</strong> {error}
            </div>
          )}

          {currentUrl && !loading && !error && (
            <div style={{ marginTop: '30px', padding: '20px', background: '#f0fdf4', borderRadius: '10px', borderLeft: '4px solid #22c55e' }}>
              <h3 style={{ marginBottom: '15px', color: '#16a34a' }}>✅ Готово! Ваши ссылки:</h3>
              
              {/* Короткая ссылка */}
              <div style={{ marginBottom: '20px', padding: '15px', background: 'white', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🔗 Короткая ссылка:</div>
                <code style={{ display: 'block', background: '#f3f4f6', padding: '10px', borderRadius: '6px', wordBreak: 'break-all', marginBottom: '10px' }}>
                  {currentUrl.shareUrl}
                </code>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => copyToClipboard(currentUrl.shareUrl, 'Короткая ссылка')} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    📋 Скопировать
                  </button>
                  <button onClick={() => window.open(currentUrl.shareUrl, '_blank')} style={{ padding: '8px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    🔗 Открыть ссылку
                  </button>
                </div>
              </div>

              {/* Ссылка для статистики */}
              <div style={{ padding: '15px', background: 'white', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>📊 Ссылка для статистики:</div>
                <code style={{ display: 'block', background: '#f3f4f6', padding: '10px', borderRadius: '6px', wordBreak: 'break-all', marginBottom: '10px' }}>
                  {currentUrl.statsUrl}
                </code>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => copyToClipboard(currentUrl.statsUrl, 'Ссылка статистики')} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    📋 Скопировать
                  </button>
                  <button onClick={openStats} style={{ padding: '8px 16px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    📊 Смотреть статистику
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
