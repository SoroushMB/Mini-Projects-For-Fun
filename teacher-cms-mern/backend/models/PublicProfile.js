const mongoose = require('mongoose');

const PublicProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  bio: {
    type: String
  },
  website: {
    type: String
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RatingSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PublicProfile',
    required: true
  },
  raterName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  ipAddress: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

RatingSchema.index({ profile: 1, ipAddress: 1 });

module.exports = {
  PublicProfile: mongoose.model('PublicProfile', PublicProfileSchema),
  Rating: mongoose.model('Rating', RatingSchema)
};
