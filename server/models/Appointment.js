const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  type: {
    type: String,
    enum: ['consultation', 'diagnostic', 'procedure'],
    default: 'consultation',
  },
  startTime: {
    type: Date,
    required: [true, 'Please add a start time'],
  },
  endTime: {
    type: Date,
    required: [true, 'Please add an end time'],
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'],
    default: 'booked',
  },
  notes: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for double-booking prevention queries
appointmentSchema.index({ doctorId: 1, startTime: 1, endTime: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
