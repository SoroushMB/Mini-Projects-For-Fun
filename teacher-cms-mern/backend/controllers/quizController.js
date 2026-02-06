const { QuestionBank, Question, Quiz, QuizAttempt } = require('../models/Quiz');
const Class = require('../models/Class');
const { generateQuestions } = require('../utils/openrouter');

exports.getQuestionBanks = async (req, res) => {
  try {
    const banks = await QuestionBank.find({ teacher: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: banks.length,
      data: banks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createQuestionBank = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const bank = await QuestionBank.create({
      teacher: req.user.id,
      name,
      description,
      category
    });

    res.status(201).json({
      success: true,
      data: bank
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const bank = await QuestionBank.findById(req.params.bankId);

    if (!bank) {
      return res.status(404).json({ success: false, message: 'Question bank not found' });
    }

    if (bank.teacher.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const questions = await Question.find({ questionBank: req.params.bankId })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const { questionText, questionType, options, correctAnswer, difficulty, topic, explanation } = req.body;

    const bank = await QuestionBank.findById(req.params.bankId);

    if (!bank) {
      return res.status(404).json({ success: false, message: 'Question bank not found' });
    }

    if (bank.teacher.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const question = await Question.create({
      questionBank: req.params.bankId,
      questionText,
      questionType,
      options,
      correctAnswer,
      difficulty,
      topic,
      explanation
    });

    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateQuestionsAI = async (req, res) => {
  try {
    const { bankId, topic, numQuestions, difficulty, questionType } = req.body;

    const bank = await QuestionBank.findById(bankId);

    if (!bank) {
      return res.status(404).json({ success: false, message: 'Question bank not found' });
    }

    if (bank.teacher.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const result = await generateQuestions(
      topic,
      numQuestions || 5,
      difficulty || 'medium',
      questionType || 'multiple_choice'
    );

    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate questions',
        error: result.error
      });
    }

    const savedQuestions = [];
    for (const q of result.questions) {
      const question = await Question.create({
        questionBank: bankId,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        topic: q.topic,
        explanation: q.explanation
      });
      savedQuestions.push(question);
    }

    res.status(201).json({
      success: true,
      count: savedQuestions.length,
      data: savedQuestions,
      raw: result.raw
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      const classes = await Class.find({ students: req.user.id });
      const classIds = classes.map(c => c._id);
      query.class = { $in: classIds };
    } else if (req.user.role === 'teacher') {
      query.createdBy = req.user.id;
    }

    const quizzes = await Quiz.find(query)
      .populate('class', 'name')
      .populate('createdBy', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('class', 'name')
      .populate('createdBy', 'name')
      .populate('questions.question');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (req.user.role === 'student') {
      const attempt = await QuizAttempt.findOne({
        quiz: quiz._id,
        student: req.user.id
      });

      return res.status(200).json({
        success: true,
        data: {
          ...quiz.toObject(),
          hasAttempted: !!attempt,
          attempt
        }
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { classId, title, description, questions, timeLimit, passingScore } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    if (classData.teacher.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const quiz = await Quiz.create({
      class: classId,
      title,
      description,
      createdBy: req.user.id,
      questions,
      timeLimit,
      passingScore
    });

    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitQuizAttempt = async (req, res) => {
  try {
    const { answers } = req.body;

    const quiz = await Quiz.findById(req.params.id)
      .populate('questions.question');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const existingAttempt = await QuizAttempt.findOne({
      quiz: quiz._id,
      student: req.user.id
    });

    if (existingAttempt) {
      return res.status(400).json({ success: false, message: 'You have already attempted this quiz' });
    }

    let totalScore = 0;
    let earnedScore = 0;

    quiz.questions.forEach(q => {
      totalScore += q.points;
      const studentAnswer = answers.find(a => a.questionId.toString() === q.question._id.toString());
      
      if (studentAnswer && studentAnswer.answer === q.question.correctAnswer) {
        earnedScore += q.points;
      }
    });

    const scorePercentage = (earnedScore / totalScore) * 100;
    const passed = scorePercentage >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user.id,
      answers,
      completedAt: new Date(),
      score: scorePercentage,
      passed
    });

    res.status(201).json({
      success: true,
      data: {
        attempt,
        earnedScore,
        totalScore,
        scorePercentage,
        passed
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizAttempts = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const attempts = await QuizAttempt.find({ quiz: req.params.id })
      .populate('student', 'name email')
      .sort('-completedAt');

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
