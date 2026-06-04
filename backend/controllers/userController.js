const User = require('../models/User');
const Note = require('../models/Note');
const bcrypt = require('bcryptjs');
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    
    res.json({ id: updatedUser._id, name: updatedUser.name, email: updatedUser.email });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user;

    await Note.deleteMany({ userId });

    await User.findByIdAndDelete(userId);

    res.cookie('token', '', { httpOnly: true, expires: new Date(0), sameSite: 'strict' });

    res.status(200).json({ message: 'Account and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};