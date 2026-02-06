const { PublicProfile, Rating } = require('../models/PublicProfile');
const User = require('../models/User');
const Class = require('../models/Class');

exports.createPublicProfile = async (req, res) => {
  try {
    const { slug, bio, website, isPublic } = req.body;

    const existingProfile = await PublicProfile.findOne({ user: req.user.id });
    if (existingProfile) {
      return res.status(400).json({ success: false, message: 'Public profile already exists' });
    }

    const slugExists = await PublicProfile.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ success: false, message: 'Slug already taken' });
    }

    const profile = await PublicProfile.create({
      user: req.user.id,
      slug: slug.toLowerCase(),
      bio,
      website,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePublicProfile = async (req, res) => {
  try {
    const profile = await PublicProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Public profile not found' });
    }

    if (req.body.slug && req.body.slug !== profile.slug) {
      const slugExists = await PublicProfile.findOne({ slug: req.body.slug });
      if (slugExists) {
        return res.status(400).json({ success: false, message: 'Slug already taken' });
      }
    }

    const updated = await PublicProfile.findByIdAndUpdate(
      profile._id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const profile = await PublicProfile.findOne({ slug: req.params.slug })
      .populate('user', 'name email bio avatar');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    if (!profile.isPublic) {
      return res.status(403).json({ success: false, message: 'This profile is private' });
    }

    const classes = await Class.find({ teacher: profile.user._id })
      .select('name description schedule maxStudents students')
      .populate('institute', 'name');

    res.status(200).json({
      success: true,
      data: {
        profile,
        classes: classes.map(c => ({
          name: c.name,
          description: c.description,
          schedule: c.schedule,
          enrolledStudents: c.students.length,
          maxStudents: c.maxStudents,
          institute: c.institute
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRatings = async (req, res) => {
  try {
    const profile = await PublicProfile.findOne({ slug: req.params.slug });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const ratings = await Rating.find({ profile: profile._id })
      .sort('-createdAt')
      .select('-ipAddress');

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { raterName, rating, comment } = req.body;
    
    const profile = await PublicProfile.findOne({ slug: req.params.slug });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    if (!profile.isPublic) {
      return res.status(403).json({ success: false, message: 'This profile is private' });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;

    const recentRating = await Rating.findOne({
      profile: profile._id,
      ipAddress: ipAddress,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (recentRating) {
      return res.status(429).json({ 
        success: false, 
        message: 'You can only rate once per day' 
      });
    }

    const newRating = await Rating.create({
      profile: profile._id,
      raterName,
      rating,
      comment,
      ipAddress
    });

    const allRatings = await Rating.find({ profile: profile._id });
    const totalRatings = allRatings.length;
    const sumRatings = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRatings / totalRatings;

    profile.averageRating = averageRating;
    profile.totalRatings = totalRatings;
    await profile.save();

    res.status(201).json({
      success: true,
      data: {
        rating: newRating,
        averageRating: profile.averageRating,
        totalRatings: profile.totalRatings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
