const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

router.use(authenticate, authorizeAdmin);

router.get('/appointments', appointmentController.getAllAppointments);
router.put('/appointments/:id', appointmentController.updateAppointmentStatus);
router.delete('/appointments/:id', appointmentController.deleteAppointment);

module.exports = router;
