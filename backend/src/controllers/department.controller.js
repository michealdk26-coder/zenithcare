const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { mongoose } = require('../config/database');
const { fallbackDepartments } = require('../config/fallbackData');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async (operation, attempts = 3, delayMs = 400) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await wait(delayMs * attempt);
      }
    }
  }

  throw lastError;
};

const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Department name is required'
      });
    }

    const department = await Department.create({
      name: name.trim(),
      description: description || null
    });

    return res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });

  } catch (error) {
    console.error('Error creating department:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A department with this name already exists'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the department',
      error: error.message
    });
  }
};

const getAllDepartments = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json({
      success: true,
      count: fallbackDepartments.length,
      data: fallbackDepartments,
      fallback: true
    });
  }

  try {
    const departments = await withRetry(() => Department.find().sort({ name: 1 }));

    return res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });

  } catch (error) {
    console.error('Error fetching departments:', error);

    return res.status(200).json({
      success: true,
      count: fallbackDepartments.length,
      data: fallbackDepartments,
      fallback: true
    });
  }
};

const getDepartmentById = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const department = fallbackDepartments.find((item) => item.id === Number(req.params.id));
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: department,
      fallback: true
    });
  }

  try {
    const { id } = req.params;

    const department = await withRetry(() => Department.findOne({ id: Number(id) }));

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: department
    });

  } catch (error) {
    console.error('Error fetching department:', error);

    const department = fallbackDepartments.find((item) => item.id === Number(req.params.id));
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: department,
      fallback: true
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const department = await Department.findOne({ id: Number(id) });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    department.name = name ? name.trim() : department.name;
    department.description = description !== undefined ? description : department.description;

    await department.save();

    return res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department
    });

  } catch (error) {
    console.error('Error updating department:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A department with this name already exists'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the department',
      error: error.message
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const numericId = Number(id);
    const department = await Department.findOne({ id: numericId });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const [doctorsCount, appointmentsCount] = await Promise.all([
      Doctor.countDocuments({ department_id: numericId }),
      Appointment.countDocuments({ department_id: numericId })
    ]);

    if (doctorsCount > 0 || appointmentsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete department. It has associated doctors or appointments.'
      });
    }

    await Department.deleteOne({ id: numericId });

    return res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting department:', error);

    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the department',
      error: error.message
    });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};
