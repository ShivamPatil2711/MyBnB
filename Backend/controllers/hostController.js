const home = require('../models/home');
const mongoose = require('mongoose');
const user = require('../models/user');
const multer = require('multer');
const path = require('path');
const booking =require('../models/booking');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/'); // Ensure folder exists and case matches filesystem
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
}).single('img');

exports.getAddHome = (req, res, next) => {
  try {
    res.json({
      pagetitle: 'addHome',
      editing: false,
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.postAddHome = [
  (req, res, next) => {
    // Wrap upload middleware to handle errors
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'Image size exceeds 5MB limit' });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image is required' });
      }

      // Validate required fields
      const { housename, location, price, rate, des, latitude, longitude } = req.body;
      if (!housename || !location || !price || !rate || !des || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
      }
const imageUrl = `https://mybnb-f13q.onrender.com/Uploads/${req.file.filename}`;
      const newHome = new home({
        housename,
        location,
      price: Number(price), // Explicit conversion
  rate: Number(rate),
        des,
        img: imageUrl,
        latitude,
        longitude,
        userId: req.user._id,
      });
     const savedHome= await newHome.save();
       const currentUser = await user.findById(req.user._id);
    if (currentUser) {
      currentUser.listedhomes.push(savedHome._id);
      await currentUser.save();
    }
      res.status(201).json({ message: 'Home added successfully', home: savedHome });
    } catch (error) {
      console.error('Error in postAddHome:', error);
      res.status(500).json({ error: 'Failed to add home' });
    }
  },
];

exports.getHostHome = async (req, res, next) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const currentUser = await user.findById(userId).populate('listedhomes');
        if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      registeredhomes:currentUser.listedhomes,
      pagetitle: 'My homes-lists',
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
    console.error('Error in getHostHome:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getEditHome = async (req, res, next) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';

    if (!mongoose.Types.ObjectId.isValid(homeId)) {
      return res.status(400).json({ error: 'Invalid home ID' });
    }

    const homeDetail = await home.findById(homeId);
    if (!homeDetail) {
      return res.status(404).json({ error: 'Home not found' });
    }

    res.json({
      home: homeDetail,
      pagetitle: 'EditHome',
      editing,
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
    console.error('Error in getEditHome:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.postEditHome = async (req, res, next) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const { housename, price, location, rate, id, des, password, latitude, longitude, img } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const updatedHome = await home.findByIdAndUpdate(
      id,
      { housename, price: Number(price), location, rate: Number(rate), des, password, latitude, longitude, img },
      { new: true }
    );
    if (!updatedHome) {
      return res.status(404).json({ error: 'Home not found' });
    }
    res.json({
      message: 'Home updated successfully',
      home: updatedHome,
      redirect: '/host/host-homes',
    });
  } catch (error) {
    console.error('Error in postEditHome:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.postDeleteHome = async (req, res, next) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const homeId = req.params.homeId;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(homeId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deletedHome = await home.deleteOne({ _id: homeId });
    if (deletedHome.deletedCount === 0) {
      return res.status(404).json({ error: 'Home not found' });
    }

    await user.updateOne(
      { _id: userId },
      { $pull: { listedhomes: homeId } }
    );

    res.json({
      message: 'Home deleted successfully',
      redirect: '/host/host-homes',
    });
  } catch (error) {
    console.error('Error in postDeleteHome:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getBookedHomes = async (req, res, next) => {
 try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const currentUser = await user.findById(userId);
    const homeids=currentUser.listedhomes || [];
const bookedHomes = await booking.find({
  homeId: { $in: homeids }
})
.populate({
  path: "userId",
  select: "name email"
})
.populate({
  path: "homeId",
  select: "housename price location img"
});


  console.log(bookedHomes);

    res.json({
      bookedhomes: bookedHomes,
      pagetitle: 'My Booked Homes',
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
console.error('Error in getBookedHomes:', error.message, error.stack);
    res.status(500).json({ error: 'Server error' });
  }
 
};
