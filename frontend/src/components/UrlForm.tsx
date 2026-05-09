import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { shortenUrl } from '../api/client';
import { setLoading, setCurrentUrl, setError } from '../store/urlSlice';
import { CONSTANTS } from '../config/constants';

const UrlForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      dispatch(setError('Please enter a URL'));
      return;
    }
    
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      const result = await shortenUrl(url);
      dispatch(setCurrentUrl(result));
      setUrl('');
    } catch (error: any) {
      console.error('Error:', error);
      dispatch(setError(error.response?.data?.error || 'Failed to shorten URL'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClear = () => {
    setUrl('');
    dispatch(setError(null));
  };

  const handleExample = () => {
    setUrl('https://www.example.com');
  };

  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL here (e.g., https://example.com)"
            style={{ 
              flex: 1, 
              padding: '14px', 
              fontSize: '16px', 
              border: '2px solid #ddd', 
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            style={{ 
              flex: 1,
              padding: '12px 24px', 
              fontSize: '16px', 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            🔗 Shorten URL
          </button>
          <button 
            type="button"
            onClick={handleClear}
            style={{ 
              padding: '12px 24px', 
              fontSize: '16px', 
              backgroundColor: '#f44336', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#da190b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
          >
            🗑️ Clear
          </button>
          <button 
            type="button"
            onClick={handleExample}
            style={{ 
              padding: '12px 24px', 
              fontSize: '16px', 
              backgroundColor: '#2196F3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0b7dda'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
          >
            📝 Example
          </button>
        </div>
      </form>
    </div>
  );
};

export default UrlForm;