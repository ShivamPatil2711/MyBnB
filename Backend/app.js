const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const errors = require('./controllers/errors');

const userrouter = require('./routes/userRouter');
const { hostrouter } = require('./routes/hostRouter');
const authrouter = require('./routes/authrouter');

require('dotenv').config();

const app = express();

const MONGODB_URL = process.env.MONGODB_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 4003;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 🔐 CORS CONFIG
const allowedOrigins = [
  'http://localhost:5173',
  FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman / curl

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.options('*', cors());

// 🧩 Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔐 JWT middleware
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return next();

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
  } catch {
    req.isLoggedIn = false;
    req.user = null;
  }

  next();
});

// 🌍 Public routes
app.use(authrouter);
app.use(userrouter);

// 🔒 Protected routes
app.use((req, res, next) => {
  if (req.isLoggedIn) return next();
  return res.status(401).json({ error: 'Unauthorized, please log in' });
});

app.use(hostrouter);

// ❌ 404
app.use(errors.error404);

// 🚀 Start server
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('Connected to Mongo');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
  });
