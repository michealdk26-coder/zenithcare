const nodemailer = require('nodemailer');

const hasEmailConfig = () => Boolean(process.env.GMAIL_USER && process.env.GMAIL_PASS);

const getTransporter = () => {
  if (!hasEmailConfig()) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
};

const formatDate = (dateValue) => {
  try {
    return new Date(dateValue).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (_error) {
    return String(dateValue || 'N/A');
  }
};

const sendAppointmentStatusEmail = async ({
  patientName,
  patientEmail,
  appointmentDate,
  status,
  departmentName,
  doctorName
}) => {
  if (!patientEmail) {
    return { sent: false, reason: 'No patient email provided' };
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Email not sent: GMAIL_USER/GMAIL_PASS not configured.');
    return { sent: false, reason: 'Email config missing' };
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: patientEmail,
    subject: `ZenithCare Appointment ${status}`,
    text: [
      `Hello ${patientName || 'Patient'},`,
      '',
      `Your appointment status has been updated to: ${status}.`,
      `Date: ${formatDate(appointmentDate)}`,
      `Department: ${departmentName || 'N/A'}`,
      `Doctor: ${doctorName || 'Not assigned'}`,
      '',
      'Thank you for choosing ZenithCare Hospital.'
    ].join('\n')
  };

  try {
    await transporter.sendMail(mailOptions);
    return { sent: true };
  } catch (error) {
    console.error('Failed to send appointment status email:', error.message);
    return { sent: false, reason: error.message };
  }
};

module.exports = {
  sendAppointmentStatusEmail
};
