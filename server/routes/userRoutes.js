const express = require('express');
const router = express.Router();
const { updateUserProfile, uploadAvatar, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');


router.route('/').get(protect, searchUsers);

// Update profile details (username, email, password)
router.route('/profile').put(protect, updateUserProfile);

// Upload profile picture (Cloudinary) with custom Error Catching
router.post('/avatar', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("Cloudinary/Multer Error:", err);
      return res.status(400).json({ message: "Image upload failed", error: err.message || err });
    }
    next();
  });
}, uploadAvatar);

module.exports = router;