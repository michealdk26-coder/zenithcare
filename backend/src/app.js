const express = require('express');
const cors = require('cors');
const appointmentRoutes = require('./routes/appointment.routes');
const contactRoutes = require('./routes/contact.routes');
const authRoutes = require('./routes/auth.routes');
const adminAppointmentRoutes = require('./routes/admin.appointments.routes');
const adminDoctorRoutes = require('./routes/admin.doctors.routes');
const adminDepartmentRoutes = require('./routes/admin.departments.routes');
const doctorRoutes = require('./routes/doctor.routes');
const departmentRoutes = require('./routes/department.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ZenithCare Hospital API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      departments: {
        getAll: 'GET /api/departments',
        getOne: 'GET /api/departments/:id',
        create: 'POST /api/departments (requires auth)',
        update: 'PUT /api/departments/:id (requires auth)',
        delete: 'DELETE /api/departments/:id (requires auth)'
      },
      doctors: {
        getAll: 'GET /api/doctors',
        getOne: 'GET /api/doctors/:id',
        create: 'POST /api/doctors (requires auth)',
        update: 'PUT /api/doctors/:id (requires auth)',
        delete: 'DELETE /api/doctors/:id (requires auth)'
      },
      appointments: {
        getAll: 'GET /api/appointments',
        create: 'POST /api/appointments',
        updateStatus: 'PATCH /api/appointments/:id (requires auth)'
      }
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ZenithCare Hospital API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', authRoutes);
app.use('/api', contactRoutes);
app.use('/api', appointmentRoutes);
app.use('/api/admin', adminAppointmentRoutes);
app.use('/api/admin', adminDoctorRoutes);
app.use('/api/admin', adminDepartmentRoutes);
app.use('/api', doctorRoutes);
app.use('/api', departmentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

module.exports = app;
