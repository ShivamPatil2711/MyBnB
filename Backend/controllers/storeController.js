const home = require('../models/home');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const user = require('../models/user');
const booking =require('../models/booking');
exports.getHomes = async (req, res, next) => {
  try {
    const registeredhomes = await home.find();
    res.json({
      registeredhomes,
      isLoggedIn: req.isLoggedIn,
    });
  } catch (error) {
    console.error('Error fetching homes:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBooking = async (req, res, next) => {
  const userId = req.user._id;
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const bookings = await booking.find({ userId }).populate("homeId");
    if (!bookings) {
      return res.status(404).json({ error: 'No bookings found' });
    }
    res.json({
      bookings,
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const registeredhomes = await home.find();
    res.json({
      registeredhomes,
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
    console.error('Error in index page:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFavouritelist = async (req, res, next) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const currentUser = await user.findById(userId).populate('favourites');
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      favouriteHomes: currentUser.favourites,
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
    console.error('Error in getFavouritelist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getHomesDetails = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    if (!mongoose.Types.ObjectId.isValid(homeId)) {
      return res.status(400).json({ error: 'Invalid home ID' });
    }
    const homeDetail = await home.findById(homeId);
    const host = await user.findById(homeDetail.userId);
    if (!host) {
      console.log(`No host found`);
    }
    if (!homeDetail) {
      return res.status(404).json({ error: 'Home not found' });
    }

    res.json({
      home: {
        ...homeDetail._doc,
        latitude: homeDetail.latitude,
        longitude: homeDetail.longitude
      },
      host: host,
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
    console.error('Error fetching home details:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.postAddToFavourites = async (req, res, next) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const homeId = req.body.id;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(homeId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const currentUser = await user.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!currentUser.favourites.includes(homeId)) {
      currentUser.favourites.push(homeId);
      await currentUser.save();
    }
      res.json({ message: 'Added to favorites', redirect: '/favourite-list' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.postDeleteFavourites = async (req, res, next) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const homeId = req.body.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(homeId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const currentUser = await user.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    currentUser.favourites = currentUser.favourites.filter(
      (favId) => favId.toString() !== homeId
    );

    await currentUser.save();
    res.json({ message: 'Removed from favorites', redirect: '/favourite-list' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.postBooking = async (req, res, next) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const homeId = req.body.homeId;
    const userId = req.user._id;
    const { name, age, email, checkin, checkout } = req.body; // Removed phone from destructuring
    if (!mongoose.Types.ObjectId.isValid(homeId) || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid homeId or userId");
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const currentUser = await user.findById(userId); // Fixed model name to User
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newbooking = new booking({ // Fixed model name to Booking
      userId,
      homeId,
      name,
      age,
      email,
       checkin,
      checkout
    });
    const bookedHome = await newbooking.save(); // Fixed variable name to bookedHome
    if (!bookedHome) {
      return res.status(500).json({ error: 'Failed to create booking' });
    }
    res.status(201).json({ booking: bookedHome, message: 'Booking created successfully' }); // Updated to return bookedHome
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.postAddToFavourites = async (req, res, next) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const homeId = req.body.id;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(homeId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const currentUser = await user.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!currentUser.favourites.includes(homeId)) {
      currentUser.favourites.push(homeId);
      await currentUser.save();
    }
      res.json({ message: 'Added to favorites', redirect: '/favourite-list' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Server error' });
      }
  };


