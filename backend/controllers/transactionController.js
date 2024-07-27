// transactionController.js
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

const createTransaction = async (req, res) => {
  try {
    const { accountId, amount, type } = req.body;

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (type === 'withdrawal' && account.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    const transaction = new Transaction({
      user: req.user._id, // Assuming you have authenticated user in req.user
      account: accountId,
      amount,
      type
    });

    await transaction.save();

    // Update account balance
    account.balance += type === 'deposit' ? amount : -amount;
    await account.save();

    res.status(201).json({ message: 'Transaction created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTransaction
};
