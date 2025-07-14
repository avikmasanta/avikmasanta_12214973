import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Link as LinkIcon } from '@mui/icons-material';
import axios from 'axios';
import { Log } from '../log';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const Statistics = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  Log('frontend', 'info', 'component', 'Statistics component loaded');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      Log('frontend', 'info', 'api', 'Fetching all short URLs');
      const response = await axios.get('/shorturls');
      setUrls(response.data);
      Log('frontend', 'info', 'api', `Fetched ${response.data.length} URLs`);
    } catch (error) {
      setError('Failed to fetch URLs');
      Log('frontend', 'error', 'api', `Failed to fetch URLs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedStats = async (shortcode) => {
    try {
      Log('frontend', 'info', 'api', `Fetching detailed stats for shortcode: ${shortcode}`);
      const response = await axios.get(`/shorturls/${shortcode}`);
      return response.data;
    } catch (error) {
      Log('frontend', 'error', 'api', `Failed to fetch stats for ${shortcode}: ${error.message}`);
      return null;
    }
  };

  const isExpired = (expiry) => {
    return new Date(expiry) < new Date();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Statistic
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        View analytics for all shortened URLs created in the system.
      </Typography>

      {urls.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No shortened URLs found. Create some URLs first! 
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {urls.map((url) => (
            <Grid item xs={12} key={url.shortcode}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <LinkIcon color="primary" />
                    <Typography variant="h6" component="div">
                      {url.shortLink}
                    </Typography>
                    {isExpired(url.expiry) && (
                      <Chip label="Expired" color="error" size="small" />
                    )}
                  </Box>

                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Original URL:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                        {url.originalUrl}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Shortcode:</strong> {url.shortcode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Created:</strong> {formatDate(url.createdAt)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Expires:</strong> {formatDate(url.expiry)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Total Clicks:</strong> {url.totalClicks}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>View Click Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ClickDetails shortcode={url.shortcode} />
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

const ClickDetails = ({ shortcode }) => {
  const [clickData, setClickData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchClickDetails = async () => {
    if (clickData) return; 
    
    setLoading(true);
    try {
      const response = await axios.get(`/shorturls/${shortcode}`);
      setClickData(response.data);
      Log('frontend', 'info', 'api', `Loaded click details for ${shortcode}`);
    } catch (error) {
      Log('frontend', 'error', 'api', `Failed to load click details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress size={20} />;
  }

  if (!clickData) {
    return (
      <Button variant="outlined" onClick={fetchClickDetails}>
        Load Click Details
      </Button>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Referrer</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clickData.clicks && clickData.clicks.length > 0 ? (
            clickData.clicks.map((click, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(click.timestamp)}</TableCell>
                <TableCell>{click.referrer}</TableCell>
                <TableCell>{click.location}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No clicks recorded yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Statistics; 