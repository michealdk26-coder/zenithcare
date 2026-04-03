const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorById);
router.post('/doctors', authenticate, authorizeAdmin, doctorController.createDoctor);
router.put('/doctors/:id', authenticate, authorizeAdmin, doctorController.updateDoctor);
router.delete('/doctors/:id', authenticate, authorizeAdmin, doctorController.deleteDoctor);

module.exports = router;
