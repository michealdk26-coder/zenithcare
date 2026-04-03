const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mongoose } = require('../config/database');
const Admin = require('../models/Admin');

const FALLBACK_ADMIN_EMAIL = process.env.FALLBACK_ADMIN_EMAIL
  ? process.env.FALLBACK_ADMIN_EMAIL.toLowerCase().trim()
  : null;
const FALLBACK_ADMIN_PASSWORD = process.env.FALLBACK_ADMIN_PASSWORD || null;
const ALLOW_ADMIN_REGISTRATION = process.env.ALLOW_ADMIN_REGISTRATION === 'true';
const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY || null;

const registerAdmin = async (req, res) => {
  if (!ALLOW_ADMIN_REGISTRATION) {
    return res.status(403).json({
      success: false,
      message: 'Admin registration is disabled'
    });
  }

  if (ADMIN_SETUP_KEY) {
    const providedSetupKey = req.headers['x-admin-setup-key'];

    if (!providedSetupKey || providedSetupKey !== ADMIN_SETUP_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Invalid admin setup key'
      });
    }
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Admin registration is unavailable while database is offline'
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'An admin with this email already exists'
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email: normalizedEmail,
      password_hash,
      role: 'admin'
    });

    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully at ZenithCare Hospital',
      data: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Error registering admin:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An admin with this email already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
      error: error.message
    });
  }
};

const loginAdmin = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    if (!FALLBACK_ADMIN_EMAIL || !FALLBACK_ADMIN_PASSWORD) {
      return res.status(503).json({
        success: false,
        message: 'Fallback admin login is disabled. Set FALLBACK_ADMIN_EMAIL and FALLBACK_ADMIN_PASSWORD in backend/.env'
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail !== FALLBACK_ADMIN_EMAIL || password !== FALLBACK_ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        id: 1,
        email: FALLBACK_ADMIN_EMAIL,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful (fallback mode)',
      data: {
        token,
        admin: {
          id: 1,
          email: FALLBACK_ADMIN_EMAIL,
          role: 'admin'
        }
      },
      fallback: true
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role
        }
      }
    });

  } catch (error) {
    console.error('Error logging in admin:', error);

    return res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      error: error.message
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin
};
