const express = require('express');
const {
  getStudents,
  getStudent,
  getStudentStatus,
  addTuition,
  updateTuition,
  addPresentation,
  getHomework,
  submitHomework,
  gradeHomework,
  createHomework
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getStudents);
router.get('/:id', protect, getStudent);
router.get('/:id/status', protect, getStudentStatus);

router.post('/:id/tuition', protect, authorize('teacher', 'institute_owner', 'secretary'), addTuition);
router.put('/tuition/:tuitionId', protect, authorize('teacher', 'institute_owner', 'secretary'), updateTuition);

router.post('/:id/presentation', protect, authorize('teacher', 'institute_owner'), addPresentation);

router.get('/:id/homework', protect, getHomework);
router.post('/:id/homework/submit', protect, submitHomework);
router.put('/homework/:submissionId/grade', protect, authorize('teacher', 'institute_owner'), gradeHomework);

router.post('/homework', protect, authorize('teacher', 'institute_owner'), createHomework);

module.exports = router;
