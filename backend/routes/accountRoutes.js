const express = require('express');
const accountController = require('../controllers/accountController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, accountController.createAccount);
router.get('/:id', auth, accountController.getAccount);

module.exports = router;
