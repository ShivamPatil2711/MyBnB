const home = require('../models/home');
const mongoose = require('mongoose');
const user = require('../models/user');
const multer = require('multer');
const booking = require('../models/booking');
const cloudinary = require('cloudinary').v2;

// ────────────────────────────────────────────────
// Multer setup – memory storage for Cloudinary
// ────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
}).single('img'); // field name = 'img'

// Helper: Upload buffer to Cloudinary and return secure_url
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'mybnb/homes', // optional organization
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Helper: Extract public_id from Cloudinary secure_url
const extractPublicId = (url) => {
  if (!url) return null;
  // Example: https://res.cloudinary.com/dq1ce586s/image/upload/v1234567890/mybnb/homes/abc123.jpg
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;

  // Take everything after /upload/ up to the filename without extension
  const relevant = parts.slice(uploadIndex + 2); // skip version if present
  const filenameWithExt = relevant[relevant.length - 1];
  const publicIdWithFolder = relevant.slice(0, -1).concat(filenameWithExt.split('.')[0]).join('/');
  return publicIdWithFolder;
};

// ────────────────────────────────────────────────
// Existing routes without image changes
// ────────────────────────────────────────────────

exports.getAddHome = (req, res) => {
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

exports.getHostHome = async (req, res) => {
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
      registeredhomes: currentUser.listedhomes,
      pagetitle: 'My homes-lists',
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
    console.error('Error in getHostHome:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getEditHome = async (req, res) => {
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

exports.getBookedHomes = async (req, res) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized, please log in' });
    }
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const currentUser = await user.findById(userId);
    const homeIds = currentUser.listedhomes || [];

    const bookedHomes = await booking.find({ homeId: { $in: homeIds } })
      .populate({ path: 'userId', select: 'name email' })
      .populate({ path: 'homeId', select: 'housename price location img' });

    res.json({
      bookedhomes: bookedHomes,
      pagetitle: 'My Booked Homes',
      isLoggedIn: req.isLoggedIn,
      user: req.user || {},
    });
  } catch (error) {
    console.error('Error in getBookedHomes:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ────────────────────────────────────────────────
// Image-related routes – fully updated
// ────────────────────────────────────────────────

exports.postAddHome = [
  (req, res, next) => {
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

      const { housename, location, price, rate, des, latitude, longitude } = req.body;
      if (!housename || !location || !price || !rate || !des || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const imageUrl = await uploadToCloudinary(req.file.buffer);

      const newHome = new home({
        housename,
        location,
        price: Number(price),
        rate: Number(rate),
        des,
        img: imageUrl,
        latitude,
        longitude,
        userId: req.user._id,
      });

      const savedHome = await newHome.save();

      await user.findByIdAndUpdate(req.user._id, {
        $push: { listedhomes: savedHome._id },
      });

      res.status(201).json({ message: 'Home added successfully', home: savedHome });
    } catch (error) {
      console.error('Error in postAddHome:', error);
      res.status(500).json({ error: 'Failed to add home' });
    }
  },
];

exports.postEditHome = [
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || 'Upload error' });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.isLoggedIn || !req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { housename, price, location, rate, id, des, latitude, longitude } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid home ID' });
      }

      const updateData = {
        housename,
        price: Number(price),
        location,
        rate: Number(rate),
        des,
        latitude,
        longitude,
      };

      // If new image uploaded → replace old one
      if (req.file) {
        const newImageUrl = await uploadToCloudinary(req.file.buffer);
        updateData.img = newImageUrl;
      }

      const updatedHome = await home.findByIdAndUpdate(id, updateData, { new: true });
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
  },
];

exports.postDeleteHome = async (req, res) => {
  try {
    if (!req.isLoggedIn || !req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const homeId = req.params.homeId;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(homeId)) {
      return res.status(400).json({ error: 'Invalid home ID' });
    }

    const homeToDelete = await home.findById(homeId);
    if (!homeToDelete) {
      return res.status(404).json({ error: 'Home not found' });
    }

    // Delete image from Cloudinary if exists
    if (homeToDelete.img) {
      const publicId = extractPublicId(homeToDelete.img);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      }
    }

    await home.deleteOne({ _id: homeId });
    await user.updateOne({ _id: userId }, { $pull: { listedhomes: homeId } });

    res.json({
      message: 'Home and associated image deleted successfully',
      redirect: '/host/host-homes',
    });
  } catch (error) {
    console.error('Error in postDeleteHome:', error);
    res.status(500).json({ error: 'Server error' });
  }
};