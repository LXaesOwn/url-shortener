const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const JSON_DB = path.join(__dirname, 'db.json');
const SQLITE_DB = path.join(__dirname, 'urlshortener.db');

if (!fs.existsSync(JSON_DB)) {
    console.log('No JSON database found. Starting fresh.');
    process.exit(0);
}

const jsonData = JSON.parse(fs.readFileSync(JSON_DB, 'utf8'));
const db = new sqlite3.Database(SQLITE_DB);

db.serialize(() => {
    
    db.run(`CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_code TEXT UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        share_url TEXT NOT NULL,
        stats_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_code TEXT NOT NULL,
        ip TEXT,
        browser TEXT,
        os TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    
    const linkStmt = db.prepare(`
        INSERT OR REPLACE INTO links (short_code, original_url, share_url, stats_url, created_at)
        VALUES (?, ?, ?, ?, ?)
    `);

    jsonData.links.forEach(link => {
        linkStmt.run(link.shortCode, link.originalUrl, link.shareUrl, link.statsUrl, link.createdAt);
    });
    linkStmt.finalize();

    
    const clickStmt = db.prepare(`
        INSERT INTO clicks (short_code, ip, browser, os, created_at)
        VALUES (?, ?, ?, ?, ?)
    `);

    jsonData.clicks.forEach(click => {
        clickStmt.run(click.shortCode, click.ip, click.browser || 'Unknown', click.os || 'Unknown', click.timestamp);
    });
    clickStmt.finalize();

    console.log(`✅ Migrated ${jsonData.links.length} links and ${jsonData.clicks.length} clicks`);
    console.log(`📁 SQLite database created: ${SQLITE_DB}`);
});

db.close();