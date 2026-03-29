const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    startTime: {
      type: String,
      required: true, // "09:00"
    },
    endTime: {
      type: String,
      required: true, // "17:00"
    },
    slotDuration: {
      type: Number,
      required: true,
      default: 30, // minutes
    },
    bufferTime: {
      type: Number,
      default: 5, // minutes between appointments
    },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6, // 0 = Sunday, 6 = Saturday
  },
  slots: [slotSchema],
});

// One schedule entry per doctor per day
availabilitySchema.index({ doctorId: 1, dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);
