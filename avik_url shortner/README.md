#  URL Shortener

Avik URL Shortener is a simple and efficient tool for converting long URLs into short, easy-to-share links. This application helps users manage and track their shortened URLs with a user-friendly interface and robust backend support.

## Features

- Shorten any long URL quickly
- Track usage statistics for each shortened link
- Easy-to-use web interface
- Secure and reliable

## Getting Started

Follow the instructions below to set up and run the project on your local machine.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

   The server runs on [http://localhost:5000](http://localhost:5000).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the frontend application:
   ```bash
   npm start
   ```

   The application runs on [http://localhost:3000](http://localhost:3000).

### Logging Middleware

1. Navigate to the logging-middleware directory:
   ```bash
   cd logging-middleware
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the backend server.
2. Start the frontend application.
3. Navigate to [http://localhost:3000](http://localhost:3000).
4. Use the URL shortener form to create shortened URLs.
5. View statistics on the Statistics page.
6. Click on shortened URLs to test redirection.

## Technical Details

- **Backend Framework**: Express.js
- **Frontend Framework**: React with Material-UI
- **Database**: In-memory storage (Map objects)
- **URL Generation**: nanoid for unique shortcodes
- **Logging**: Custom middleware with test server integration
- **Validation**: Client and server-side URL validation
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes

## Logging Integration

The application extensively uses the custom logging middleware to track:

- API requests and responses
- User interactions
- Error conditions
- Application lifecycle events
- Performance metrics

All logs are sent to the Affordmed test server for evaluation purposes.

## Production Considerations

- Replace in-memory storage with a proper database
- Implement rate limiting
- Add authentication and authorization
- Use environment variables for configuration
- Implement proper security headers
- Add monitoring and alerting