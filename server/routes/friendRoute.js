const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/authentification');

const {
  sendRequestforFriendship,
  deliteFrendship,
  acceptFrendship,
  odbiPrijateljstvo,
  getAllFriends,
} = require('../controller/friendscontroller');
const middlewareWrapper = require('cors');

router.post('/sendRequest', authenticateUser, sendRequestforFriendship);

router.patch('/accept', authenticateUser, acceptFrendship);

router.delete('/povuci', authenticateUser, deliteFrendship, odbiPrijateljstvo);

router.delete('/odbi', authenticateUser, odbiPrijateljstvo);

router.get('/all/:user_id', getAllFriends);

module.exports = router;
