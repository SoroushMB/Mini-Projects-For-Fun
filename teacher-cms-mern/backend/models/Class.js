const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute'
  },
  name: {
    type: String,
    required: [true, 'Please add a class name']
  },
  description: {
    type: String
  },
  schedule: {
    type: String
  },
  maxStudents: {
    type: Number,
    default: 30
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Class', ClassSchema);
