const home = require('../models/home');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const user = require('../models/user');
const booking =require('../models/booking');
exports.getHomes = async (req, res, next) => {
  try {
    const registeredhomes = await home.find();

    let favourites = [];

    if (req.isLoggedIn && req.user) {
      const currentUser = await user.findById(req.user._id);
      if (currentUser) {
        favourites = currentUser.favourites; // 👈 JUST RETURN ARRAY
      }
    }
    res.json({
      registeredhomes,
      favourites,        // 👈 frontend decides logic
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
    console.error('Error in index page:', error);
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
   const bookings = await booking.find({
  homeId: new ObjectId(homeId),
  "reviews": { $exists: true }
})
.populate("userId") 
.select("reviews date userId -_id");

// Transform the results so the frontend gets a clean array
const cleanReviews = bookings.map(b => ({
  rating: b.reviews.rating,
  comment: b.reviews.comment,
  guestName:  b.userId.FirstName+' '+b.userId.LastName , 
  date: b.date
  // If populate fails or user is deleted, it defaults to 'Anonymous Guest'
}));
    if (!host) {
    }
    if (!homeDetail) {
      return res.status(404).json({ error: 'Home not found' });
    }

    res.json({
      home: {
        ...homeDetail._doc,
       
      },
      host: host,
      reviews: cleanReviews,
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
    console.error('Error fetching home details:', error);
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
exports.postBooking = async (req, res) => {
  try {
    // 🔐 Auth check
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }

    const { homeId, name, age, email, checkin, checkout } = req.body;
    const userId = req.user._id;

    // 🔍 ID validation
    if (
      !mongoose.Types.ObjectId.isValid(homeId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    // 🔍 Required fields
    if (!checkin || !checkout) {
      return res.status(400).json({
        error: 'Check-in and check-out dates are required',
      });
    }

    // 🔥 DATE VALIDATION
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    if (checkinDate <= today) {
      return res.status(400).json({
        error: 'Check-in date must be after today',
      });
    }

    if (checkoutDate < checkinDate) {
      return res.status(400).json({
        error: 'Check-out must be after or equal to check-in',
      });
    }

    // 🔍 Check user exists
    const currentUser = await user.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 🔥 OVERLAP CHECK (MOST IMPORTANT PART)
    const overlappingBooking = await booking.findOne({
      homeId,
      checkin: { $lt: checkoutDate },  // existing.checkin < new.checkout
      checkout: { $gt: checkinDate },  // existing.checkout > new.checkin
    });

    if (overlappingBooking) {
      return res.status(400).json({
        error: 'Selected dates are already booked. Please choose different dates.',
      });
    }

    // ✅ CREATE BOOKING
    const newBooking = new booking({
      userId,
      homeId,
      name,
      age,
      email,
      checkin: checkinDate,
      checkout: checkoutDate,
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: savedBooking,
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.postAddToFavourites = async (req, res) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }

    const homeId = req.body.id;
    const userId = req.user._id;

    if (
      !mongoose.Types.ObjectId.isValid(homeId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const currentUser = await user.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 🔥 CHECK if already added
    const alreadyAdded = currentUser.favourites.includes(homeId);

    if (!alreadyAdded) {
      currentUser.favourites.push(homeId);
      await currentUser.save();
    }

    res.json({
          alreadyadded: alreadyAdded, // 👈 FRONTEND SIGNAL
    });
  } catch (error) {
    console.error('Error adding to favourites:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.postCancelBooking = async (req, res, next) => {
    try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const bookingId = req.params.bookingId;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(bookingId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    } 
    const bookingToCancel = await booking.findOne({ _id: bookingId, userId });
    if (!bookingToCancel) { 
      return res.status(404).json({ error: 'Booking not found' });
    } 
    await booking.deleteOne({ _id: bookingId });
    res.json({ message: 'Booking cancelled successfully', redirect: '/bookings' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Server error' });
  }

}

exports.postAddReview = async (req, res, next) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }

    const { bookingId, homeId, rating, comment } = req.body;
    const userId = req.user._id;

    if (
      !mongoose.Types.ObjectId.isValid(bookingId) ||
      !mongoose.Types.ObjectId.isValid(homeId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const bookingToReview = await booking.findOne({ _id: bookingId});
    if (!bookingToReview) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    bookingToReview.reviews.rating = rating;
    bookingToReview.reviews.comment = comment;
    await bookingToReview.save();

    res.status(201).json({
      message: 'Review added successfully',
      booking: bookingToReview,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Server error' });
  }
};




