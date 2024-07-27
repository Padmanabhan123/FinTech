const Account = require('../models/Account');
const User = require('../models/User');

const createAccount = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const account = new Account({
      user: userId,
      balance: 0
    });

    await account.save();

    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findById(id).populate('user');

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAccount,
  getAccount
};
