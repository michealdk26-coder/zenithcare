const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorById);
router.post('/doctors', authenticate, doctorController.createDoctor);
router.put('/doctors/:id', authenticate, doctorController.updateDoctor);
router.delete('/doctors/:id', authenticate, doctorController.deleteDoctor);

module.exports = router;
