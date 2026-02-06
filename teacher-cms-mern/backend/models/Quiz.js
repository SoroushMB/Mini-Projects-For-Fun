const mongoose = require('mongoose');

const QuestionBankSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QuestionSchema = new mongoose.Schema({
  questionBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionBank',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer'],
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  topic: {
    type: String
  },
  explanation: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QuizSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    order: Number,
    points: {
      type: Number,
      default: 1
    }
  }],
  timeLimit: {
    type: Number
  },
  passingScore: {
    type: Number,
    default: 60
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QuizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    answer: String
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  score: {
    type: Number
  },
  passed: {
    type: Boolean
  }
});

module.exports = {
  QuestionBank: mongoose.model('QuestionBank', QuestionBankSchema),
  Question: mongoose.model('Question', QuestionSchema),
  Quiz: mongoose.model('Quiz', QuizSchema),
  QuizAttempt: mongoose.model('QuizAttempt', QuizAttemptSchema)
};
