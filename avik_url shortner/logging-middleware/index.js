const axios = require('axios');

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

// Valid values for stack, level, and package
const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = {
  backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
  frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
  both: ['auth', 'config', 'middleware', 'utils']
};

function Log(stack, level, package, message) {
  // Validate inputs
  if (!VALID_STACKS.includes(stack)) {
    console.error(`Invalid stack: ${stack}. Must be one of: ${VALID_STACKS.join(', ')}`);
    return;
  }
 
  if (!VALID_LEVELS.includes(level)) {
    console.error(`Invalid level: ${level}. Must be one of: ${VALID_LEVELS.join(', ')}`);
    return;
  }

  const validPackages = [...VALID_PACKAGES[stack], ...VALID_PACKAGES.both];
  if (!validPackages.includes(package)) {
    console.error(`Invalid package: ${package} for stack: ${stack}. Must be one of: ${validPackages.join(', ')}`);
    return;
  }

  const logData = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: package.toLowerCase(),
    message: message
  };

  const AUTH_TOKEN = process.env.AFFORDMED_LOG_TOKEN; // Set this in your environment

  axios.post(LOG_API_URL, logData, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`
    }
  })
    .then(response => {
      console.log(`Log sent successfully: ${response.data.logID}`);
    })
    .catch(error => {
      console.error('Failed to send log:', error.message);
    });
}

module.exports = { Log }; 