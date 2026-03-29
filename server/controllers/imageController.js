const Image = require('../models/Image');
const Hospital = require('../models/Hospital');
const { uploadToCloudinary } = require('../middleware/upload');
const { AppError } = require('../middleware/errorHandler');

// @desc    Upload image for a hospital
// @route   POST /api/images/upload
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('Please upload an image', 400));

    const { hospitalId, category, tags } = req.body;
    if (!hospitalId) return next(new AppError('Hospital ID is required', 400));

    // Upload to Cloudinary
    let url, publicId;
    try {
      const result = await uploadToCloudinary(req.file.buffer, `healthprovida/${hospitalId}`);
      url = result.secure_url;
      publicId = result.public_id;
    } catch (cloudErr) {
      // Fallback: use a placeholder if Cloudinary not configured
      url = `https://via.placeholder.com/800x600?text=${encodeURIComponent(category || 'Hospital')}`;
      publicId = '';
    }

    const image = await Image.create({
      hospitalId,
      url,
      publicId,
      category: category || 'other',
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    });

    // Add image ref to hospital
    await Hospital.findByIdAndUpdate(hospitalId, {
      $push: { images: image._id },
    });

    res.status(201).json({ success: true, data: image });
  } catch (err) {
    next(err);
  }
};

// @desc    Get images (optionally filter by hospital, category, tag)
// @route   GET /api/images
exports.getImages = async (req, res, next) => {
  try {
    const { hospitalId, category, tag } = req.query;
    let query = {};

    if (hospitalId) query.hospitalId = hospitalId;
    if (category) query.category = category;
    if (tag) query.tags = tag;

    const images = await Image.find(query).sort({ uploadedAt: -1 });
    res.status(200).json({ success: true, count: images.length, data: images });
  } catch (err) {
    next(err);
  }
};
