const home = require('../models/home');
const mongoose = require('mongoose');
const user = require('../models/user');
const multer = require('multer');
const booking =require('../models/booking');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
}).single('img');
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'bnb-homes' },
      (err, result) => {
        if (result) resolve(result);
        else reject(err);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

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
      const { housename, street, city, pinCode, price, des} = req.body;
      if (!housename || !street || !city || !pinCode || !price || !des ) {
        return res.status(400).json({ error: 'All fields are required' });
      }
            const result = await uploadToCloudinary(req.file.buffer);
           
      const newHome = new home({
        housename,
        street,
        city,
        pinCode,
      price: Number(price), // Explicit conversion
        des,
img: {
  url: result.secure_url,
  public_id: result.public_id,
},
       
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

exports.postEditHome = [
  // 🔑 Multer middleware (REQUIRED for FormData + image)
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

  // 🔑 Actual controller
  async (req, res) => {
    try {
      if (!req.isLoggedIn || !req.user) {
        return res.status(401).json({ error: 'Unauthorized, please log in' });
      }

      const userId = req.user._id;
      const { id, housename, street, city, pinCode, price, des } = req.body;


      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid home ID' });
      }

      if (!housename || !street || !city || !pinCode || !price) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const existingHome = await home.findById(id);

      if (!existingHome) {
        return res.status(404).json({ error: 'Home not found' });
      }

      if (existingHome.userId.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updateData = {
        housename: housename.trim(),
        street: street.trim(),
        city: city.trim(),
        pinCode: pinCode.trim(),
        price: Number(price),
        des: des ? des.trim() : undefined,
      };

      // 🔥 Update image ONLY if new image sent
      if (req.file) {
        // delete old image
        if (existingHome.img?.public_id) {
          await deleteFromCloudinary(existingHome.img.public_id);
        }

        const result = await uploadToCloudinary(req.file.buffer);

        updateData.img = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }

      const updatedHome = await home.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        message: 'Home updated successfully',
        home: updatedHome,
        redirect: '/host/host-homes',
      });

    } catch (error) {
      console.error('Error in postEditHome:', error);
      res.status(500).json({
        error: 'Server error while updating home',
        details:
          process.env.NODE_ENV === 'development'
            ? error.message
            : undefined,
      });
    }
  }
];


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
 // 🔥 1. Find home FIRST
    const homeToDelete = await home.findById(homeId);
    if (!homeToDelete) {
      return res.status(404).json({ error: 'Home not found' });
    }

    // 🔥 2. Delete image from Cloudinary
    if (homeToDelete.img?.public_id) {
      await deleteFromCloudinary(homeToDelete.img.public_id);
    }

    // 🔥 3. Delete home from DB
    await home.deleteOne({ _id: homeId });
    

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
  select: "housename price city img"
});


 

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
