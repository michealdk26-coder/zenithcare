const { mongoose } = require('../config/database');
const { getNextSequence } = require('./Counter');

const departmentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
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

departmentSchema.pre('validate', async function assignId() {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('departments');
  }
});

module.exports = mongoose.model('Department', departmentSchema);
