const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// FORCE dotenv to look specifically in the server folder
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Debugging: Print to terminal to prove the server sees your keys
console.log('--- CLOUDINARY CONFIG CHECK ---');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'MISSING');
console.log('API Key:', process.env.CLOUDINARY_API_KEY || 'MISSING');
console.log('API Secret Loaded?', !!process.env.CLOUDINARY_API_SECRET);
console.log('-------------------------------');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ark-fitness', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };