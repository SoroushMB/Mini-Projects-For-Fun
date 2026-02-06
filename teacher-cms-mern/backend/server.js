const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/students', require('./routes/students'));
app.use('/api/institute', require('./routes/institute'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/quizzes', require('./routes/quizzes'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Teacher CMS API',
    version: '1.0.0'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
