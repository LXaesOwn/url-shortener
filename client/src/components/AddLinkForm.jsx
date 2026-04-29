import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shortenLink } from '../store/linkSlice';
import '../styles/App.css';

export default function AddLinkForm() {
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();
  const { currentLink, loading } = useSelector((state) => state.links);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      dispatch(shortenLink(url));
      setUrl('');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          className="form-input"
          placeholder="Enter your long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button 
          type="submit" 
          className="form-button"
          disabled={loading}
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {currentLink && (
        <div className="result-container">
          <p><strong>Share URL:</strong> <a href={currentLink.shareUrl} target="_blank" rel="noreferrer">{currentLink.shareUrl}</a></p>
          <p><strong>Stats URL:</strong> <a href={currentLink.statsUrl} target="_blank" rel="noreferrer">{currentLink.statsUrl}</a></p>
        </div>
      )}
    </div>
  );
}