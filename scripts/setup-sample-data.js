
const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const COLORS = {
  GREEN: '\x1b[32m',
  BLUE: '\x1b[34m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  NC: '\x1b[0m',
};

function log(color, msg) {
  console.log(`${COLORS[color] || ''}${msg}${COLORS.NC}`);
}

async function checkBackend() {
  log('BLUE', '[1/5] Checking backend status...');
  try {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error();
    log('GREEN', '✅ Backend is running');
  } catch {
    log('RED', '❌ Backend is not running. Please start it first.');
    log('YELLOW', 'Run: cd backend && npm start');
    process.exit(1);
  }
  console.log();
}

async function registerAdmin() {
  log('BLUE', '[2/5] Creating admin account...');
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' }),
  });
  const data = await res.json();
  if (data.success) {
    log('GREEN', '✅ Admin account created');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
  } else {
    log('YELLOW', '⚠️  Admin might already exist (this is okay)');
  }
  console.log();
}

async function loginAdmin() {
  log('BLUE', '[3/5] Logging in...');
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const data = await res.json();
  if (!data.success || !data.data?.token) {
    log('RED', '❌ Failed to login. Please check credentials.');
    process.exit(1);
  }
  log('GREEN', '✅ Login successful');
  console.log();
  return data.data.token;
}

(async function main() {
  log('GREEN', '🏥 ZenithCare Hospital - Sample Data Setup');
  log('GREEN', '==========================================');
  console.log();

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    log('RED', '❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variables.');
    log('YELLOW', 'Run with: ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="strong_password" node scripts/setup-sample-data.js');
    process.exit(1);
  }

  await checkBackend();
  await registerAdmin();
  await loginAdmin();
})();
