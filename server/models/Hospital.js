const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hospital name'],
    trim: true,
    maxlength: 100,
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  departments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
  ],
  description: {
    type: String,
    maxlength: 1000,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add text index for search
hospitalSchema.index({ name: 'text', address: 'text', description: 'text' });

module.exports = mongoose.model('Hospital', hospitalSchema);
