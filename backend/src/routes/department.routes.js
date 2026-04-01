const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/departments', departmentController.getAllDepartments);
router.get('/departments/:id', departmentController.getDepartmentById);
router.post('/departments', authenticate, departmentController.createDepartment);
router.put('/departments/:id', authenticate, departmentController.updateDepartment);
router.delete('/departments/:id', authenticate, departmentController.deleteDepartment);

module.exports = router;
