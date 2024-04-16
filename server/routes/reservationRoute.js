const express = require('express');
const router = express.Router();

const {
  createReservation,
  reservedSeats,
  flightFromReservation,
  deleteAllReservationForFlight,
} = require('../controller/reservation');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentification');

router.post(
  '/create',
  authenticateUser,
  authorizePermissions('USER', 'ROOT', 'ADMIN_AVIO'),
  createReservation
);

router.get('/userReservation', authenticateUser, flightFromReservation);

router.delete(
  '/deleteAllForFlight/:flight_id',
  authenticateUser,
  authorizePermissions('USER', 'ADMIN_AVIO', 'ROOT'),
  deleteAllReservationForFlight
);

router.get(
  '/flight/:flight_id',
  authenticateUser,
  authorizePermissions('USER', 'ROOT', 'ADMIN_AVIO'),
  reservedSeats
);

module.exports = router;
