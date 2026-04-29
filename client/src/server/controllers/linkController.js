const shortid = require('shortid');
const fs = require('fs');
const { getClientIp, parseUserAgent } = require('../utils/helpers');

const DB_FILE = 'db.json';
let db = { links: [], clicks: [] };

if (fs.existsSync(DB_FILE)) {
    db = JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

exports.createShortLink = (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortCode = shortid.generate();
    const shareUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/${shortCode}`;
    const statsUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/stats/${shortCode}`;

    db.links.push({ originalUrl, shortCode, shareUrl, statsUrl, createdAt: new Date() });
    saveDB();

    console.log(`Created: ${shortCode} -> ${originalUrl}`);
    res.json({ shareUrl, statsUrl, shortCode });
};

exports.redirectToOriginal = (req, res) => {
    const { shortCode } = req.params;
    const link = db.links.find(l => l.shortCode === shortCode);

    if (!link) {
        return res.status(404).send('Link not found');
    }

    const { browser, os } = parseUserAgent(req.headers['user-agent'] || '');
    
    const click = {
        shortCode,
        ip: getClientIp(req),
        browser,
        os,
        timestamp: new Date()
    };
    
    db.clicks.push(click);
    saveDB();
    
    console.log(`📊 Click #${db.clicks.filter(c => c.shortCode === shortCode).length} on ${shortCode} from ${click.ip} (${browser}/${os})`);
    
    res.redirect(link.originalUrl);
};

exports.getStatistics = (req, res) => {
    const { shortCode } = req.params;
    const link = db.links.find(l => l.shortCode === shortCode);
    
    if (!link) {
        return res.status(404).json({ error: 'Link not found' });
    }
    
    const clicks = db.clicks.filter(c => c.shortCode === shortCode);
    
    console.log(`Stats requested for ${shortCode}: ${clicks.length} clicks`);
    
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
        }))
    });
};

exports.getAllLinks = (req, res) => {
    const allLinks = db.links.map(link => ({
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        clicks: db.clicks.filter(c => c.shortCode === link.shortCode).length,
        createdAt: link.createdAt
    }));
    res.json(allLinks);
};
