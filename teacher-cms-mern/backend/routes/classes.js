const express = require('express');
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  enrollStudent,
  unenrollStudent
} = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getClasses)
  .post(protect, authorize('teacher', 'institute_owner'), createClass);

router
  .route('/:id')
  .get(protect, getClass)
  .put(protect, authorize('teacher', 'institute_owner'), updateClass)
  .delete(protect, authorize('teacher', 'institute_owner'), deleteClass);

router.post('/:id/enroll', protect, authorize('teacher', 'institute_owner'), enrollStudent);
router.post('/:id/unenroll', protect, authorize('teacher', 'institute_owner'), unenrollStudent);

module.exports = router;
