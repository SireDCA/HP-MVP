const Appointment = require('../models/Appointment');
const { AppError } = require('../middleware/errorHandler');

// @desc    Book an appointment
// @route   POST /api/appointments
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, hospitalId, departmentId, type, startTime, duration } = req.body;

    // Calculate end time
    const start = new Date(startTime);
    const durationMins = duration || 30;
    const end = new Date(start.getTime() + durationMins * 60000);

    // Check for double booking (overlap detection)
    const conflict = await Appointment.findOne({
      doctorId,
      status: { $ne: 'cancelled' },
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (conflict) {
      return next(new AppError('This time slot is already booked. Please choose another slot.', 409));
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      hospitalId,
      departmentId,
      type: type || 'consultation',
      startTime: start,
      endTime: end,
      status: 'booked',
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name email')
      .populate('hospitalId', 'name address')
      .populate('departmentId', 'name');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged-in patient's appointments
// @route   GET /api/appointments/me
exports.getMyAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = { patientId: req.user.id };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name email avatar')
      .populate('hospitalId', 'name address')
      .populate('departmentId', 'name')
      .sort({ startTime: -1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    next(err);
  }
};

// @desc    Get doctor's appointments (for provider dashboard)
// @route   GET /api/appointments/doctor
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const { date, status } = req.query;
    let query = { doctorId: req.user.id };

    if (status) query.status = status;

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      query.startTime = { $gte: dayStart, $lte: dayEnd };
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone')
      .populate('hospitalId', 'name')
      .populate('departmentId', 'name')
      .sort({ startTime: 1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel an appointment
// @route   PATCH /api/appointments/:id/cancel
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return next(new AppError('Appointment not found', 404));

    // Only patient or doctor can cancel
    if (
      appointment.patientId.toString() !== req.user.id &&
      appointment.doctorId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError('Not authorized to cancel this appointment', 403));
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

// @desc    Complete an appointment (doctor only)
// @route   PATCH /api/appointments/:id/complete
exports.completeAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return next(new AppError('Appointment not found', 404));

    if (appointment.doctorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    appointment.status = 'completed';
    await appointment.save();

    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all appointments (admin)
// @route   GET /api/appointments
exports.getAllAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .populate('hospitalId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments();

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      data: appointments,
    });
  } catch (err) {
    next(err);
  }
};
