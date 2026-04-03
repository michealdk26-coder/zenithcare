const Appointment = require('../models/Appointment');
const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const fs = require('fs');
const path = require('path');
const { mongoose } = require('../config/database');
const { fallbackDepartments, fallbackDoctors } = require('../config/fallbackData');
const { sendAppointmentStatusEmail } = require('../services/email.service');

const FALLBACK_APPOINTMENTS_FILE = path.join(__dirname, '..', 'config', 'fallbackAppointments.json');
const FALLBACK_APPOINTMENT_TTL_MS = 5 * 60 * 1000;

const loadFallbackAppointments = () => {
  try {
    if (!fs.existsSync(FALLBACK_APPOINTMENTS_FILE)) {
      return [];
    }

    const raw = fs.readFileSync(FALLBACK_APPOINTMENTS_FILE, 'utf8').trim();
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading fallback appointments:', error.message);
    return [];
  }
};

const saveFallbackAppointments = () => {
  try {
    fs.writeFileSync(FALLBACK_APPOINTMENTS_FILE, JSON.stringify(fallbackAppointments, null, 2));
  } catch (error) {
    console.error('Error saving fallback appointments:', error.message);
  }
};

const fallbackAppointments = loadFallbackAppointments();

const isExpiredFallbackAppointment = (appointment, now = Date.now()) => {
  if (appointment?.expiresAt) {
    const expiryTime = new Date(appointment.expiresAt).getTime();
    return Number.isFinite(expiryTime) && expiryTime <= now;
  }

  const createdTime = new Date(appointment?.createdAt).getTime();
  if (!Number.isFinite(createdTime)) {
    return false;
  }

  return now - createdTime >= FALLBACK_APPOINTMENT_TTL_MS;
};

const pruneExpiredFallbackAppointments = () => {
  const now = Date.now();
  const activeAppointments = fallbackAppointments.filter((appointment) => !isExpiredFallbackAppointment(appointment, now));

  if (activeAppointments.length !== fallbackAppointments.length) {
    fallbackAppointments.splice(0, fallbackAppointments.length, ...activeAppointments);
    saveFallbackAppointments();
  }

  return fallbackAppointments;
};

pruneExpiredFallbackAppointments();

const buildFallbackAppointment = ({ patient_name, phone, email, appointment_date, department_id, doctor_id }) => {
  const numericDepartmentId = Number(department_id);
  const numericDoctorId = doctor_id !== null && doctor_id !== undefined ? Number(doctor_id) : null;
  const department = fallbackDepartments.find((item) => item.id === numericDepartmentId);

  if (!department) {
    return { error: 'Department not found' };
  }

  const doctor = numericDoctorId
    ? fallbackDoctors.find((item) => item.id === numericDoctorId && item.department_id === numericDepartmentId)
    : null;

  const nextId = fallbackAppointments.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
  const timestamp = new Date().toISOString();

  return {
    id: nextId,
    patient_name,
    phone,
    email: email || null,
    appointment_date,
    department_id: numericDepartmentId,
    doctor_id: numericDoctorId,
    status: 'Pending',
    createdAt: timestamp,
    updatedAt: timestamp,
    expiresAt: new Date(Date.now() + FALLBACK_APPOINTMENT_TTL_MS).toISOString(),
    department: { id: department.id, name: department.name },
    doctor: doctor ? { id: doctor.id, full_name: doctor.full_name, specialization: doctor.specialization } : null
  };
};

const withRelations = (appointment, departmentsMap, doctorsMap) => {
  const plain = appointment.toJSON ? appointment.toJSON() : appointment;
  return {
    ...plain,
    department: departmentsMap.get(plain.department_id) || null,
    doctor: plain.doctor_id ? doctorsMap.get(plain.doctor_id) || null : null
  };
};

const hydrateFallbackAppointment = (appointment) => {
  const numericDepartmentId = Number(appointment.department_id);
  const numericDoctorId = appointment.doctor_id !== null && appointment.doctor_id !== undefined
    ? Number(appointment.doctor_id)
    : null;

  const department = fallbackDepartments.find((item) => item.id === numericDepartmentId);
  const doctor = numericDoctorId
    ? fallbackDoctors.find((item) => item.id === numericDoctorId)
    : null;

  return {
    ...appointment,
    department: department
      ? {
          id: department.id,
          name: department.name,
          description: department.description
        }
      : (appointment.department || null),
    doctor: doctor
      ? {
          id: doctor.id,
          full_name: doctor.full_name,
          specialization: doctor.specialization,
          availability: doctor.availability
        }
      : (appointment.doctor || null)
  };
};

