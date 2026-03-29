const Joi = require('joi');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

// Validation schemas
const signupSchema = Joi.object({
  name: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('patient', 'doctor', 'admin').default('patient'),
  phone: Joi.string().allow(''),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Helper: send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) return next(new AppError('Email already registered', 400));

    const user = await User.create(value);
    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const { email, password } = value;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new AppError('Invalid credentials', 401));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new AppError('Invalid credentials', 401));

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('hospitalId', 'name address')
      .populate('specialtyId', 'name');
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
