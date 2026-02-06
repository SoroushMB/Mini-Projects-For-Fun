const express = require('express');
const {
  createPublicProfile,
  updatePublicProfile,
  getPublicProfile,
  getRatings,
  addRating
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createPublicProfile);
router.put('/', protect, updatePublicProfile);

router.get('/public/:slug', getPublicProfile);
router.get('/public/:slug/ratings', getRatings);
router.post('/public/:slug/rate', addRating);

module.exports = router;
