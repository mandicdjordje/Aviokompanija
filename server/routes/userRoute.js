const express = require('express');
const router = express.Router();

const {
  updateUser,
  getAllUsers,
  getCurrentInfo,
  paginateUsers,
  getCurrentUser,
  getUser,
  getUsersInfo,
  getAdmin,
  removeAdmin,
} = require('../controller/usercontroller');

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentification');

router.patch('/updateUser', authenticateUser, updateUser);

router.get('/', authenticateUser, getUsersInfo);

router.get('/info', authenticateUser, getCurrentUser);
router.get('/all', authenticateUser, getAllUsers);
router.get('/current', authenticateUser, getCurrentInfo);
router.get('/:user_id', authenticateUser, getUser);

router.get(
  '/admin_role/:admin_status',
  authenticateUser,
  authorizePermissions('ROOT'),
  getAdmin
);

router.patch(
  '/removeAdmin/:user_id',
  authenticateUser,
  authorizePermissions('ROOT'),
  removeAdmin
);

module.exports = router;
