const mongoose = require('mongoose');

const PresentationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  topic: {
    type: String,
    required: [true, 'Please add a topic']
  },
  presentedAt: {
    type: Date,
    default: Date.now
  },
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Presentation', PresentationSchema);
