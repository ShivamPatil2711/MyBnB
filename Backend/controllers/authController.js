const User = require('../models/user');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }
    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email, userType: existingUser.userType },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' }
    );
    res.cookie('Usercookie', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });
    const userWithoutPassword = {
      _id: existingUser._id,
      email: existingUser.email,
      FirstName: existingUser.FirstName,
      LastName: existingUser.LastName,
      userType: existingUser.userType,
    };
    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    res.clearCookie('Usercookie', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.postSignup = [
  check('FirstName').trim().isLength({ min: 2 }).withMessage('First Name should be at least 2 characters long').matches(/^[A-Za-z\s]+$/).withMessage('First Name should contain only alphabets'),
  check('LastName').matches(/^[A-Za-z\s]*$/).withMessage('Last Name should contain only alphabets'),
  check('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  check('password').isLength({ min: 4 }).withMessage('Password should be at least 4 characters long').matches(/[A-Z]/).withMessage('Password should contain at least one uppercase letter').matches(/[a-z]/).withMessage('Password should contain at least one lowercase letter').matches(/[0-9]/).withMessage('Password should contain at least one number').matches(/[!@&]/).withMessage('Password should contain at least one special character').trim(),
  check('confirmPassword').trim().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  check('userType').notEmpty().withMessage('Please select a user type').isIn(['guest', 'host']).withMessage('Invalid user type'),
  check('terms').notEmpty().withMessage('Please accept the terms and conditions').custom((value) => {
    if (value !== 'on') {
      throw new Error('Please accept the terms and conditions');
    }
    return true;
  }),
  async (req, res, next) => {
    try {
      const { FirstName, LastName, email, password, userType } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errorMessages: errors.array().map((error) => error.msg),
          oldInput: { FirstName, LastName, email, password: '', userType },
          pagetitle: 'signup-page',
          isLoggedIn: false,
          user: {},
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        FirstName: FirstName || '',
        LastName: LastName || '',
        email: email || '',
        password: hashedPassword,
        userType: userType || '',
      });
      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully', redirect: '/login-page' });
    } catch (error) {
      console.error('Error while registering user:', error);
      return res.status(500).json({
        errorMessages: ['An error occurred while registering. Please try again later.'],
        oldInput: { FirstName: req.body.FirstName || '', LastName: req.body.LastName || '', email: req.body.email || '', password: '', userType: req.body.userType || '' },
        pagetitle: 'signup-page',
        isLoggedIn: false,
        user: {},
      });
    }
  },
];

exports.checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.Usercookie;
    if (!token) {
      return res.status(200).json({ isLoggedIn: false, user: null });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.userId).select('email userType _id');
    if (!user) {
      res.clearCookie('Usercookie', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
      return res.status(200).json({ isLoggedIn: false, user: null });
    }
    return res.status(200).json({ isLoggedIn: true, user: { email: user.email, userType: user.userType, _id: user._id } });
  } catch (error) {
    console.error('Error in checkAuth:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getProfile = async (req, res, next) => {
  try {
    const token = req.cookies.Usercookie;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.userId);
        if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}