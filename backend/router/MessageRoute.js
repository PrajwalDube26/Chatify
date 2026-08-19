const express = require('express');
const router = express.Router();

const featchuser = require('../middleware/featchuser');
const { sendMessage, getMessages } = require('../controller/message')

router.post("/send/:id", featchuser, sendMessage);
router.get("/:id", featchuser, getMessages);

module.exports = router;