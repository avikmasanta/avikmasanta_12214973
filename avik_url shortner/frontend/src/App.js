import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import UrlShortener from './components/UrlShortener';
import Statistics from './components/Statistics';
import { Log } from './log';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00897b', 
    },
    secondary: {
      main: '#cddc39', 
    },
    background: {
      default: '#f5f5f5', 
    },
  },
});

function App() {
  Log('frontend', 'info', 'page', 'Application started');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                letterSpacing: 2,
                color: theme.palette.secondary.main,
              }}
            >
              URL Shortener
            </Typography>
            <Button
              color="secondary"
              component={Link}
              to="/"
              sx={{
                mx: 1,
                fontWeight: 'bold',
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: '#b2dfdb',
                },
              }}
            >
              Shorten URLs
            </Button>
            <Button
              color="secondary"
              component={Link}
              to="/statistics"
              sx={{
                mx: 1,
                fontWeight: 'bold',
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: '#b2dfdb',
                },
              }}
            >
              Statistics
            </Button>
          </Toolbar>
        </AppBar>
        <Container
          maxWidth="lg"
          sx={{
            mt: 8,
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
            boxShadow: 2,
            py: 4,
          }}
        >
          <Routes>
            <Route path="/" element={<UrlShortener />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;