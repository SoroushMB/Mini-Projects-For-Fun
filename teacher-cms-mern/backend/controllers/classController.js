const Class = require('../models/Class');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

exports.getClasses = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      query.students = req.user.id;
    } else if (req.user.role === 'teacher') {
      query.teacher = req.user.id;
    }

    const classes = await Class.find(query)
      .populate('teacher', 'name email')
      .populate('institute', 'name')
      .populate('students', 'name email');

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('teacher', 'name email phone bio')
      .populate('institute', 'name description')
      .populate('students', 'name email');

    if (!classData) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { name, description, schedule, maxStudents, institute } = req.body;

    const classData = await Class.create({
      teacher: req.user.id,
      name,
      description,
      schedule,
      maxStudents,
      institute
    });

    res.status(201).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    let classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    if (classData.teacher.toString() !== req.user.id && req.user.role !== 'institute_owner') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this class' });
    }

    classData = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    if (classData.teacher.toString() !== req.user.id && req.user.role !== 'institute_owner') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this class' });
    }

    await classData.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.enrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const classId = req.params.id;

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    if (classData.students.length >= classData.maxStudents) {
      return res.status(400).json({ success: false, message: 'Class is full' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(400).json({ success: false, message: 'Invalid student' });
    }

    if (classData.students.includes(studentId)) {
      return res.status(400).json({ success: false, message: 'Student already enrolled' });
    }

    classData.students.push(studentId);
    await classData.save();

    await Enrollment.create({
      student: studentId,
      class: classId,
      status: 'active'
    });

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unenrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const classId = req.params.id;

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    classData.students = classData.students.filter(id => id.toString() !== studentId);
    await classData.save();

    await Enrollment.findOneAndUpdate(
      { student: studentId, class: classId },
      { status: 'dropped' }
    );

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
