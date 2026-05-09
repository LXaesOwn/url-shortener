import React from 'react';
import { IClickData } from '../types';

interface StatsTableProps {
  clicks: IClickData[];
}

const StatsTable: React.FC<StatsTableProps> = ({ clicks }) => {
  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Click Statistics</h3>
      {clicks.length === 0 ? (
        <p>No clicks yet</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '15px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>IP Address</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Region</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Browser</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Version</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>OS</th>
              </tr>
            </thead>
            <tbody>
              {clicks.map((click) => (
                <tr key={click.id}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{new Date(click.clicked_at).toLocaleString()}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{click.ip_address}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{click.region}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{click.browser}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{click.browser_version}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{click.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StatsTable;