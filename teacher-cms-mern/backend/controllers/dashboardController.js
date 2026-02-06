const Class = require('../models/Class');
const { Homework, HomeworkSubmission } = require('../models/Homework');
const Tuition = require('../models/Tuition');
const Presentation = require('../models/Presentation');
const Institute = require('../models/Institute');
const InstituteStaff = require('../models/InstituteStaff');
const { Message } = require('../models/Message');

exports.getDashboard = async (req, res) => {
  try {
    const role = req.user.role;
    let dashboardData = {
      user: {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    };

    if (role === 'student') {
      const enrolledClasses = await Class.find({ students: req.user.id })
        .populate('teacher', 'name')
        .select('name schedule teacher');

      const classIds = enrolledClasses.map(c => c._id);

      const upcomingHomework = await Homework.find({
        class: { $in: classIds },
        dueDate: { $gte: new Date() }
      })
        .populate('class', 'name')
        .sort('dueDate')
        .limit(5);

      const pendingHomework = await Promise.all(
        upcomingHomework.map(async (hw) => {
          const submission = await HomeworkSubmission.findOne({
            homework: hw._id,
            student: req.user.id
          });
          return {
            ...hw.toObject(),
            hasSubmitted: !!submission
          };
        })
      );

      const presentations = await Presentation.find({
        student: req.user.id,
        class: { $in: classIds }
      })
        .populate('class', 'name')
        .sort('-presentedAt')
        .limit(5);

      dashboardData = {
        ...dashboardData,
        enrolledClasses: enrolledClasses.length,
        classes: enrolledClasses,
        upcomingHomework: pendingHomework.filter(h => !h.hasSubmitted),
        recentPresentations: presentations
      };
    } else if (role === 'teacher') {
      const classes = await Class.find({ teacher: req.user.id })
        .populate('students', 'name');

      const totalStudents = classes.reduce((sum, c) => sum + c.students.length, 0);

      const classIds = classes.map(c => c._id);

      const pendingHomework = await Homework.find({
        class: { $in: classIds },
        createdBy: req.user.id
      })
        .populate('class', 'name')
        .sort('-createdAt')
        .limit(5);

      const recentSubmissions = await HomeworkSubmission.find({
        homework: { $in: pendingHomework.map(h => h._id) },
        status: 'submitted'
      })
        .populate('student', 'name')
        .populate('homework', 'title')
        .sort('-submittedAt')
        .limit(5);

      dashboardData = {
        ...dashboardData,
        totalClasses: classes.length,
        totalStudents,
        classes: classes.map(c => ({
          id: c._id,
          name: c.name,
          studentCount: c.students.length
        })),
        recentHomework: pendingHomework,
        pendingGrading: recentSubmissions
      };
    } else if (role === 'institute_owner') {
      const institute = await Institute.findOne({ owner: req.user.id });

      if (institute) {
        const staff = await InstituteStaff.find({
          institute: institute._id,
          isActive: true
        }).populate('user', 'name email role');

        const classes = await Class.find({ institute: institute._id })
          .populate('teacher', 'name');

        const totalStudents = classes.reduce((sum, c) => sum + c.students.length, 0);

        dashboardData = {
          ...dashboardData,
          institute: {
            id: institute._id,
            name: institute.name,
            description: institute.description
          },
          totalStaff: staff.length,
          totalClasses: classes.length,
          totalStudents,
          staff: staff.map(s => ({
            id: s._id,
            name: s.user.name,
            email: s.user.email,
            role: s.role
          })),
          classes: classes.map(c => ({
            id: c._id,
            name: c.name,
            teacher: c.teacher.name,
            studentCount: c.students.length
          }))
        };
      }
    } else if (role === 'secretary' || role === 'consultant') {
      const staffRecord = await InstituteStaff.findOne({
        user: req.user.id,
        isActive: true
      }).populate('institute', 'name');

      if (staffRecord) {
        const tasks = await Message.find({
          conversation: { $exists: true }
        })
          .populate('sender', 'name')
          .sort('-sentAt')
          .limit(10);

        dashboardData = {
          ...dashboardData,
          institute: staffRecord.institute,
          role: staffRecord.role,
          recentMessages: tasks
        };
      }
    }

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
