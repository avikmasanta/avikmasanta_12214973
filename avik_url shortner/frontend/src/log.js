import axios from 'axios';

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';
const AUTH_TOKEN = process.env.REACT_APP_AFFORDMED_LOG_TOKEN; // Use REACT_APP_ prefix for CRA

const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = {
  backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
  frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
  both: ['auth', 'config', 'middleware', 'utils']
};

export function Log(stack, level, pkg, message) {
  if (!VALID_STACKS.includes(stack)) return;
  if (!VALID_LEVELS.includes(level)) return;
  const validPackages = [...VALID_PACKAGES[stack], ...VALID_PACKAGES.both];
  if (!validPackages.includes(pkg)) return;

  const logData = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message: message
  };

  axios.post(LOG_API_URL, logData, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`
    }
  }).catch(() => {});
} 