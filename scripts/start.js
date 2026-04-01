
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

async function checkMongo() {
  log('BLUE', '[1/5] Checking MongoDB...');
  try {
    execSync('mongosh --version', { stdio: 'ignore' });
    log('GREEN', '✅ MongoDB shell found');
  } catch {
    log('YELLOW', '⚠️  mongosh not found. Ensure MongoDB is installed and running.');
  }

  console.log();
}

function checkBackendDependencies() {
  log('BLUE', '[2/5] Checking backend dependencies...');
  const backendPath = path.join(__dirname, '../backend');
  if (!fs.existsSync(path.join(backendPath, 'node_modules'))) {
    log('YELLOW', '⚠️  Installing backend dependencies...');
    execSync('npm install', { cwd: backendPath, stdio: 'inherit' });
    log('GREEN', '✅ Backend dependencies installed');
  } else {
    log('GREEN', '✅ Backend dependencies OK');
  }
  console.log();
}

function checkEnvFile() {
  log('BLUE', '[3/5] Checking environment configuration...');
  const envPath = path.join(__dirname, '../backend/.env');
  if (!fs.existsSync(envPath)) {
    log('YELLOW', '⚠️  Creating .env file...');
    fs.writeFileSync(envPath, `PORT=5000\nNODE_ENV=development\nMONGO_URI=mongodb://127.0.0.1:27017/zenithcare_hospital\nJWT_SECRET=zenithcare_secret_key_2024\nGMAIL_USER=your_email@gmail.com\nGMAIL_PASS=your_app_password\n`);
    log('GREEN', '✅ .env file created');
  } else {
    log('GREEN', '✅ .env file exists');
  }
  console.log();
}

function startBackend() {
  log('BLUE', '[4/5] Starting backend server...');
  log('YELLOW', 'Backend will start on http://localhost:5000');
  const backendPath = path.join(__dirname, '../backend');
  const backend = spawn('npm', ['run', 'dev'], { cwd: backendPath, stdio: 'inherit', shell: true });
  log('GREEN', `✅ Backend started (PID: ${backend.pid})`);
  console.log();
  return backend;
}

async function waitForBackend() {
  log('BLUE', 'Waiting for backend to be ready...');
  await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    execSync('curl -s http://localhost:5000/health', { stdio: 'ignore' });
    log('GREEN', '✅ Backend is ready!');
  } catch {
    log('RED', '❌ Backend failed to start');
    process.exit(1);
  }
  console.log();
}

function frontendInstructions() {
  log('BLUE', '[5/5] Frontend setup');
  console.log();
  log('GREEN', '============================================');
  log('GREEN', '🎉 Backend is running successfully!');
  log('GREEN', '============================================');
  console.log();
  log('YELLOW', 'To start the frontend:');
  console.log();
  log('BLUE', 'Option 1 - Using http-server:');
  console.log('    npm install -g http-server');
  console.log('    http-server -p 3000 -o');
  console.log();
  log('BLUE', 'Option 2 - Using Python:');
  console.log('    python3 -m http.server 3000');
  console.log();
  log('BLUE', 'Option 3 - Using VS Code Live Server:');
  console.log("    Right-click on index.html and select 'Open with Live Server'");
  console.log();
  log('YELLOW', '📝 Next Steps:');
  console.log('  1. Start the frontend using one of the options above');
  console.log('  2. Create admin account: POST http://localhost:5000/api/auth/register');
  console.log('  3. Visit http://localhost:3000 to see the application');
  console.log('  4. Login to admin panel at http://localhost:3000/admin-login.html');
  console.log();
  log('YELLOW', '📖 For detailed instructions, see README.md');
  console.log();
}

(async function main() {
  log('GREEN', '🏥 ZenithCare Hospital - Quick Start');
  log('GREEN', '====================================');
  console.log();
  await checkMongo();
  checkBackendDependencies();
  checkEnvFile();
  const backend = startBackend();
  await waitForBackend();
  frontendInstructions();
  backend.on('exit', (code) => {
    log('YELLOW', `Backend process exited with code ${code}`);
  });
})();
