const express = require('express');
const {
  createInstitute,
  getMyInstitute,
  updateInstitute,
  hireStaff,
  getStaff,
  removeStaff
} = require('../controllers/instituteController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('teacher'), createInstitute);
router.get('/me', protect, getMyInstitute);
router.put('/me', protect, authorize('institute_owner'), updateInstitute);

router.post('/hire', protect, authorize('institute_owner'), hireStaff);
router.get('/staff', protect, authorize('institute_owner'), getStaff);
router.delete('/staff/:id', protect, authorize('institute_owner'), removeStaff);

module.exports = router;
