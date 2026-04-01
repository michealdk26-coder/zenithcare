const { mongoose } = require('../config/database');

const counterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    },
    seq: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false
  }
);

const Counter = mongoose.model('Counter', counterSchema);

const getNextSequence = async (counterName) => {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return counter.seq;
};

module.exports = {
  Counter,
  getNextSequence
};
