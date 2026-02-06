const mongoose = require('mongoose');

const HomeworkSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  description: {
    type: String
  },
  dueDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HomeworkSubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  homework: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homework',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  fileUrl: {
    type: String
  },
  content: {
    type: String
  },
  status: {
    type: String,
    enum: ['submitted', 'graded'],
    default: 'submitted'
  },
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String
  }
});

HomeworkSubmissionSchema.index({ student: 1, homework: 1 }, { unique: true });

module.exports = {
  Homework: mongoose.model('Homework', HomeworkSchema),
  HomeworkSubmission: mongoose.model('HomeworkSubmission', HomeworkSubmissionSchema)
};
