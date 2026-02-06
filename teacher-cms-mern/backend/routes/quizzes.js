const express = require('express');
const {
  getQuestionBanks,
  createQuestionBank,
  getQuestions,
  addQuestion,
  generateQuestionsAI,
  getQuizzes,
  getQuiz,
  createQuiz,
  submitQuizAttempt,
  getQuizAttempts
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/banks')
  .get(protect, authorize('teacher', 'institute_owner'), getQuestionBanks)
  .post(protect, authorize('teacher', 'institute_owner'), createQuestionBank);

router
  .route('/banks/:bankId/questions')
  .get(protect, authorize('teacher', 'institute_owner'), getQuestions)
  .post(protect, authorize('teacher', 'institute_owner'), addQuestion);

router.post('/generate', protect, authorize('teacher', 'institute_owner'), generateQuestionsAI);

router
  .route('/')
  .get(protect, getQuizzes)
  .post(protect, authorize('teacher', 'institute_owner'), createQuiz);

router
  .route('/:id')
  .get(protect, getQuiz);

router.post('/:id/attempt', protect, authorize('student'), submitQuizAttempt);
router.get('/:id/attempts', protect, authorize('teacher', 'institute_owner'), getQuizAttempts);

module.exports = router;
