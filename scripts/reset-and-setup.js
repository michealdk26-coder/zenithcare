
const fetch = require('node-fetch');
const { spawnSync } = require('child_process');

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function log(color, msg) {
  const COLORS = {
    GREEN: '\x1b[32m',
    BLUE: '\x1b[34m',
    RED: '\x1b[31m',
    YELLOW: '\x1b[33m',
    NC: '\x1b[0m',
  };
  console.log(`${COLORS[color] || ''}${msg}${COLORS.NC}`);
}

async function loginAdmin() {
  log('BLUE', '[1/4] Logging in as admin...');
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

async function deleteAll(endpoint, token, label) {
  log('BLUE', `[2/4] Clearing existing ${label}...`);
  const res = await fetch(`${API_URL}/${endpoint}`);
  const items = await res.json();
  const ids = items.map(item => item.id).sort((a, b) => b - a);
  let count = 0;
  for (const id of ids) {
    await fetch(`${API_URL}/admin/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    count++;
  }
  log('GREEN', `✅ Deleted ${count} ${label}`);
  console.log();
}

function runSampleDataScript() {
  log('BLUE', '[4/4] Running fresh setup...');
  spawnSync('node', ['scripts/setup-sample-data.js'], { stdio: 'inherit', shell: true });
}

(async function main() {
  log('GREEN', '🏥 ZenithCare Hospital - Reset & Complete Setup');
  log('GREEN', '================================================');
  console.log();

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    log('RED', '❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variables.');
    log('YELLOW', 'Run with: ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="strong_password" node scripts/reset-and-setup.js');
    process.exit(1);
  }

  const token = await loginAdmin();
  await deleteAll('doctors', token, 'doctors');
  await deleteAll('departments', token, 'departments');
  runSampleDataScript();
})();
