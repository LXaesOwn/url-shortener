const express = require('express');
const Click = require('../models/Click');
const Link = require('../models/Link');
const { getRegionByIp } = require('../utils/geoIp');
const UAParser = require('ua-parser-js');

const router = express.Router();

router.post('/track', async (req, res) => {
  const { shortCode, userAgent, ip } = req.body;

  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOs();

  const region = await getRegionByIp(ip);

  const click = new Click({
    shortCode,
    ip,
    region,
    browser: browser.name || 'Unknown',
    browserVersion: browser.version || 'Unknown',
    os: os.name || 'Unknown'
  });

  await click.save();

  res.status(200).json({ success: true });
});

router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  const link = await Link.findOne({ shortCode });
  if (!link) {
    return res.status(404).json({ error: 'Link not found' });
  }

  const clicks = await Click.find({ shortCode }).sort({ timestamp: -1 });

  res.json({
    originalUrl: link.originalUrl,
    shareUrl: link.shareUrl,
    statsUrl: link.statsUrl,
    totalClicks: clicks.length,
    clicks: clicks.map(c => ({
      date: c.timestamp,
      ip: c.ip,
      region: c.region,
      browser: `${c.browser} ${c.browserVersion}`,
      os: c.os
    }))
  });
});

module.exports = router;
