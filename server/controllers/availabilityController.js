const Availability = require('../models/Availability');
const { generateAvailableSlots } = require('../utils/slotGenerator');
const { AppError } = require('../middleware/errorHandler');

// @desc    Set doctor availability (create or update)
// @route   POST /api/availability
exports.setAvailability = async (req, res, next) => {
  try {
    const { hospitalId, dayOfWeek, slots } = req.body;

    const availability = await Availability.findOneAndUpdate(
      { doctorId: req.user.id, dayOfWeek },
      { doctorId: req.user.id, hospitalId, dayOfWeek, slots },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: availability });
  } catch (err) {
    next(err);
  }
};

// @desc    Get doctor's weekly availability schedule
// @route   GET /api/availability/schedule
exports.getMySchedule = async (req, res, next) => {
  try {
    const schedule = await Availability.find({ doctorId: req.user.id })
      .populate('hospitalId', 'name')
      .sort({ dayOfWeek: 1 });

    res.status(200).json({ success: true, data: schedule });
  } catch (err) {
    next(err);
  }
};

// @desc    Get available slots for a doctor on a specific date
// @route   GET /api/availability/:doctorId/slots?date=2026-04-01
exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) return next(new AppError('Please provide a date query parameter', 400));

    const slots = await generateAvailableSlots(doctorId, new Date(date));

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (err) {
    next(err);
  }
};
