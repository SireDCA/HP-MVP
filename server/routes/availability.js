const express = require('express');
const router = express.Router();
const {
  setAvailability,
  getMySchedule,
  getAvailableSlots,
} = require('../controllers/availabilityController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('doctor'), setAvailability);
router.get('/schedule', protect, authorize('doctor'), getMySchedule);
router.get('/:doctorId/slots', getAvailableSlots);

module.exports = router;
