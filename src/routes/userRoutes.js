// routes/userRouter.js
const express = require('express');
const { signupUser, loginUser, getUsers } = require('../controllers/userController');

const router = express.Router();

// Prefix all routes with /api/users
router.post('/signup', signupUser);

router.post('/login', loginUser);

router.get('/', getUsers);  // Update this to use '/' instead of '/users'

module.exports = router;
