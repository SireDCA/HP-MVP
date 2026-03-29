const Department = require('../models/Department');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all departments
// @route   GET /api/departments
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
exports.getDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return next(new AppError('Department not found', 404));
    res.status(200).json({ success: true, data: department });
  } catch (err) {
    next(err);
  }
};

// @desc    Create department (admin)
// @route   POST /api/departments
exports.createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (err) {
    next(err);
  }
};

// @desc    Update department (admin)
// @route   PUT /api/departments/:id
exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!department) return next(new AppError('Department not found', 404));
    res.status(200).json({ success: true, data: department });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete department (admin)
// @route   DELETE /api/departments/:id
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return next(new AppError('Department not found', 404));
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
