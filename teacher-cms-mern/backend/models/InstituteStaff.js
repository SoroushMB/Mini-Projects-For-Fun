const mongoose = require('mongoose');

const InstituteStaffSchema = new mongoose.Schema({
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['teacher', 'secretary', 'consultant'],
    required: true
  },
  hiredAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

InstituteStaffSchema.index({ institute: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('InstituteStaff', InstituteStaffSchema);
