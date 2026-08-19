const express = require('express');
const router = express.Router();

const featchuser = require('../middleware/featchuser');
const { getUserForSidebar, getMessages, sendMessage } = require('../controllers/message')


router.get("/users", featchuser, getUserForSidebar);
router.get("/:id", featchuser, getMessages);

router.post("/send/:id", featchuser, sendMessage);

module.exports = router;