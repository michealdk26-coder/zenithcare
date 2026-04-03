const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

router.get('/departments', departmentController.getAllDepartments);
router.get('/departments/:id', departmentController.getDepartmentById);
router.post('/departments', authenticate, authorizeAdmin, departmentController.createDepartment);
router.put('/departments/:id', authenticate, authorizeAdmin, departmentController.updateDepartment);
router.delete('/departments/:id', authenticate, authorizeAdmin, departmentController.deleteDepartment);

module.exports = router;
