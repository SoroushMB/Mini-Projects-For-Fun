const User = require('../models/User');
const Class = require('../models/Class');
const Tuition = require('../models/Tuition');
const Presentation = require('../models/Presentation');
const { Homework, HomeworkSubmission } = require('../models/Homework');

exports.getStudents = async (req, res) => {
  try {
    const { classId } = req.query;
    let query = { role: 'student' };

    let students;
    if (classId) {
      const classData = await Class.findById(classId);
      if (!classData) {
        return res.status(404).json({ success: false, message: 'Class not found' });
      }
      students = await User.find({ _id: { $in: classData.students } });
    } else {
      students = await User.find(query);
    }

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const classes = await Class.find({ students: student._id }).populate('teacher', 'name');

    res.status(200).json({
      success: true,
      data: {
        student,
        classes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentStatus = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { classId } = req.query;

    const query = { student: studentId };
    if (classId) {
      query.class = classId;
    }

    const tuitions = await Tuition.find(query).populate('class', 'name');
    const presentations = await Presentation.find(query).populate('class', 'name');
    const homeworkSubmissions = await HomeworkSubmission.find({ student: studentId })
      .populate({
        path: 'homework',
        populate: { path: 'class', select: 'name' }
      });

    res.status(200).json({
      success: true,
      data: {
        tuitions,
        presentations,
        homeworkSubmissions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addTuition = async (req, res) => {
  try {
    const { classId, amount, dueDate, status, notes } = req.body;
    const studentId = req.params.id;

    const tuition = await Tuition.create({
      student: studentId,
      class: classId,
      amount,
      dueDate,
      status: status || 'pending',
      notes,
      paidAt: status === 'paid' ? new Date() : null
    });

    res.status(201).json({
      success: true,
      data: tuition
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTuition = async (req, res) => {
  try {
    const tuition = await Tuition.findByIdAndUpdate(
      req.params.tuitionId,
      { ...req.body, paidAt: req.body.status === 'paid' ? new Date() : undefined },
      { new: true, runValidators: true }
    );

    if (!tuition) {
      return res.status(404).json({ success: false, message: 'Tuition record not found' });
    }

    res.status(200).json({
      success: true,
      data: tuition
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addPresentation = async (req, res) => {
  try {
    const { classId, topic, presentedAt, grade, notes } = req.body;
    const studentId = req.params.id;

    const presentation = await Presentation.create({
      student: studentId,
      class: classId,
      topic,
      presentedAt: presentedAt || new Date(),
      grade,
      notes
    });

    res.status(201).json({
      success: true,
      data: presentation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHomework = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { classId } = req.query;

    const classes = await Class.find({ students: studentId }).select('_id');
    const classIds = classes.map(c => c._id);

    let query = { class: { $in: classIds } };
    if (classId) {
      query.class = classId;
    }

    const homework = await Homework.find(query)
      .populate('class', 'name')
      .populate('createdBy', 'name')
      .sort('-createdAt');

    const homeworkWithStatus = await Promise.all(
      homework.map(async (hw) => {
        const submission = await HomeworkSubmission.findOne({
          homework: hw._id,
          student: studentId
        });

        return {
          ...hw.toObject(),
          submission
        };
      })
    );

    res.status(200).json({
      success: true,
      data: homeworkWithStatus
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitHomework = async (req, res) => {
  try {
    const { homeworkId, content, fileUrl } = req.body;
    const studentId = req.params.id;

    if (req.user.id !== studentId && req.user.role !== 'teacher') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const homework = await Homework.findById(homeworkId);
    if (!homework) {
      return res.status(404).json({ success: false, message: 'Homework not found' });
    }

    let submission = await HomeworkSubmission.findOne({
      homework: homeworkId,
      student: studentId
    });

    if (submission) {
      submission.content = content;
      submission.fileUrl = fileUrl;
      submission.submittedAt = new Date();
      await submission.save();
    } else {
      submission = await HomeworkSubmission.create({
        student: studentId,
        homework: homeworkId,
        content,
        fileUrl
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.gradeHomework = async (req, res) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await HomeworkSubmission.findByIdAndUpdate(
      req.params.submissionId,
      { grade, feedback, status: 'graded' },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHomework = async (req, res) => {
  try {
    const { classId, title, description, dueDate } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    if (classData.teacher.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const homework = await Homework.create({
      class: classId,
      title,
      description,
      dueDate,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: homework
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
