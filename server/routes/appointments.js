const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  completeAppointment,
  getAllAppointments,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('patient'), bookAppointment)
  .get(protect, authorize('admin'), getAllAppointments);

router.get('/me', protect, getMyAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.patch('/:id/cancel', protect, cancelAppointment);
router.patch('/:id/complete', protect, authorize('doctor', 'admin'), completeAppointment);

module.exports = router;
