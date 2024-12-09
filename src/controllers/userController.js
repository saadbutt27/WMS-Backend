const { signup, login } = require('../services/userService');

const signupUser = async (req, res) => {
  try {
    const user = await signup(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await login(email, password);
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };
