import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  IconButton,
  Paper
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ContentCopy as CopyIcon } from '@mui/icons-material';
import axios from 'axios';
import { Log } from '../log';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const UrlShortener = () => {
  const [urls, setUrls] = useState([{ url: '', validity: 30, shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  Log('frontend', 'info', 'component', 'URL Shortener component loaded');

  const addUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: '', validity: 30, shortcode: '' }]);
      Log('frontend', 'info', 'component', 'Added new URL input field');
    }
  };

  const removeUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
    Log('frontend', 'info', 'component', 'Removed URL input field');
  };

  const updateUrl = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Log('frontend', 'info', 'component', 'Copied short URL to clipboard');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    Log('frontend', 'info', 'component', 'Starting URL shortening process');

    const validUrls = urls.filter(u => u.url.trim());
    if (validUrls.length === 0) {
      setError('Please enter at least one URL');
      setLoading(false);
      return;
    }

    const newResults = [];

    for (let i = 0; i < validUrls.length; i++) {
      const urlData = validUrls[i];
      
      if (!validateUrl(urlData.url)) {
        newResults.push({
          originalUrl: urlData.url,
          error: 'Invalid URL format'
        });
        continue;
      }

      try {
        const payload = {
          url: urlData.url,
          validity: parseInt(urlData.validity) || 30
        };

        if (urlData.shortcode.trim()) {
          payload.shortcode = urlData.shortcode.trim();
        }

        const response = await axios.post('/shorturls', payload);
        newResults.push({
          originalUrl: urlData.url,
          shortLink: response.data.shortLink,
          expiry: response.data.expiry
        });

        Log('frontend', 'info', 'api', `Successfully shortened URL: ${urlData.url}`);
      } catch (error) {
        newResults.push({
          originalUrl: urlData.url,
          error: error.response?.data?.error || 'Failed to shorten URL'
        });
        Log('frontend', 'error', 'api', `Failed to shorten URL: ${error.message}`);
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Shorten up to 5 URLs at once
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {urls.map((urlData, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Original URL"
                    value={urlData.url}
                    onChange={(e) => updateUrl(index, 'url', e.target.value)}
                    placeholder="https://example.com/very-long-url"
                    error={urlData.url && !validateUrl(urlData.url)}
                    helperText={urlData.url && !validateUrl(urlData.url) ? 'Invalid URL format' : ''}
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    type="number"
                    value={urlData.validity}
                    onChange={(e) => updateUrl(index, 'validity', e.target.value)}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    label="Custom Shortcode (optional)"
                    value={urlData.shortcode}
                    onChange={(e) => updateUrl(index, 'shortcode', e.target.value)}
                    placeholder="abc123"
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeUrl(index)}
                    disabled={urls.length === 1}
                    startIcon={<DeleteIcon />}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            size="large"
          >
            {loading ? 'Shortening...' : 'Shorten URLs'}
          </Button>
          {urls.length < 5 && (
            <Button
              variant="outlined"
              onClick={addUrl}
              startIcon={<AddIcon />}
            >
              Add Another URL
            </Button>
          )}
        </Box>
      </Paper>

      {results.length > 0 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          {results.map((result, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Original: {result.originalUrl}
                </Typography>
                {result.error ? (
                  <Alert severity="error">{result.error}</Alert>
                ) : (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" color="primary">
                        {result.shortLink}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(result.shortLink)}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Expires: {new Date(result.expiry).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default UrlShortener; 