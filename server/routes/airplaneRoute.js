const express = require('express');
const router = express.Router();

const {
  createAirplane,
  getAllAirplanes,
  selektovaniAvion,
} = require('../controller/airplanecontroller');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentification');

router.post(
  '/create',
  authenticateUser,
  authorizePermissions('ADMIN_AVIO'),
  createAirplane
);

router.get(
  '/getAll',
  authenticateUser,
  authorizePermissions('ADMIN_AVIO'),
  getAllAirplanes
);

router.post(
  '/get',
  authenticateUser,
  authorizePermissions('ADMIN_AVIO'),
  selektovaniAvion
);
module.exports = router;
