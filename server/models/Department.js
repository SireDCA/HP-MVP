const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a department name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
});

module.exports = mongoose.model('Department', departmentSchema);
