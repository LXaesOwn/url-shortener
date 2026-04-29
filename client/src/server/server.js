const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

let db = { links: [], clicks: [] };

if (fs.existsSync(DB_FILE)) {
    try {
        db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        console.log('✅ Database loaded');
    } catch(e) {
        console.log('⚠️ Creating new database');
    }
}

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Функция для определения браузера и ОС
function parseUserAgent(userAgent) {
    let browser = 'Other';
    let os = 'Other';
    
    if (!userAgent) return { browser, os };
    
    // Определяем браузер
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    // Определяем ОС
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';
    
    return { browser, os };
}

// Создание короткой ссылки
app.post('/shorten', (req, res) => {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortCode = shortid.generate();
    const shareUrl = `http://localhost:5000/${shortCode}`;
    const statsUrl = `http://localhost:5000/stats/${shortCode}`;

    db.links.push({ 
        originalUrl, 
        shortCode, 
        shareUrl, 
        statsUrl, 
        createdAt: new Date().toISOString() 
    });
    saveDB();

    console.log(`✅ Created: ${shortCode} -> ${originalUrl}`);
    res.json({ shareUrl, statsUrl, shortCode });
});

// Редирект и трекинг
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    const link = db.links.find(l => l.shortCode === shortCode);

    if (!link) {
        return res.status(404).send('Link not found');
    }

    const userAgent = req.headers['user-agent'] || '';
    const { browser, os } = parseUserAgent(userAgent);
    
    const click = {
        shortCode,
        ip: req.ip || req.connection.remoteAddress || '127.0.0.1',
        browser,
        os,
        timestamp: new Date().toISOString()
    };
    
    db.clicks.push(click);
    saveDB();

    const totalClicks = db.clicks.filter(c => c.shortCode === shortCode).length;
    console.log(`📊 Click #${totalClicks} on ${shortCode} | ${browser} on ${os} | ${click.ip}`);
    
    res.redirect(link.originalUrl);
});

// Получение статистики
app.get('/stats/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    const link = db.links.find(l => l.shortCode === shortCode);
    
    if (!link) {
        return res.status(404).json({ error: 'Link not found' });
    }
    
    const clicks = db.clicks.filter(c => c.shortCode === shortCode);
    
    // Агрегируем статистику по браузерам и ОС
    const browserStats = {};
    const osStats = {};
    
    clicks.forEach(click => {
        browserStats[click.browser] = (browserStats[click.browser] || 0) + 1;
        osStats[click.os] = (osStats[click.os] || 0) + 1;
    });
    
    console.log(`📊 Stats for ${shortCode}: ${clicks.length} clicks`);
    
    res.json({
        originalUrl: link.originalUrl,
        shareUrl: link.shareUrl,
        statsUrl: link.statsUrl,
        totalClicks: clicks.length,
        clicks: clicks.map(c => ({
            date: c.timestamp,
            ip: c.ip,
            browser: c.browser,
            os: c.os
        })),
        browserStats,
        osStats
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Database: ${DB_FILE}\n`);
});