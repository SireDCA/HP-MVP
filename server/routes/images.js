const express = require('express');
const router = express.Router();
const { uploadImage, getImages } = require('../controllers/imageController');
const { upload } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

router.post('/upload', protect, authorize('admin', 'doctor'), upload.single('image'), uploadImage);
router.get('/', getImages);

module.exports = router;
