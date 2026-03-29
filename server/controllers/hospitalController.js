const Hospital = require('../models/Hospital');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all hospitals (with search & filtering)
// @route   GET /api/hospitals
exports.getHospitals = async (req, res, next) => {
  try {
    const { search, department, tags, page = 1, limit = 10 } = req.query;

    let query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by department
    if (department) {
      query.departments = department;
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map((t) => t.trim());
      query.tags = { $in: tagArray };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const hospitals = await Hospital.find(query)
      .populate('departments', 'name description')
      .populate('images')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Hospital.countDocuments(query);

    res.status(200).json({
      success: true,
      count: hospitals.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: hospitals,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single hospital
// @route   GET /api/hospitals/:id
exports.getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
      .populate('departments', 'name description')
      .populate('images');

    if (!hospital) return next(new AppError('Hospital not found', 404));

    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    next(err);
  }
};

// @desc    Create hospital (admin only)
// @route   POST /api/hospitals
exports.createHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({ success: true, data: hospital });
  } catch (err) {
    next(err);
  }
};

// @desc    Update hospital (admin only)
// @route   PUT /api/hospitals/:id
exports.updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hospital) return next(new AppError('Hospital not found', 404));
    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete hospital (admin only)
// @route   DELETE /api/hospitals/:id
exports.deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return next(new AppError('Hospital not found', 404));
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Get doctors for a hospital
// @route   GET /api/hospitals/:id/doctors
exports.getHospitalDoctors = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const doctors = await User.find({
      hospitalId: req.params.id,
      role: 'doctor',
    })
      .select('name email phone specialtyId avatar')
      .populate('specialtyId', 'name');

    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (err) {
    next(err);
  }
};
