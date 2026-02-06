# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- MongoDB running (local or Atlas)
- OpenRouter API key (optional, for AI features)

### Step 1: Clone and Setup
```bash
# Run the setup script
./setup.sh

# Or manually:
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Configure Environment

**Backend (.env)**
```bash
cd backend
nano .env  # or your preferred editor
```

Update these values:
```
MONGODB_URI=mongodb://localhost:27017/teacher_cms
JWT_SECRET=your_secret_key_here
OPENROUTER_API_KEY=your_api_key_here  # Get from https://openrouter.ai
```

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 4: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📝 First Steps

### 1. Register a User
1. Go to http://localhost:3000/register
2. Create an account (choose role: Student or Teacher)
3. You'll be automatically logged in

### 2. As a Teacher
1. **Create a Class**
   - Navigate to "Create Class"
   - Fill in class details
   - Set max students

2. **Create Question Bank**
   - Go to "Question Banks"
   - Click "Create Bank"
   - Add questions manually or use AI

3. **AI Generate Questions**
   - Select a question bank
   - Click "AI Generate Questions"
   - Enter topic (e.g., "World War 2")
   - Choose difficulty and number of questions
   - Review and save

4. **Enroll Students**
   - Go to class details
   - Select students from dropdown
   - Click "Enroll"

5. **Create Institute** (Optional)
   - Navigate to "Create Institute"
   - Fill in institute details
   - Your role changes to Institute Owner
   - You can now hire staff

### 3. As a Student
1. **View Classes**
   - See enrolled classes on dashboard
   - View class schedules

2. **Check Homework**
   - View upcoming assignments
   - Submit homework

3. **Take Quizzes**
   - View assigned quizzes
   - Complete quizzes
   - See scores

## 🔑 Default Test Accounts

After setup, create these test accounts:

**Teacher Account:**
- Email: teacher@test.com
- Password: password123
- Role: Teacher

**Student Account:**
- Email: student@test.com
- Password: password123
- Role: Student

## 🛠️ Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
# For local MongoDB:
mongod

# Or use MongoDB Atlas and update MONGODB_URI
```

### Port Already in Use
```bash
# Change ports in .env files:
# Backend: PORT=5001
# Frontend: Update vite.config.js
```

### OpenRouter API Errors
```bash
# Get a free API key from https://openrouter.ai
# Update backend/.env with your key
# Free models available: google/gemma-2-9b-it:free
```

## 📚 Key Features to Test

1. **Multi-Role System**
   - Create users with different roles
   - See different dashboards and permissions

2. **Class Management**
   - Create classes
   - Enroll/unenroll students
   - Track attendance

3. **Student Tracking**
   - Add tuition records
   - Record presentations
   - Grade homework

4. **AI Quiz Generation**
   - Create question banks
   - Generate questions with AI
   - Create quizzes
   - Students take quizzes

5. **Institute Features**
   - Create institute
   - Hire staff
   - Manage multiple teachers

6. **Messaging**
   - Send messages between users
   - Create conversations
   - Track unread messages

7. **Public Profiles** (Coming Soon)
   - Access /api/profiles/public/:slug
   - Rate teachers/institutes
   - View public information

## 🎯 Common Tasks

### Add a Student to Class
```
Teacher → Classes → [Select Class] → Enroll Student → Choose Student → Enroll
```

### Record Tuition Payment
```
Teacher → Students → [Select Student] → Add Tuition → Fill Form → Submit
```

### Generate AI Quiz Questions
```
Teacher → Question Banks → [Select/Create Bank] → AI Generate → Enter Topic → Generate
```

### Create and Assign Quiz
```
Teacher → Quizzes → Create Quiz → Select Questions → Assign to Class → Save
```

### Submit Homework (Student)
```
Student → Homework → [Select Assignment] → Submit → Upload/Write → Submit
```

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review API endpoints in the README
- Check console logs for error messages
- Ensure all environment variables are set correctly

## 🔄 Development Workflow

1. Make changes to code
2. Backend auto-reloads with nodemon
3. Frontend auto-reloads with Vite HMR
4. Test changes immediately
5. Check browser console for frontend errors
6. Check terminal for backend errors

Happy coding! 🎉
