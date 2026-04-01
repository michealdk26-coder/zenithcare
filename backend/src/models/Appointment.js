const { mongoose } = require('../config/database');
const { getNextSequence } = require('./Counter');

const appointmentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true
    },
    patient_name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      default: null,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    appointment_date: {
      type: Date,
      required: [true, 'Appointment date is required']
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    department_id: {
      type: Number,
      required: [true, 'department_id is required']
    },
    doctor_id: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret._id;
        return ret;
      }
    }
  }
);

appointmentSchema.pre('validate', async function assignId() {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('appointments');
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
