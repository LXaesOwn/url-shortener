const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'urlshortener.db');
const db = new sqlite3.Database(DB_FILE);

db.all(`
    SELECT 
        clicks.*,
        links.original_url
    FROM clicks 
    JOIN links ON clicks.short_code = links.short_code
    ORDER BY clicks.created_at DESC
`, (err, clicks) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>URL Shortener Statistics</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        th { background: #667eea; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:hover { background: #f5f5f5; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; }
        .badge-browser { background: #e3f2fd; color: #1976d2; }
        .badge-os { background: #f3e5f5; color: #7b1fa2; }
    </style>
</head>
<body>
    <h1>📊 Статистика переходов</h1>
    <p>Всего переходов: ${clicks.length}</p>
    <table>
        <thead>
            <tr>
                <th>Дата и время</th>
                <th>Короткая ссылка</th>
                <th>Страна</th>
                <th>Браузер</th>
                <th>ОС</th>
                <th>IP</th>
            </tr>
        </thead>
        <tbody>
            ${clicks.map(click => `
            <tr>
                <td>${new Date(click.created_at).toLocaleString()}</td>
                <td><code>${click.short_code}</code></td>
                <td>${click.country || 'Unknown'}</td>
                <td><span class="badge badge-browser">${click.browser || 'Unknown'}</span></td>
                <td><span class="badge badge-os">${click.os || 'Unknown'}</span></td>
                <td><code>${click.ip}</code></td>
            </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>
    `;
    
    fs.writeFileSync('statistics.html', html);
    console.log('✅ Statistics exported to statistics.html');
    console.log('📁 Open file: ' + path.join(__dirname, 'statistics.html'));
});

db.close();