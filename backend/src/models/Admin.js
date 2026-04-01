const { mongoose } = require('../config/database');
const { getNextSequence } = require('./Counter');

const adminSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password_hash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    role: {
      type: String,
      default: 'admin'
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

adminSchema.pre('validate', async function assignId() {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('admins');
  }
});

module.exports = mongoose.model('Admin', adminSchema);
