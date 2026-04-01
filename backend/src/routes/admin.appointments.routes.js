const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/appointments', appointmentController.getAllAppointments);
router.put('/appointments/:id', appointmentController.updateAppointmentStatus);
router.delete('/appointments/:id', appointmentController.deleteAppointment);

module.exports = router;
