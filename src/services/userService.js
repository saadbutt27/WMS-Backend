const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signup = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;
  const user = await User.create(userData);
  return user;
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  return { token, user };
};


const getAllUsers = async () => {
  const users = await User.findAll();  // Assuming you're using Sequelize ORM
  return users;
};

module.exports = { signup, login, getAllUsers };