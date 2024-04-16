const express = require('express');
const router = express.Router();

const {
  createFlight,
  getAllFlights,
  getAirplane_from_flight,
  getFlight,
  getFlights,
  sendFriendsRequestForFlight,
  getInvitations,
  getUsersInvitations,
  acceptFriendRequest,
  declineFriendRequest,
  searchFlights,
} = require('../controller/flightscontroller');

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentification');

router.post(
  '/create',
  authenticateUser,
  authorizePermissions('ADMIN_AVIO'),
  createFlight
);
router.get('/getAll', getAllFlights);

router.post(
  '/getAirplane',
  authenticateUser,
  authorizePermissions('USER', 'ADMIN_AVIO', 'ROOT'),
  getAirplane_from_flight
);

router.post(
  '/sendinvitation',
  authenticateUser,
  authorizePermissions('USER'),
  sendFriendsRequestForFlight
);

router.get(
  '/getInvitations',
  authenticateUser,
  authorizePermissions('USER'),
  getInvitations
);
router.get(
  '/getUsersInvitations',
  authenticateUser,
  authorizePermissions('USER'),
  getUsersInvitations
);

router.patch('/invitation/:invitation', authenticateUser, acceptFriendRequest);
router.delete(
  '/invitation/delete/:invitation',
  authenticateUser,
  declineFriendRequest
);

router.get('/searchFlights', authenticateUser, searchFlights);

router.get('/', authenticateUser, getFlights);

router.get('/:flight_id', getFlight);

module.exports = router;
