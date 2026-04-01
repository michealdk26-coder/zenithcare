const Doctor = require('../models/Doctor');
const Department = require('../models/Department');
const { mongoose } = require('../config/database');
const { fallbackDoctors } = require('../config/fallbackData');

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

const withDepartment = (doctor, departmentMap) => {
  const plainDoctor = doctor.toJSON ? doctor.toJSON() : doctor;
  return {
    ...plainDoctor,
    department: departmentMap.get(plainDoctor.department_id) || null
  };
};

const createDoctor = async (req, res) => {
  try {
    const { full_name, specialization, department_id, availability, is_active } = req.body;

    if (!full_name || !specialization || !department_id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full_name, specialization, and department_id'
      });
    }

    const numericDepartmentId = Number(department_id);
    const department = await Department.findOne({ id: numericDepartmentId });
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const doctor = await Doctor.create({
      full_name,
      specialization,
      department_id: numericDepartmentId,
      availability: availability || 'Mon-Fri, 9:00 AM - 5:00 PM',
      is_active: is_active !== undefined ? is_active : true
    });

    const createdDoctor = {
      ...doctor.toJSON(),
      department: {
        id: department.id,
        name: department.name
      }
    };

    return res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: createdDoctor
    });

  } catch (error) {
    console.error('Error creating doctor:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the doctor',
      error: error.message
    });
  }
};

const getAllDoctors = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json({
      success: true,
      count: fallbackDoctors.length,
      data: fallbackDoctors,
      fallback: true
    });
  }

  try {
    const doctors = await withRetry(() => Doctor.find().sort({ full_name: 1 }));

    const departmentIds = [...new Set(doctors.map(doc => doc.department_id))];
    const departments = await withRetry(() => Department.find({ id: { $in: departmentIds } }));
    const departmentMap = new Map(
      departments.map((dept) => [dept.id, { id: dept.id, name: dept.name, description: dept.description }])
    );

    const doctorsWithDepartments = doctors.map((doctor) => withDepartment(doctor, departmentMap));

    return res.status(200).json({
      success: true,
      count: doctorsWithDepartments.length,
      data: doctorsWithDepartments
    });

  } catch (error) {
    console.error('Error fetching doctors:', error);

    return res.status(200).json({
      success: true,
      count: fallbackDoctors.length,
      data: fallbackDoctors,
      fallback: true
    });
  }
};

const getDoctorById = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const doctor = fallbackDoctors.find((item) => item.id === Number(req.params.id));
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
      fallback: true
    });
  }

  try {
    const { id } = req.params;

    const doctor = await withRetry(() => Doctor.findOne({ id: Number(id) }));

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const department = await withRetry(() => Department.findOne({ id: doctor.department_id }));

    return res.status(200).json({
      success: true,
      data: {
        ...doctor.toJSON(),
        department: department
          ? { id: department.id, name: department.name, description: department.description }
          : null
      }
    });

  } catch (error) {
    console.error('Error fetching doctor:', error);

    const doctor = fallbackDoctors.find((item) => item.id === Number(req.params.id));
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
      fallback: true
    });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, specialization, department_id, availability, is_active } = req.body;

    const doctor = await Doctor.findOne({ id: Number(id) });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (department_id) {
      const department = await Department.findOne({ id: Number(department_id) });
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }
    }

    doctor.full_name = full_name || doctor.full_name;
    doctor.specialization = specialization || doctor.specialization;
    doctor.department_id = department_id ? Number(department_id) : doctor.department_id;
    doctor.availability = availability !== undefined ? availability : doctor.availability;
    doctor.is_active = is_active !== undefined ? is_active : doctor.is_active;

    await doctor.save();

    const department = await Department.findOne({ id: doctor.department_id });
    const updatedDoctor = {
      ...doctor.toJSON(),
      department: department ? { id: department.id, name: department.name } : null
    };

    return res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: updatedDoctor
    });

  } catch (error) {
    console.error('Error updating doctor:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the doctor',
      error: error.message
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const numericId = Number(id);
    const doctor = await Doctor.findOne({ id: numericId });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const hasAppointments = await require('../models/Appointment').exists({ doctor_id: numericId });

    if (hasAppointments) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete doctor. They have associated appointments.'
      });
    }

    await Doctor.deleteOne({ id: numericId });

    return res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting doctor:', error);

    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the doctor',
      error: error.message
    });
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
};
