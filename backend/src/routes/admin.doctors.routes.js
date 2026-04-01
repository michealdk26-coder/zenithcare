const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/doctors', doctorController.getAllDoctors);

router.get('/doctors/:id', doctorController.getDoctorById);

router.post('/doctors', doctorController.createDoctor);

router.put('/doctors/:id', doctorController.updateDoctor);

router.delete('/doctors/:id', doctorController.deleteDoctor);

module.exports = router;