const getHydratedSortedFallbackAppointments = () =>
  [...fallbackAppointments]
    .map((appointment) => hydrateFallbackAppointment(appointment))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const createAppointment = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    pruneExpiredFallbackAppointments();

    const { patient_name, phone, email, appointment_date, department_id, doctor_id } = req.body;
    if (!patient_name || !phone || !appointment_date || !department_id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: patient_name, phone, appointment_date, and department_id'
      });
    }

    const fallbackAppointment = buildFallbackAppointment({
      patient_name,
      phone,
      email,
      appointment_date,
      department_id,
      doctor_id
    });

    if (fallbackAppointment.error) {
      return res.status(404).json({
        success: false,
        message: fallbackAppointment.error
      });
    }

    fallbackAppointments.push(fallbackAppointment);
    saveFallbackAppointments();

    return res.status(201).json({
      success: true,
      message: 'Appointment created successfully at ZenithCare Hospital. Our team will contact you shortly.',
      data: fallbackAppointment,
      fallback: true
    });
  }

  try {
    const { patient_name, phone, email, appointment_date, department_id, doctor_id } = req.body;

    if (!patient_name || !phone || !appointment_date || !department_id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: patient_name, phone, appointment_date, and department_id'
      });
    }

    const numericDepartmentId = Number(department_id);
    const numericDoctorId = doctor_id !== null && doctor_id !== undefined ? Number(doctor_id) : null;

    const department = await Department.findOne({ id: numericDepartmentId });
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    if (numericDoctorId) {
      const doctor = await Doctor.findOne({ id: numericDoctorId });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      if (doctor.department_id !== numericDepartmentId) {
        return res.status(400).json({
          success: false,
          message: 'Selected doctor does not belong to the specified department'
        });
      }

      if (!doctor.is_active) {
        return res.status(400).json({
          success: false,
          message: 'Selected doctor is currently not available'
        });
      }
    }

    const appointmentData = {
      patient_name,
      phone,
      email: email || null,
      appointment_date,
      department_id: numericDepartmentId,
      doctor_id: numericDoctorId,
      status: 'Pending'
    };

    const appointment = await Appointment.create(appointmentData);

    const createdAppointment = {
      ...appointment.toJSON(),
      department: { id: department.id, name: department.name },
      doctor: null
    };

    if (numericDoctorId) {
      const doctor = await Doctor.findOne({ id: numericDoctorId });
      if (doctor) {
        createdAppointment.doctor = {
          id: doctor.id,
          full_name: doctor.full_name,
          specialization: doctor.specialization
        };
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Appointment created successfully at ZenithCare Hospital. Our team will contact you shortly.',
      data: createdAppointment
    });

  } catch (error) {
    console.error('Error creating appointment:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    const { patient_name, phone, email, appointment_date, department_id, doctor_id } = req.body;
    if (!patient_name || !phone || !appointment_date || !department_id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: patient_name, phone, appointment_date, and department_id'
      });
    }

    pruneExpiredFallbackAppointments();

    const fallbackAppointment = buildFallbackAppointment({
      patient_name,
      phone,
      email,
      appointment_date,
      department_id,
      doctor_id
    });

    if (fallbackAppointment.error) {
      return res.status(404).json({
        success: false,
        message: fallbackAppointment.error
      });
    }

    fallbackAppointments.push(fallbackAppointment);
    saveFallbackAppointments();

    return res.status(201).json({
      success: true,
      message: 'Appointment created successfully at ZenithCare Hospital. Our team will contact you shortly.',
      data: fallbackAppointment,
      fallback: true
    });
  }
};

