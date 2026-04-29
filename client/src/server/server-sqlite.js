const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'urlshortener.db');

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            short_code TEXT UNIQUE NOT NULL,
            original_url TEXT NOT NULL,
            share_url TEXT NOT NULL,
            stats_url TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS clicks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            short_code TEXT NOT NULL,
            ip TEXT,
            country TEXT,
            city TEXT,
            browser TEXT,
            os TEXT,
            user_agent TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`CREATE INDEX IF NOT EXISTS idx_clicks_short_code ON clicks(short_code)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_links_short_code ON links(short_code)`);
    
    console.log('✅ SQLite database initialized');
});
async function getCountryFromIp(ip) {
    
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost' || ip === '::ffff:127.0.0.1') {
        return { country: 'Localhost', city: 'Local' };
    }
    
    try {
        
        const response = await axios.get(`http://ip-api.com/json/${ip}`, {
            timeout: 3000
        });
        
        if (response.data && response.data.status === 'success') {
            return {
                country: response.data.country,
                city: response.data.city
            };
        }
        return { country: 'Unknown', city: 'Unknown' };
    } catch (error) {
        console.log(`GeoIP API error for ${ip}:`, error.message);
        return { country: 'Unknown', city: 'Unknown' };
    }
}


function parseUserAgent(userAgent) {
    let browser = 'Other';
    let os = 'Other';
    
    if (!userAgent) return { browser, os };
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';
    
    return { browser, os };
}

app.post('/shorten', (req, res) => {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortCode = shortid.generate();
    const shareUrl = `http://localhost:5000/${shortCode}`;
    const statsUrl = `http://localhost:5000/stats/${shortCode}`;

    db.run(
        'INSERT INTO links (short_code, original_url, share_url, stats_url) VALUES (?, ?, ?, ?)',
        [shortCode, originalUrl, shareUrl, statsUrl],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            console.log(`✅ Created: ${shortCode} -> ${originalUrl}`);
            res.json({ shareUrl, statsUrl, shortCode });
        }
    );
});


app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;
    
    db.get('SELECT * FROM links WHERE short_code = ?', [shortCode], async (err, link) => {
        if (err || !link) {
            return res.status(404).send('Link not found');
        }
        
        const userAgent = req.headers['user-agent'] || '';
        const { browser, os } = parseUserAgent(userAgent);
        let ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
        
        
        ip = ip.replace('::ffff:', '');
        
        
        const { country, city } = await getCountryFromIp(ip);
        
        db.run(
            'INSERT INTO clicks (short_code, ip, country, city, browser, os, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [shortCode, ip, country, city, browser, os, userAgent],
            (err) => {
                if (err) console.error('Click tracking error:', err);
                
                db.get('SELECT COUNT(*) as count FROM clicks WHERE short_code = ?', [shortCode], (err, result) => {
                    const clickCount = result ? result.count : 0;
                    console.log(`📊 Click #${clickCount} on ${shortCode} | ${browser} on ${os} | ${country} | ${ip}`);
                });
            }
        );
        
        res.redirect(link.original_url);
    });
});


app.get('/stats/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    
    db.get('SELECT * FROM links WHERE short_code = ?', [shortCode], (err, link) => {
        if (err || !link) {
            return res.status(404).json({ error: 'Link not found' });
        }
        
        db.all('SELECT * FROM clicks WHERE short_code = ? ORDER BY created_at DESC', [shortCode], (err, clicks) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            
           
            const browserStats = {};
            const osStats = {};
            const countryStats = {};
            
            clicks.forEach(click => {
                browserStats[click.browser] = (browserStats[click.browser] || 0) + 1;
                osStats[click.os] = (osStats[click.os] || 0) + 1;
                const countryName = click.country === 'Localhost' ? '🏠 Localhost' : (click.country || 'Unknown');
                countryStats[countryName] = (countryStats[countryName] || 0) + 1;
            });
            
            console.log(`📊 Stats for ${shortCode}: ${clicks.length} clicks`);
            
            res.json({
                originalUrl: link.original_url,
                shareUrl: link.share_url,
                statsUrl: link.stats_url,
                totalClicks: clicks.length,
                clicks: clicks.map(c => ({
                    date: c.created_at,
                    ip: c.ip,
                    country: c.country === 'Localhost' ? '🏠 Локальный' : (c.country || 'Unknown'),
                    city: c.city,
                    browser: c.browser,
                    os: c.os
                })),
                browserStats,
                osStats,
                countryStats
            });
        });
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n=================================`);
    console.log(`🚀 SERVER RUNNING WITH SQLITE`);
    console.log(`=================================`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📁 Database: ${DB_FILE} (SQLite)`);
    console.log(`🌍 GeoIP: Online API (ip-api.com)`);
    console.log(`=================================\n`);
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log('Database connection closed');
        process.exit(0);
    });
});