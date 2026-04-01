const { mongoose } = require('../config/database');
const { getNextSequence } = require('./Counter');

const doctorSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true
    },
    full_name: {
      type: String,
      required: [true, 'Doctor full name is required'],
      trim: true
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true
    },
    availability: {
      type: String,
      default: 'Mon-Fri, 9:00 AM - 5:00 PM'
    },
    is_active: {
      type: Boolean,
      default: true
    },
    department_id: {
      type: Number,
      required: [true, 'department_id is required']
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

doctorSchema.pre('validate', async function assignId() {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('doctors');
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);
