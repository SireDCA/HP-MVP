const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');

/**
 * Generate available time slots for a doctor on a given date.
 * Filters out already-booked slots.
 *
 * @param {string} doctorId - Doctor's user ID
 * @param {Date} date - The date to generate slots for
 * @param {number} [appointmentDuration] - Override duration in minutes
 * @returns {Array<{startTime: Date, endTime: Date}>} Available slots
 */
const generateAvailableSlots = async (doctorId, date, appointmentDuration) => {
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay(); // 0-6

  // Get doctor's availability for this day of week
  const availability = await Availability.findOne({ doctorId, dayOfWeek });
  if (!availability || !availability.slots.length) {
    return [];
  }

  // Generate all possible slots from availability windows
  const allSlots = [];

  for (const window of availability.slots) {
    const duration = appointmentDuration || window.slotDuration;
    const buffer = window.bufferTime || 0;

    // Parse start/end times (e.g., "09:00", "17:00")
    const [startHour, startMin] = window.startTime.split(':').map(Number);
    const [endHour, endMin] = window.endTime.split(':').map(Number);

    const windowStart = new Date(targetDate);
    windowStart.setHours(startHour, startMin, 0, 0);

    const windowEnd = new Date(targetDate);
    windowEnd.setHours(endHour, endMin, 0, 0);

    let currentTime = new Date(windowStart);

    while (currentTime.getTime() + duration * 60000 <= windowEnd.getTime()) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);

      allSlots.push({ startTime: slotStart, endTime: slotEnd });

      // Move to next slot (duration + buffer)
      currentTime = new Date(currentTime.getTime() + (duration + buffer) * 60000);
    }
  }

  // Get existing booked appointments for this doctor on this date
  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(targetDate);
  dayEnd.setHours(23, 59, 59, 999);

  const bookedAppointments = await Appointment.find({
    doctorId,
    status: { $ne: 'cancelled' },
    startTime: { $gte: dayStart, $lte: dayEnd },
  });

  // Filter out booked slots (overlap check)
  const availableSlots = allSlots.filter((slot) => {
    return !bookedAppointments.some((appt) => {
      return slot.startTime < appt.endTime && slot.endTime > appt.startTime;
    });
  });

  return availableSlots;
};

module.exports = { generateAvailableSlots };
