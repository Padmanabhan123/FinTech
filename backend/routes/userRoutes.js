const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protect routes requiring authentication
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