const getAllAppointments = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    pruneExpiredFallbackAppointments();
    const hydratedAppointments = getHydratedSortedFallbackAppointments();

    return res.status(200).json({
      success: true,
      count: hydratedAppointments.length,
      data: hydratedAppointments,
      fallback: true
    });
  }

  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });

    const departmentIds = [...new Set(appointments.map((appt) => appt.department_id))];
    const doctorIds = [...new Set(appointments.filter((appt) => appt.doctor_id).map((appt) => appt.doctor_id))];

    const [departments, doctors] = await Promise.all([
      Department.find({ id: { $in: departmentIds } }),
      Doctor.find({ id: { $in: doctorIds } })
    ]);

    const departmentsMap = new Map(
      departments.map((dept) => [dept.id, { id: dept.id, name: dept.name, description: dept.description }])
    );

    const doctorsMap = new Map(
      doctors.map((doctor) => [doctor.id, {
        id: doctor.id,
        full_name: doctor.full_name,
        specialization: doctor.specialization,
        availability: doctor.availability
      }])
    );

    const appointmentsWithRelations = appointments.map((appointment) =>
      withRelations(appointment, departmentsMap, doctorsMap)
    );

    return res.status(200).json({
      success: true,
      count: appointmentsWithRelations.length,
      data: appointmentsWithRelations
    });

  } catch (error) {
    console.error('Error fetching appointments:', error);

    pruneExpiredFallbackAppointments();
    const hydratedAppointments = getHydratedSortedFallbackAppointments();

    return res.status(200).json({
      success: true,
      count: hydratedAppointments.length,
      data: hydratedAppointments,
      fallback: true
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    pruneExpiredFallbackAppointments();

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (Pending, Approved, or Rejected)'
      });
    }

    const appointment = fallbackAppointments.find((item) => item.id === Number(id));
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = status;
    appointment.updatedAt = new Date().toISOString();
    saveFallbackAppointments();

    const emailResult = await sendAppointmentStatusEmail({
      patientName: appointment.patient_name,
      patientEmail: appointment.email,
      appointmentDate: appointment.appointment_date,
      status,
      departmentName: appointment.department?.name,
      doctorName: appointment.doctor?.full_name
    });

    return res.status(200).json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully`,
      data: appointment,
      emailSent: emailResult.sent,
      fallback: true
    });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (Pending, Approved, or Rejected)'
      });
    }

    const numericId = Number(id);
    const appointment = await Appointment.findOne({ id: numericId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = status;
    await appointment.save();

    const [department, doctor] = await Promise.all([
      Department.findOne({ id: appointment.department_id }),
      appointment.doctor_id ? Doctor.findOne({ id: appointment.doctor_id }) : Promise.resolve(null)
    ]);

    const emailResult = await sendAppointmentStatusEmail({
      patientName: appointment.patient_name,
      patientEmail: appointment.email,
      appointmentDate: appointment.appointment_date,
      status,
      departmentName: department?.name,
      doctorName: doctor?.full_name
    });

    const updatedAppointment = {
      ...appointment.toJSON(),
      department: department ? { id: department.id, name: department.name } : null,
      doctor: doctor
        ? { id: doctor.id, full_name: doctor.full_name, specialization: doctor.specialization }
        : null
    };

    return res.status(200).json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully`,
      data: updatedAppointment,
      emailSent: emailResult.sent
    });

  } catch (error) {
    console.error('Error updating appointment:', error);

    pruneExpiredFallbackAppointments();

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (Pending, Approved, or Rejected)'
      });
    }

    const appointment = fallbackAppointments.find((item) => item.id === Number(id));
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = status;
    appointment.updatedAt = new Date().toISOString();
    saveFallbackAppointments();

    const emailResult = await sendAppointmentStatusEmail({
      patientName: appointment.patient_name,
      patientEmail: appointment.email,
      appointmentDate: appointment.appointment_date,
      status,
      departmentName: appointment.department?.name,
      doctorName: appointment.doctor?.full_name
    });

    return res.status(200).json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully`,
      data: appointment,
      emailSent: emailResult.sent,
      fallback: true
    });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (mongoose.connection.readyState !== 1) {
    pruneExpiredFallbackAppointments();

    const index = fallbackAppointments.findIndex((item) => item.id === numericId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const [deletedAppointment] = fallbackAppointments.splice(index, 1);
    saveFallbackAppointments();

    return res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
      data: deletedAppointment,
      fallback: true
    });
  }

  try {
    const appointment = await Appointment.findOneAndDelete({ id: numericId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
      data: appointment.toJSON()
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete appointment'
    });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment
};
