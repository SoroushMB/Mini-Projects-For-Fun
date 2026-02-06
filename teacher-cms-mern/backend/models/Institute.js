const mongoose = require('mongoose');

const InstituteSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please add an institute name']
  },
  description: {
    type: String
  },
  website: {
    type: String
  },
  logo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Institute', InstituteSchema);
