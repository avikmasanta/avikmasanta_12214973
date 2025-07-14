const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const { Log } = require('../logging-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a database)
const urlDatabase = new Map();
const clickDatabase = new Map();

// Generate unique shortcode
function generateShortcode() {
  return nanoid(6);
}

// Validate URL format
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Create Short URL endpoint
app.post('/shorturls', (req, res) => {
  Log('backend', 'info', 'handler', 'Received request to create short URL');
  
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !isValidUrl(url)) {
    Log('backend', 'error', 'handler', 'Invalid URL provided');
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  if (validity && (typeof validity !== 'number' || validity <= 0)) {
    Log('backend', 'error', 'handler', 'Invalid validity period');
    return res.status(400).json({ error: 'Validity must be a positive number' });
  }

  let finalShortcode = shortcode;
  if (shortcode) {
    if (urlDatabase.has(shortcode)) {
      Log('backend', 'warn', 'handler', 'Shortcode collision detected');
      return res.status(409).json({ error: 'Shortcode already exists' });
    }
  } else {
    finalShortcode = generateShortcode();
  }

  const expiry = new Date(Date.now() + validity * 60 * 1000);
  const shortUrl = `http://localhost:${PORT}/${finalShortcode}`;

  urlDatabase.set(finalShortcode, {
    originalUrl: url,
    shortcode: finalShortcode,
    createdAt: new Date(),
    expiry: expiry,
    clicks: 0
  });

  clickDatabase.set(finalShortcode, []);

  Log('backend', 'info', 'handler', `Short URL created: ${shortUrl}`);
  
  res.status(201).json({
    shortLink: shortUrl,
    expiry: expiry.toISOString()
  });
});

// Redirect endpoint
app.get('/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  
  Log('backend', 'info', 'handler', `Redirect request for shortcode: ${shortcode}`);

  const urlData = urlDatabase.get(shortcode);
  if (!urlData) {
    Log('backend', 'error', 'handler', `Shortcode not found: ${shortcode}`);
    return res.status(404).json({ error: 'Short URL not found' });
  }

  if (new Date() > urlData.expiry) {
    Log('backend', 'warn', 'handler', `Expired shortcode accessed: ${shortcode}`);
    return res.status(410).json({ error: 'Short URL has expired' });
  }

  // Record click
  urlData.clicks++;
  const clickData = {
    timestamp: new Date(),
    referrer: req.get('Referrer') || 'direct',
    location: req.get('X-Forwarded-For') || req.ip || 'unknown'
  };
  
  clickDatabase.get(shortcode).push(clickData);
  
  Log('backend', 'info', 'handler', `Redirecting to: ${urlData.originalUrl}`);
  res.redirect(urlData.originalUrl);
});

// Get statistics endpoint
app.get('/shorturls/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  
  Log('backend', 'info', 'handler', `Statistics request for shortcode: ${shortcode}`);

  const urlData = urlDatabase.get(shortcode);
  if (!urlData) {
    Log('backend', 'error', 'handler', `Statistics requested for non-existent shortcode: ${shortcode}`);
    return res.status(404).json({ error: 'Short URL not found' });
  }

  const clicks = clickDatabase.get(shortcode) || [];
  
  Log('backend', 'info', 'handler', `Returning statistics for shortcode: ${shortcode}`);
  
  res.json({
    shortcode: shortcode,
    originalUrl: urlData.originalUrl,
    createdAt: urlData.createdAt,
    expiry: urlData.expiry,
    totalClicks: urlData.clicks,
    clicks: clicks
  });
});

// Get all URLs endpoint for frontend
app.get('/shorturls', (req, res) => {
  Log('backend', 'info', 'handler', 'Request for all short URLs');
  
  const allUrls = Array.from(urlDatabase.entries()).map(([shortcode, data]) => ({
    shortcode,
    originalUrl: data.originalUrl,
    shortLink: `http://localhost:${PORT}/${shortcode}`,
    createdAt: data.createdAt,
    expiry: data.expiry,
    totalClicks: data.clicks
  }));

  res.json(allUrls);
});

app.listen(PORT, () => {
  Log('backend', 'info', 'config', `Server running on port ${PORT}`);
  console.log(`URL Shortener service running on port ${PORT}`);
}); 