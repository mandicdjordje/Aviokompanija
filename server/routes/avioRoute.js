const express = require('express');
const router = express.Router();

const {
  createCompany,
  createAdmin,
  removeAdmin,
  getAllCompanies,
  
} = require('../controller/aircompanycontroller');

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentification');

router.post(
  '/createCompany',
  authenticateUser,
  authorizePermissions('ROOT'),
  createCompany
);

router.patch(
  '/createAdmin',
  authenticateUser,
  authorizePermissions('ROOT'),
  createAdmin
);

router.post(
  '/removeAdmin',
  authenticateUser,
  authorizePermissions('ROOT'),
  removeAdmin
);
router.get('/all', authenticateUser, getAllCompanies);
module.exports = router;
