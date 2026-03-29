const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String, // Cloudinary public ID for deletion
  },
  category: {
    type: String,
    enum: ['reception', 'consulting_room', 'ward', 'lab', 'icu', 'other'],
    default: 'other',
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Image', imageSchema);
