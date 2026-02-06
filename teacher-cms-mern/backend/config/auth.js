module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  jwtExpire: '30d',
  roles: {
    STUDENT: 'student',
    TEACHER: 'teacher',
    INSTITUTE_OWNER: 'institute_owner',
    SECRETARY: 'secretary',
    CONSULTANT: 'consultant'
  }
};
