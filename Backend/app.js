const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const errors = require('./controllers/errors');
const userrouter = require('./routes/userRouter');
const { hostrouter } = require('./routes/hostRouter');
const rootDir = require('./utils/pathutil');
const authrouter = require('./routes/authrouter');

const app = express();
const mongodbURL = 'mongodb://127.0.0.1:27017/MyHomes';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Replace with secure key in production

// CORS configuration for frontend at http://localhost:5173
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Middleware for parsing cookies and request bodies
app.use(cookieParser());
app.use(express.static(path.join(rootDir, 'public')));
app.use(express.json()); // Parse JSON bodies for API
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/Uploads', express.static('Uploads'));

// Authentication middleware to verify JWT
app.use((req, res, next) => {
  const token = req.cookies.Usercookie;
  if (!token) {
    req.isLoggedIn = false;
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.isLoggedIn = true;
    req.user = {
      _id: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
    };
  } catch (error) {
    console.error('JWT verification error:', error);
    req.isLoggedIn = false;
    req.user = null;
  }
  next();
});

// Public routes
app.use(authrouter);
app.use(userrouter);

// Protected routes (require authentication)
app.use((req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized, please log in' });
  }
});
app.use('/Uploads', express.static('Uploads'));
app.use(hostrouter);

// Error handling for 404
app.use(errors.error404);

// MongoDB connection and server startup
mongoose
  .connect(mongodbURL)
  .then(() => {
    console.log('Connected to Mongo');
    app.listen(4002, () => {
      console.log('Server running on http://localhost:4002');
    });
  })
  .catch((err) => {
    console.error('ERROR OCCURRED', err);
  });
