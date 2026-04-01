require('dotenv').config();
const app = require('./src/app');
const { connectDB, disconnectDB } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  let databaseReady = false;

  try {
    await connectDB();
    databaseReady = true;
    console.log(' Database connection established successfully (MongoDB)');
  } catch (error) {
    console.error(' Database connection unavailable:', error.message);
    console.error('Starting API in fallback mode (read + appointment submission still available).');
  }

  app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏥 ZenithCare Hospital API Server');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Database: ${databaseReady ? 'Connected' : 'Fallback mode'}`);
    console.log(`🔗 Base URL: http://localhost:${PORT}`);
    console.log('');
    console.log('📋 Available Endpoints:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏠 Root:');
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log('');
    console.log('🔐 Authentication:');
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log('');
    console.log('🏢 Departments:');
    console.log(`   GET    http://localhost:${PORT}/api/departments`);
    console.log(`   GET    http://localhost:${PORT}/api/departments/:id`);
    console.log(`   POST   http://localhost:${PORT}/api/departments (Auth)`);
    console.log(`   PUT    http://localhost:${PORT}/api/departments/:id (Auth)`);
    console.log(`   DELETE http://localhost:${PORT}/api/departments/:id (Auth)`);
    console.log('');
    console.log('👨‍⚕️ Doctors:');
    console.log(`   GET    http://localhost:${PORT}/api/doctors`);
    console.log(`   GET    http://localhost:${PORT}/api/doctors/:id`);
    console.log(`   POST   http://localhost:${PORT}/api/doctors (Auth)`);
    console.log(`   PUT    http://localhost:${PORT}/api/doctors/:id (Auth)`);
    console.log(`   DELETE http://localhost:${PORT}/api/doctors/:id (Auth)`);
    console.log('');
    console.log('📅 Appointments:');
    console.log(`   GET   http://localhost:${PORT}/api/appointments`);
    console.log(`   POST  http://localhost:${PORT}/api/appointments`);
    console.log(`   PATCH http://localhost:${PORT}/api/appointments/:id (Auth)`);
    console.log('');
    console.log('🔑 Admin Routes:');
    console.log(`   GET   http://localhost:${PORT}/api/admin/appointments (Auth)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`💡 Visit http://localhost:${PORT}/ for API documentation`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
};

startServer();

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDB();
  console.log('✅ Database connection closed');
  process.exit(0);
});
