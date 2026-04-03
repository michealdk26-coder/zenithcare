const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

router.post('/appointments', appointmentController.createAppointment);
router.get('/appointments', appointmentController.getAllAppointments);
router.patch('/appointments/:id', authenticate, authorizeAdmin, appointmentController.updateAppointmentStatus);

module.exports = router;
