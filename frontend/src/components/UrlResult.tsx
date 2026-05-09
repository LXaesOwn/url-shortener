import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { CONSTANTS } from '../config/constants';

const UrlResult: React.FC = () => {
  const { currentUrl, loading, error } = useSelector((state: RootState) => state.url);
  const [copyMessage, setCopyMessage] = useState('');

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${type} copied!`);
      setTimeout(() => setCopyMessage(''), 2000);
    } catch (err) {
      setCopyMessage(`Failed to copy ${type}`);
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>⏳ Shortening your URL...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#ffebee', 
        color: '#c62828', 
        borderRadius: '8px', 
        textAlign: 'center' 
      }}>
        <strong>❌ Error:</strong> {error}
      </div>
    );
  }

  if (!currentUrl) return null;

  return (
    <div style={{ marginTop: '30px' }}>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e8f5e9', 
        borderRadius: '8px',
        border: '1px solid #4CAF50'
      }}>
        <h3 style={{ marginTop: 0, color: '#2e7d32' }}>✅ URL Shortened Successfully!</h3>
        
        {/* Share URL */}
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
          <strong style={{ fontSize: '16px', display: 'block', marginBottom: '10px' }}>🔗 Share URL:</strong>
          <code style={{ 
            display: 'block', 
            padding: '12px', 
            backgroundColor: '#f5f5f5', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            wordBreak: 'break-all',
            marginBottom: '10px'
          }}>
            {currentUrl.shareUrl}
          </code>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => copyToClipboard(currentUrl.shareUrl, 'Share URL')}
              style={{ 
                flex: 1,
                padding: '10px', 
                backgroundColor: '#2196F3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📋 Copy Share URL
            </button>
            <button 
              onClick={() => openInNewTab(currentUrl.shareUrl)}
              style={{ 
                flex: 1,
                padding: '10px', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔗 Open Link
            </button>
          </div>
        </div>
        
        {/* Statistics URL */}
        <div style={{ marginBottom: '10px', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
          <strong style={{ fontSize: '16px', display: 'block', marginBottom: '10px' }}>📊 Statistics URL:</strong>
          <code style={{ 
            display: 'block', 
            padding: '12px', 
            backgroundColor: '#f5f5f5', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            wordBreak: 'break-all',
            marginBottom: '10px'
          }}>
            {currentUrl.statsUrl}
          </code>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => copyToClipboard(currentUrl.statsUrl, 'Statistics URL')}
              style={{ 
                flex: 1,
                padding: '10px', 
                backgroundColor: '#2196F3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📋 Copy Stats URL
            </button>
            <button 
              onClick={() => openInNewTab(currentUrl.statsUrl)}
              style={{ 
                flex: 1,
                padding: '10px', 
                backgroundColor: '#ff9800', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📈 View Statistics
            </button>
          </div>
        </div>
      </div>
      
      {copyMessage && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          borderRadius: '4px', 
          textAlign: 'center',
          animation: 'fadeOut 2s'
        }}>
          ✓ {copyMessage}
        </div>
      )}
    </div>
  );
};

export default UrlResult;