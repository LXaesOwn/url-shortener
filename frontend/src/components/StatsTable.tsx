import React from 'react';
import { IClickData } from '../types';
import styles from './StatsTable.module.css';

interface StatsTableProps {
  clicks: IClickData[];
}

export const StatsTable: React.FC<StatsTableProps> = ({ clicks }) => {
  if (clicks.length === 0) {
    return <div className={styles.empty}>No clicks yet</div>;
  }

  return (
    <div className={styles.container}>
      <h3>Click Statistics</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>IP Address</th>
              <th>Region</th>
              <th>Browser</th>
              <th>Version</th>
              <th>OS</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map((click) => (
              <tr key={click.id}>
                <td>{new Date(click.clicked_at).toLocaleString()}</td>
                <td>{click.ip_address}</td>
                <td>{click.region}</td>
                <td>{click.browser}</td>
                <td>{click.browser_version}</td>
                <td>{click.os}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};