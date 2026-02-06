# Teacher/Institute CMS - MERN Stack

A comprehensive Content Management System for teachers, students, and educational institutes built with MongoDB, Express.js, React, and Node.js.

## Features

### Multi-Role Authentication System
- **Roles**: Student, Teacher, Institute Owner, Secretary, Consultant
- JWT-based authentication
- Protected routes with role-based access control

### Dashboard (Summary Section)
Role-specific dashboards showing:
- **Teachers**: Classes taught, student count, pending grading
- **Students**: Enrolled classes, upcoming homework, presentations
- **Institute Owners**: Institute overview, staff list, all classes
- **Secretary/Consultant**: Assigned tasks, messages

### Class Management
- Create and manage classes
- Enroll/unenroll students
- Track class schedules and capacity
- View class details and student lists

### Student Management
Per-student tracking includes:
- **Tuition**: Payment status, amounts, due dates
- **Presentations**: Topics, grades, dates
- **Homework**: Assignments, submissions, grades
- Student detail view with full status overview

### Institute System
- Convert teacher accounts to Institute Owner
- Hire Teachers, Secretaries, and Consultants
- Manage staff (view, remove)
- Staff roles and permissions

### Messaging System
- Internal messaging between institute members
- Conversation threads
- Message history
- Unread message indicators

### Public Profiles with Ratings
- Public pages accessible without authentication
- Profile shows: name, bio, classes offered, ratings
- Rating system: 1-5 stars + comments
- Spam protection via IP tracking

### Quiz System with AI Generation
- **Question Bank**: Create and organize questions
- **Quiz Builder**: Create quizzes, set time limits and passing scores
- **AI Quiz Generation**: 
  - Uses OpenRouter API with free models
  - Generate questions by topic and difficulty
  - Auto-save to question bank
- **Quiz Taking**: Students take quizzes, auto-grading, score tracking

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Axios** - HTTP client for OpenRouter API

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management

### AI Integration
- **OpenRouter** - AI quiz generation
- Free models: `google/gemma-2-9b-it:free`, `microsoft/phi-3-mini-128k-instruct:free`

## Project Structure

```
teacher-cms-mern/
├── backend/
│   ├── config/          # DB and auth configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth and upload middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # OpenRouter integration
│   ├── uploads/         # File uploads directory
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios configuration
│   │   ├── components/  # React components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   └── vite.config.js
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/teacher_cms
JWT_SECRET=your_jwt_secret_key_here
OPENROUTER_API_KEY=your_openrouter_api_key
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Classes
- `GET /api/classes` - List classes
- `POST /api/classes` - Create class
- `GET /api/classes/:id` - Get class details
- `POST /api/classes/:id/enroll` - Enroll student

### Students
- `GET /api/students` - List students
- `GET /api/students/:id` - Get student details
- `GET /api/students/:id/status` - Get student status
- `POST /api/students/:id/tuition` - Add tuition payment

### Institute
- `POST /api/institute` - Create institute
- `GET /api/institute/me` - Get my institute
- `POST /api/institute/hire` - Hire staff

### Messaging
- `GET /api/messages/conversations` - List conversations
- `POST /api/messages/conversations/:id` - Send message

### Quizzes
- `GET /api/quizzes/banks` - List question banks
- `POST /api/quizzes/generate` - AI generate questions
- `POST /api/quizzes` - Create quiz
- `POST /api/quizzes/:id/attempt` - Submit quiz attempt

### Public Profiles
- `GET /api/profiles/public/:slug` - Get public profile (no auth)
- `POST /api/profiles/public/:slug/rate` - Add rating (no auth)

## User Roles

### Student
- View enrolled classes
- Access homework assignments
- Submit homework
- Take quizzes
- View presentations and grades

### Teacher
- Create and manage classes
- Enroll students
- Create homework assignments
- Grade submissions
- Create quizzes
- Use AI quiz generation
- Track student progress
- Create institute (convert to Institute Owner)

### Institute Owner
- All teacher permissions
- Hire staff (teachers, secretaries, consultants)
- Manage staff
- View institute overview
- Access all classes in institute

### Secretary
- View institute information
- Manage student records
- Track tuition payments
- Internal messaging

### Consultant
- View institute information
- Internal messaging
- Access assigned tasks

## OpenRouter AI Integration

The system uses OpenRouter's free AI models for quiz generation:

### Setup
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your API key
3. Add to `.env`: `OPENROUTER_API_KEY=your_key`

### Usage
1. Go to Question Banks page
2. Select or create a question bank
3. Click "AI Generate Questions"
4. Enter topic, number of questions, and difficulty
5. Review generated questions
6. Questions are automatically saved to the bank

### Supported Models
- `google/gemma-2-9b-it:free`
- `microsoft/phi-3-mini-128k-instruct:free`

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
```

## Database Schema

### User
- email, password, name, role, phone, bio, avatar

### Class
- teacher, institute, name, description, schedule, maxStudents, students[]

### Tuition
- student, class, amount, dueDate, status, paidAt

### Homework
- class, title, description, dueDate, createdBy

### Quiz
- class, title, questions[], timeLimit, passingScore

### Question
- questionBank, questionText, questionType, options[], correctAnswer, difficulty

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues, questions, or contributions, please create an issue on GitHub.

## Acknowledgments

- OpenRouter for free AI model access
- MongoDB for database solutions
- React and Node.js communities
