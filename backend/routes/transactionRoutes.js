// transactionRoutes.js
const express = require('express');
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, transactionController.createTransaction);

// Get all transactions for a user
router.get('/user', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single transaction by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
