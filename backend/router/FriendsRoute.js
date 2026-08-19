const express = require('express');
const router = express.Router();

const { add_friend, get_friends, delete_friend } = require('../controller/friends');

const featchuser = require('../middleware/featchuser');

router.post('/add_friend/:friendId', featchuser, add_friend);
router.get('/get_friends', featchuser, get_friends);
router.delete('/delete_friend/:friendId', featchuser, delete_friend);

module.exports = router;