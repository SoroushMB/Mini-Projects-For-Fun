#!/bin/bash

echo "========================================="
echo "Teacher CMS - Project Verification"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
PASS=0
FAIL=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1 - MISSING"
        ((FAIL++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1/ - MISSING"
        ((FAIL++))
    fi
}

echo "Checking Backend Structure..."
echo "----------------------------"

# Backend directories
check_dir "backend/config"
check_dir "backend/controllers"
check_dir "backend/middleware"
check_dir "backend/models"
check_dir "backend/routes"
check_dir "backend/utils"
check_dir "backend/uploads"

# Backend files
check_file "backend/package.json"
check_file "backend/server.js"
check_file "backend/.env.example"
check_file "backend/.gitignore"

# Config files
check_file "backend/config/db.js"
check_file "backend/config/auth.js"

# Models
check_file "backend/models/User.js"
check_file "backend/models/Class.js"
check_file "backend/models/Enrollment.js"
check_file "backend/models/Tuition.js"
check_file "backend/models/Presentation.js"
check_file "backend/models/Homework.js"
check_file "backend/models/Institute.js"
check_file "backend/models/InstituteStaff.js"
check_file "backend/models/Message.js"
check_file "backend/models/PublicProfile.js"
check_file "backend/models/Quiz.js"

# Controllers
check_file "backend/controllers/authController.js"
check_file "backend/controllers/classController.js"
check_file "backend/controllers/studentController.js"
check_file "backend/controllers/instituteController.js"
check_file "backend/controllers/messageController.js"
check_file "backend/controllers/profileController.js"
check_file "backend/controllers/quizController.js"
check_file "backend/controllers/dashboardController.js"

# Routes
check_file "backend/routes/auth.js"
check_file "backend/routes/classes.js"
check_file "backend/routes/students.js"
check_file "backend/routes/institute.js"
check_file "backend/routes/messages.js"
check_file "backend/routes/profiles.js"
check_file "backend/routes/quizzes.js"
check_file "backend/routes/dashboard.js"

# Middleware
check_file "backend/middleware/auth.js"
check_file "backend/middleware/upload.js"

# Utils
check_file "backend/utils/openrouter.js"

echo ""
echo "Checking Frontend Structure..."
echo "-----------------------------"

# Frontend directories
check_dir "frontend/src"
check_dir "frontend/src/api"
check_dir "frontend/src/components"
check_dir "frontend/src/context"
check_dir "frontend/src/pages"

# Frontend files
check_file "frontend/package.json"
check_file "frontend/vite.config.js"
check_file "frontend/index.html"
check_file "frontend/.env.example"
check_file "frontend/.gitignore"

# Source files
check_file "frontend/src/main.jsx"
check_file "frontend/src/App.jsx"
check_file "frontend/src/index.css"

# API
check_file "frontend/src/api/axios.js"

# Context
check_file "frontend/src/context/AuthContext.jsx"

# Components
check_file "frontend/src/components/Layout/Navbar.jsx"
check_file "frontend/src/components/Layout/Sidebar.jsx"

# Pages
check_file "frontend/src/pages/Login.jsx"
check_file "frontend/src/pages/Register.jsx"
check_file "frontend/src/pages/Dashboard.jsx"
check_file "frontend/src/pages/Classes/ClassList.jsx"
check_file "frontend/src/pages/Classes/ClassCreate.jsx"
check_file "frontend/src/pages/Classes/ClassDetail.jsx"
check_file "frontend/src/pages/Students/StudentList.jsx"
check_file "frontend/src/pages/Students/StudentDetail.jsx"
check_file "frontend/src/pages/Institute/CreateInstitute.jsx"
check_file "frontend/src/pages/Quizzes/QuestionBank.jsx"

echo ""
echo "Checking Documentation..."
echo "------------------------"

check_file "README.md"
check_file "QUICKSTART.md"
check_file "DEPLOYMENT.md"
check_file "PROJECT_SUMMARY.md"
check_file "setup.sh"

echo ""
echo "========================================="
echo "Verification Complete"
echo "========================================="
echo -e "Passed: ${GREEN}$PASS${NC}"
echo -e "Failed: ${RED}$FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All files present! Project is complete.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run ./setup.sh to install dependencies"
    echo "2. Configure .env files"
    echo "3. Start MongoDB"
    echo "4. Run backend: cd backend && npm run dev"
    echo "5. Run frontend: cd frontend && npm run dev"
else
    echo -e "${RED}✗ Some files are missing. Please check the project structure.${NC}"
fi

echo ""
