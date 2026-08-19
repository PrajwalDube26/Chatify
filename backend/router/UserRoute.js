const express = require('express');
const router = express.Router();

const { register, login, user_profile, user_update, logout, getUserForSidebar, getUserFromSidebar } = require('../controller/user')
const featchuser = require('../middleware/featchuser');


router.post('/Signup', register);
router.post('/Login', login);

router.get("/getuser", featchuser, user_profile);
router.put("/edit_user", featchuser, user_update);

router.post("/logout", featchuser, logout);

router.get("/all_users", featchuser, getUserForSidebar);
router.get("/particular_user/:id", featchuser, getUserFromSidebar);

module.exports = router;